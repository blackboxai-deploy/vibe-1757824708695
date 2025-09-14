# Google Services Setup Guide

This guide provides detailed instructions for setting up Google Sheets API and Google Drive integration for the Employee ID Card System.

## 📋 Prerequisites

- Google account
- Access to Google Cloud Console
- Basic understanding of Google Sheets and Google Drive

## 🔧 Google Cloud Console Setup

### Step 1: Create or Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Either create a new project or select an existing one:
   - **New Project**: Click "New Project" → Enter project name → Create
   - **Existing Project**: Select from the dropdown

### Step 2: Enable Google Sheets API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on **"Google Sheets API"** from the results
4. Click **"Enable"** button
5. Wait for the API to be enabled

### Step 3: Create API Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the generated API key
4. (Optional but recommended) Click **"Restrict Key"** to configure restrictions:
   - **API Restrictions**: Select "Google Sheets API"
   - **Application Restrictions**: Choose based on your deployment (e.g., HTTP referrers for web apps)
5. Save the restrictions

## 📊 Google Sheets Setup

### Step 1: Create Employee Data Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet or use existing one
3. Name it (e.g., "Employee Database")

### Step 2: Set Up Column Headers

Create exactly these column headers in Row 1 (A1:T1):

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| username | password | OFFICE | EMPLOYEE NO. | LAST NAME | FIRST NAME | MIDDLE INITIAL | SUFFIX | STATUS OF EMPLOYMENT | POSITION |

| K | L | M | N | O | P | Q | R | S | T |
|---|---|---|---|---|---|---|---|---|---|
| NAME OF THE CONTACT PERSON | CONTACT NO. | HOME ADDRESS | BIRTHDAY | TIN | GSIS | PAG-IBIG | PHILHEALTH | BLOODTYPE | PHOTOURL |

### Step 3: Add Sample Data

Add sample employee data in rows 2 and beyond:

**Row 2 (Employee 1):**
```
john.doe | demo123 | Main Office | EMP001 | Doe | John | M | | Regular | Software Developer | Jane Smith | +1-555-0123 | 123 Main St, Anytown | 1990-05-15 | 123-456-789 | GSIS123456 | PAGIBIG789 | PH123456789 | A+ | [Google Drive Photo URL]
```

**Row 3 (Employee 2):**
```
jane.smith | demo456 | Branch Office | EMP002 | Smith | Jane | A | | Regular | Project Manager | Bob Johnson | +1-555-0456 | 456 Oak Ave, Somewhere | 1988-08-22 | 987-654-321 | GSIS654321 | PAGIBIG456 | PH987654321 | B+ | [Google Drive Photo URL]
```

### Step 4: Make Sheet Publicly Readable

1. Click **"Share"** button (top-right corner)
2. Click **"Change to anyone with the link"**
3. Set permission to **"Viewer"**
4. Click **"Done"**

### Step 5: Get Sheet ID

From the URL of your Google Sheet, extract the Sheet ID:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0
                                        ^^^^^^^^^^^^^^^^
```

## 📁 Google Drive Photo Setup

### Step 1: Prepare Employee Photos

1. **Photo Requirements:**
   - Size: Minimum 300x400px (3:4 aspect ratio recommended)
   - Format: JPG or PNG
   - Style: Professional headshot
   - Background: Solid color or professional background

### Step 2: Upload Photos to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Create a folder for employee photos (e.g., "Employee Photos")
3. Upload all employee photos
4. Name files clearly (e.g., "john_doe.jpg", "jane_smith.png")

### Step 3: Make Photos Publicly Accessible

For each photo:
1. Right-click the photo → **"Share"**
2. Change access to **"Anyone with the link"**
3. Set permission to **"Viewer"**
4. Copy the sharing link

The link will look like:
```
https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing
```

### Step 4: Add Photo URLs to Spreadsheet

Paste the Google Drive sharing links into the **PHOTOURL** column (Column T) of your Google Sheet.

## 🔐 Environment Configuration

### Step 1: Create .env.local File

In your project root, create a `.env.local` file:

```bash
# Google Sheets API Configuration
GOOGLE_SHEETS_API_KEY=your_api_key_from_step_3
GOOGLE_SHEET_ID=your_sheet_id_from_step_5
GOOGLE_SHEET_NAME=Sheet1

# App Configuration
NEXTAUTH_SECRET=your_random_secret_key_here
NEXT_PUBLIC_APP_NAME=Employee Digital ID Card System
```

### Step 2: Configure Values

Replace the following values:

- **GOOGLE_SHEETS_API_KEY**: API key from Google Cloud Console
- **GOOGLE_SHEET_ID**: Sheet ID from your Google Sheets URL
- **GOOGLE_SHEET_NAME**: Name of the sheet tab (usually "Sheet1")
- **NEXTAUTH_SECRET**: Generate a random secret key (minimum 32 characters)

## 🧪 Testing Your Setup

### Test 1: API Key Validation

Run this command to test your API key:
```bash
curl "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:T10?key=YOUR_API_KEY"
```

Expected response: JSON data with your sheet values.

### Test 2: Application Testing

1. Start your application:
   ```bash
   pnpm dev
   ```

2. Try logging in with your test credentials
3. Verify that employee data loads correctly
4. Check that photos display properly

## 🚨 Security Best Practices

### API Key Security

1. **Restrict API Key:**
   - Set HTTP referrer restrictions for web deployment
   - Limit to specific IP addresses for server deployment
   - Only enable required APIs (Google Sheets API)

2. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use different API keys for development and production
   - Regenerate API keys periodically

### Sheet Security

1. **Access Control:**
   - Use "Anyone with the link" instead of "Public"
   - Consider service account authentication for production
   - Monitor access logs regularly

2. **Data Protection:**
   - Don't store sensitive personal information
   - Use strong passwords for employee accounts
   - Consider encrypting sensitive fields

## 🔄 Production Deployment

### Vercel Deployment

1. **Environment Variables:**
   - Add all `.env.local` variables to Vercel dashboard
   - Go to Project Settings → Environment Variables
   - Add each variable (without the .env.local file)

2. **API Key Restrictions:**
   - Update API key restrictions to include your Vercel domain
   - Add both `*.vercel.app` and your custom domain

### Other Platforms

For other deployment platforms:
1. Set environment variables in platform dashboard
2. Update API key restrictions for your domain
3. Ensure HTTPS is enabled for security

## 📞 Troubleshooting

### Common Issues

**"API key not valid" Error:**
- Check if Google Sheets API is enabled
- Verify API key is correct and not restricted
- Ensure no extra spaces in environment variables

**"Sheet not found" Error:**
- Verify Google Sheet ID is correct
- Check sheet name matches GOOGLE_SHEET_NAME
- Ensure sheet is publicly accessible

**"Photos not loading" Error:**
- Verify photos are shared publicly
- Check URL format in spreadsheet
- Ensure files are actually images (JPG/PNG)

**"Access denied" Error:**
- Check sheet permissions (should be "Anyone with the link")
- Verify API key restrictions allow your domain
- Try making sheet completely public temporarily

### Getting Help

1. Check browser console for detailed error messages
2. Test API calls directly with curl commands
3. Verify all setup steps were followed correctly
4. Check Google Cloud Console for API usage and errors

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Need more help?** Check the main README.md troubleshooting section or create an issue in the repository.