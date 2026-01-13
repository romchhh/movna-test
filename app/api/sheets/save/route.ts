import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

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
    const { formData, answers, score, leadId } = body;

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

    return NextResponse.json({ 
      success: true, 
      message: 'Data saved successfully' 
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
