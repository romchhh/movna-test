import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { getResultTextForCRM } from '@/utils/getResultText';

// Отримуємо ID таблиці з змінних оточення
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
// Використовуємо перший лист (gid=0)
const SHEET_NAME = 'Sheet1';

interface SaveDataRequest {
  formData?: {
    name: string;
    phone: string;
    telegram: string;
    instagram: string;
  };
  answers: Record<number, string>; // questionId -> answer value
  score?: number; // Результат тесту
  leadId?: number; // ID ліда з CRM
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
}

export async function POST(request: Request) {
  try {
    if (!SPREADSHEET_ID) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GOOGLE_SHEETS_SPREADSHEET_ID is not configured' 
        },
        { status: 500 }
      );
    }

    const body: SaveDataRequest = await request.json();
    const { formData, answers, score, leadId, utmParams } = body;

    // Логування для дебагу
    console.log('[Sheets Save API] Request received:', {
      hasFormData: !!formData,
      formDataName: formData?.name,
      formDataPhone: formData?.phone,
      score,
      leadId,
      utmParams,
      willCreateLead: !leadId && formData && (formData.name || formData.phone) && typeof score === 'number',
    });

    // Отримуємо дані з CRM, якщо є leadId
    let crmData: {
      leadId?: number;
      name?: string;
      phone?: string;
      email?: string;
    } = {};

    if (leadId) {
      try {
        const CRM_API_KEY = process.env.CRM_API_KEY;
        if (CRM_API_KEY) {
          const crmResponse = await fetch(
            `https://openapi.keycrm.app/v1/pipelines/cards/${leadId}?include=contact.client,products.offer,manager,status,payments,custom_fields`,
            {
              headers: {
                Authorization: `Bearer ${CRM_API_KEY}`,
                Accept: 'application/json',
              },
            }
          );

          if (crmResponse.ok) {
            const crmLeadData = await crmResponse.json();
            crmData.leadId = leadId;
            
            // Отримуємо контактні дані
            const contact = crmLeadData.contact;
            if (contact) {
              crmData.name = contact.name || '';
              crmData.phone = contact.phone?.[0]?.value || '';
              crmData.email = contact.email?.[0]?.value || '';
            }
          }
        }
      } catch (error) {
        console.error('Error fetching CRM data:', error);
        // Продовжуємо навіть якщо не вдалося отримати дані з CRM
      }
    }

    // Завантажуємо credentials
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Авторизуємося
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Отримуємо інформацію про листи, щоб знайти правильну назву
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    // Знаходимо перший лист (gid=0)
    const firstSheet = spreadsheetInfo.data.sheets?.[0];
    const actualSheetName = firstSheet?.properties?.title || 'Sheet1';

    // Формуємо рядок даних
    // Використовуємо дані з CRM, якщо є, інакше дані з форми
    const row: (string | undefined)[] = [
      crmData.leadId ? crmData.leadId.toString() : '', // A: ID в CRM
      crmData.name || formData?.name || '', // B: Ім'я (з CRM або форми)
      crmData.phone || formData?.phone || '', // C: Телефон (з CRM або форми)
      formData?.telegram || '', // D: Telegram (тільки з форми)
      formData?.instagram || '', // E: Instagram (тільки з форми)
      crmData.email || '', // F: Email (тільки з CRM)
    ];

    // Додаємо відповіді на 20 тестів (G-T: тест1-тест20, індекси 6-25)
    for (let i = 1; i <= 20; i++) {
      row.push(answers[i] || '');
    }

    // Тепер маємо 26 елементів (A-F: 6, G-T: 20)
    // AA - це 27-та колонка, індекс 26
    // Додаємо результат безпосередньо в колонку AA (індекс 26)
    row.push(score !== undefined ? score.toString() : '');

    // Додаємо рядок в кінець таблиці (A-AA)
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${actualSheetName}!A:AA`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    // Форматуємо персональні дані як жирний текст
    if (formData) {
      const updatedRange = appendResponse.data.updates?.updatedRange;
      if (updatedRange) {
        // Отримуємо номер рядка з updatedRange (наприклад, "Sheet1!A2:Z2")
        const rowMatch = updatedRange.match(/(\d+)/);
        if (rowMatch) {
          const rowNumber = parseInt(rowMatch[1], 10);
          
          // Форматуємо колонки B, C, D, E (персональні дані) як жирний текст
          const requests = [];
          if (formData.name) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 1, // Колонка B
                  endColumnIndex: 2,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }
          if (formData.phone) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 2, // Колонка C
                  endColumnIndex: 3,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }
          if (formData.telegram) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 3, // Колонка D
                  endColumnIndex: 4,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }
          if (formData.instagram) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 4, // Колонка E
                  endColumnIndex: 5,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }
          // Форматуємо колонку з email (колонка F) як жирний текст
          if (crmData.email) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 5, // Колонка F (Email)
                  endColumnIndex: 6,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }
          // Форматуємо колонку з результатом (колонка AA, індекс 26) як жирний текст
          // AA - це 27-та колонка (A=0, B=1, ..., Z=25, AA=26)
          if (score !== undefined) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 26, // Колонка AA (27-та колонка, індекс 26)
                  endColumnIndex: 27,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }
          // Форматуємо колонку з ID в CRM (колонка A) як жирний текст
          if (crmData.leadId) {
            requests.push({
              repeatCell: {
                range: {
                  sheetId: firstSheet?.properties?.sheetId,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 0, // Колонка A (ID в CRM)
                  endColumnIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            });
          }

          if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: SPREADSHEET_ID,
              requestBody: {
                requests,
              },
            });
          }
        }
      }
    }

    // Якщо це новий користувач (немає leadId), є форма та результат тесту,
    // створюємо нового ліда в KeyCRM у статусі "Новий" (ID 293)
    const hasValidFormData = formData && (formData.name || formData.phone);
    if (!leadId && hasValidFormData && typeof score === 'number') {
      try {
        // Лог для дебагу створення ліда в CRM
        console.log('[CRM] Creating new lead from test form', {
          hasFormData: !!formData,
          formDataName: formData?.name,
          formDataPhone: formData?.phone,
          score,
          leadId,
        });

        const CRM_API_KEY = process.env.CRM_API_KEY;
        if (CRM_API_KEY) {
          const crmHeaders = {
            Authorization: `Bearer ${CRM_API_KEY}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };

          const resultText = getResultTextForCRM(score);

          // Створюємо нового ліда у статусі "Новий" (ID 293) з джерелом 32
          const crmPayload: any = {
            title: formData.name || 'Лід з тесту',
            pipeline_id: 16, // ID воронки (з Python-скрипта: ID воронки 16)
            status_id: 293, // статус "Новий" з вашої воронки
            source_id: 32, // ID джерела: 32 (з Python-скрипта)
            contact: {
              full_name: formData.name || '',
              phone: formData.phone || '',
              // за бажанням можна зберігати socials
            },
            custom_fields: [
              {
                uuid: 'LD_1026', // Результат тестування
                value: resultText,
              },
            ],
          };

          // Додаємо UTM безпосередньо на верхньому рівні (не як вкладений об'єкт)
          if (utmParams) {
            if (utmParams.utm_source) crmPayload.utm_source = utmParams.utm_source;
            if (utmParams.utm_medium) crmPayload.utm_medium = utmParams.utm_medium;
            if (utmParams.utm_campaign) crmPayload.utm_campaign = utmParams.utm_campaign;
            if (utmParams.utm_content) crmPayload.utm_content = utmParams.utm_content;
            if (utmParams.utm_term) crmPayload.utm_term = utmParams.utm_term;
          }

          console.log('[CRM] Payload being sent to KeyCRM:', JSON.stringify(crmPayload, null, 2));

          const crmResponse = await fetch('https://openapi.keycrm.app/v1/pipelines/cards', {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(crmPayload),
          });

          if (!crmResponse.ok) {
            const errorText = await crmResponse.text().catch(() => '');
            console.error('[CRM] Lead create failed:', crmResponse.status, errorText);
          } else {
            const data = await crmResponse.json().catch(() => null);
            console.log('[CRM] Lead created successfully from test form', data);
          }
        } else {
          console.error('[CRM] CRM_API_KEY is not configured on server, lead not created');
        }
      } catch (error) {
        console.error('Error creating CRM lead:', error);
        // Не блокуємо користувача, якщо CRM недоступний
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to save data' 
      },
      { status: 500 }
    );
  }
}
