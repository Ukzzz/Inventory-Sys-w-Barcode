# Quick Setup Guide

## Initial Setup (First Time)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Make sure your `config.env` file has the correct MongoDB URI and session secret.

### 3. Start MongoDB
```bash
mongod
```

### 4. Create Your First Admin User (Optional)
```bash
npm run create-admin
```

Follow the interactive prompts:
- Enter a username (minimum 3 characters)
- Enter an email address
- Enter a password (minimum 6 characters)

**Note**: You can also sign up directly from the web interface!

### 5. Start the Application
```bash
npm start
```

### 6. Access the Application
Open your browser and navigate to: **http://localhost:3000**

---

## Getting Started

### Option 1: Sign Up (Recommended for Regular Users)

1. Go to http://localhost:3000
2. Click **"Sign up here"** on the login page
3. Fill in your details:
   - Username (min 3 characters)
   - Email address
   - Password (min 6 characters)
   - Confirm password
4. Click **"Create Account"**
5. You'll be redirected to login - use your new credentials
6. **Note**: New signups get 'Staff' role by default

### Option 2: Create Admin via Command Line

1. Run `npm run create-admin` (as shown in step 4 above)
2. This creates an admin user with full permissions
3. Login at http://localhost:3000 with your admin credentials

---

## Adding More Users

Once logged in as admin:

1. Click **"Add User"** in the top navigation menu
2. Fill in the user details:
   - Username
   - Email
   - Password
   - Role (Admin or Staff)
3. Click **"Register User"**

**Roles:**
- **Admin**: Full access to all features including user management and inventory management
- **Staff**: Access to delivery scanning, history, and reports (cannot manage users or inventory)

---

## Key Features

### 1. Adding Inventory Items
1. Navigate to **Inventory** → **Add New Item**
2. Fill in the item details
3. **NEW**: Check "Export item details to Excel" to download the item info immediately
4. Click **"Add Item"**

### 1.1. Exporting Inventory List
1. Navigate to **Inventory** page
2. Click **"Export to Excel"** button (green button at top)
3. Excel file downloads with all inventory items and summary statistics
4. Filters (category, search) apply to the export

### 2. Processing Deliveries
1. Go to **Scan Delivery**
2. Use camera to scan barcode OR enter manually
3. Fill in customer details
4. Click **"Process Delivery"**

### 3. Generating Reports
1. Navigate to **Reports**
2. Select report type (Delivery or Inventory)
3. Choose filters (date range, category, etc.)
4. Click **"Export Excel"** or **"Export PDF"**

---

## Troubleshooting

### Cannot Login
- Try signing up at http://localhost:3000/signup
- Or create an admin user using `npm run create-admin`
- Check that MongoDB is running
- Verify your credentials are correct

### Reports Not Generating
- Ensure you have delivery/inventory data in the database
- Check the date range selected
- Make sure Puppeteer is installed: `npm ls puppeteer`

### Camera Not Working
- Grant browser camera permissions
- Use HTTPS in production
- Try manual barcode entry as fallback

---

## Security Notes

⚠️ **Important Security Updates:**

1. **Public Signup Available**: Users can now register directly from the login page at `/signup`

2. **No Default Accounts**: For security, dummy accounts have been removed. Create accounts via signup or `create-admin` script.

3. **Strong Passwords**: Use strong, unique passwords for all accounts.

3. **Production Deployment**: 
   - Change session secrets in `config.env`
   - Enable HTTPS
   - Use MongoDB authentication

---

## Need Help?

- Check the main README.md for detailed documentation
- Review the troubleshooting section
- Ensure all dependencies are installed correctly

---

**Happy Inventory Managing! 📦**
