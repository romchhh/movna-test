import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Отримуємо ID таблиці з змінних оточення
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
// Використовуємо перший лист (gid=0) - зазвичай це 'Sheet1' або можна використати індекс
const SHEET_NAME = 'Sheet1'; // Якщо не працює, спробуйте отримати назву через API

export async function GET() {
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

    // Заголовки колонок
    const headers = [
      'ID в CRM',
      'Ваше Ім\'я та Прізвище',
      'Номер телефону',
      'Нік в телеграм через @',
      'Нік в інстаграм',
      'Email',
      'тест1',
      'тест2',
      'тест3',
      'тест4',
      'тест5',
      'тест6',
      'тест7',
      'тест8',
      'тест9',
      'тест10',
      'тест11',
      'тест12',
      'тест13',
      'тест14',
      'тест15',
      'тест16',
      'тест17',
      'тест18',
      'тест19',
      'тест20',
      'Результат', // AA (27-та колонка, індекс 26)
    ];

    // Перевіряємо, чи існує перший рядок
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${actualSheetName}!A1:AA1`,
    });

    // Якщо заголовки вже є, не перезаписуємо
    if (existingData.data.values && existingData.data.values.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Headers already exist',
        existingHeaders: existingData.data.values[0]
      });
    }

    // Додаємо заголовки
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${actualSheetName}!A1:AA1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Sheet initialized successfully' 
    });
  } catch (error: any) {
    console.error('Error initializing sheet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to initialize sheet' 
      },
      { status: 500 }
    );
  }
}
