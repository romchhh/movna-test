This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Sheets Integration

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file in the root directory:**
   ```bash
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
   CRM_API_KEY=your_crm_api_key_here
   ```
   - Replace `your_spreadsheet_id_here` with your actual Google Sheets ID
   - Replace `your_crm_api_key_here` with your CRM API key
   - The file is already in `.gitignore` for security

3. **Place credentials.json in the root directory:**
   - The file should contain your Google Service Account credentials
   - This file is already in `.gitignore` for security

4. **Initialize the Google Sheet:**
   - Make sure your service account has access to the spreadsheet
   - Visit `http://localhost:3000/api/sheets/init` to initialize the sheet with headers
   - Or call the API endpoint programmatically

### API Endpoints

- **GET `/api/sheets/init`** - Initializes the Google Sheet with column headers:
  - ID в CRM
  - Ваше Ім'я та Прізвище
  - Номер телефону
  - Нік в телеграм через @
  - Нік в інстаграм
  - тест1 - тест20 (20 columns for quiz answers)

- **POST `/api/sheets/save`** - Saves quiz data to the sheet:
  - With form: saves personal data + all 20 quiz answers
  - Without form: saves only quiz answers, leaves ID в CRM and personal data empty

### How it works

- When a user completes the quiz with a form (`/placement_test_with_form`), their personal data and all answers are saved to Google Sheets
- When a user completes the quiz without a form (`/placement_test`), only the quiz answers are saved (personal data fields remain empty)

## CRM Integration

### Daemon Script

The daemon script (`crm_imtegration/main.py`) automatically checks for leads with status 295 (in progress) every minute and generates test links for leads where the `LD_1024` field is empty.

**To run the daemon:**
```bash
cd crm_imtegration
pip install -r requirements.txt
python main.py
```

**Configuration via environment variables:**
```bash
export CRM_API_KEY="your_api_key_here"
export BASE_TEST_URL="https://movna-test.vercel.app"
export CRM_CHECK_INTERVAL="60"  # seconds
```

Or create a `.env` file in the `crm_imtegration` directory:
```
CRM_API_KEY=your_api_key_here
BASE_TEST_URL=https://movna-test.vercel.app
CRM_CHECK_INTERVAL=60
```

The daemon will:
- Check all leads with status 295 every 60 seconds (configurable)
- Generate test links (`/placement_test?id={lead_id}`) for leads with empty `LD_1024` field
- Update the CRM with the generated link

### Complete Test API

When a user completes the test via a link with `?id={lead_id}`, the system automatically:
1. Saves the test result to field `LD_1026` in CRM
2. Changes the lead status to 417 (Completed)

**API Endpoint:**
- **POST `/api/crm/complete-test`** - Completes test in CRM:
  ```json
  {
    "lead_id": 12345,
    "test_result": 15
  }
  ```

This endpoint is automatically called from the frontend when a test is completed with a `lead_id` parameter.
