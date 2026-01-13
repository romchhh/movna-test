import { NextResponse } from 'next/server';
import { getResultTextForCRM } from '@/utils/getResultText';

const CRM_API_KEY = process.env.CRM_API_KEY;
const CRM_BASE_URL = 'https://openapi.keycrm.app/v1';
const TEST_RESULT_UUID = 'LD_1026';
const STATUS_COMPLETED = 417;

interface CompleteTestRequest {
  lead_id: number;
  test_result: number;
}

export async function POST(request: Request) {
  try {
    if (!CRM_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'CRM_API_KEY is not configured',
        },
        { status: 500 }
      );
    }

    const body: CompleteTestRequest = await request.json();
    const { lead_id, test_result } = body;

    if (!lead_id || test_result === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'lead_id та test_result обов\'язкові',
        },
        { status: 400 }
      );
    }

    const headers = {
      Authorization: `Bearer ${CRM_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Крок 1: Оновлюємо результат тестування (текстовий формат)
    const resultText = getResultTextForCRM(test_result);
    const updateResultResponse = await fetch(
      `${CRM_BASE_URL}/pipelines/cards/${lead_id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          custom_fields: [
            {
              uuid: TEST_RESULT_UUID,
              value: resultText,
            },
          ],
        }),
      }
    );

    if (!updateResultResponse.ok) {
      const errorData = await updateResultResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: `Не вдалося оновити результат: ${errorData.message || updateResultResponse.statusText}`,
        },
        { status: updateResultResponse.status }
      );
    }

    // Крок 2: Змінюємо статус на 417
    const updateStatusResponse = await fetch(
      `${CRM_BASE_URL}/pipelines/cards/${lead_id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status_id: STATUS_COMPLETED,
        }),
      }
    );

    if (!updateStatusResponse.ok) {
      const errorData = await updateStatusResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: `Результат оновлено, але не вдалося змінити статус: ${errorData.message || updateStatusResponse.statusText}`,
          details: {
            result_updated: true,
            status_changed: false,
          },
        },
        { status: updateStatusResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Тест успішно завершено для ліда #${lead_id}. Результат: ${resultText}`,
      details: {
        result_updated: true,
        status_changed: true,
      },
    });
  } catch (error: any) {
    console.error('Error completing test in CRM:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Помилка при обробці завершення тесту',
      },
      { status: 500 }
    );
  }
}
