# Uniform Inventory & Barcode System

A simple web-based inventory management system for uniforms with barcode scanning for delivery tracking.

**Development Version**

## ✨ Features

### 🔐 Authentication System
- **Admin Login**: Full system access with user management
- **Staff Login**: Limited access for delivery operations
- Secure session-based authentication

### 📦 Inventory Management
- **Add/Edit/Delete Items**: Complete CRUD operations for inventory items
- **Categories**: T-Shirts, Jackets, Caps, Trousers
- **Auto-Generated Barcodes**: Unique barcodes for each item
- **Stock Tracking**: Real-time quantity monitoring
- **Low Stock Alerts**: Automatic notifications for items ≤10 units

### 📱 Barcode Scanning
- **Webcam Support**: Real-time barcode scanning using device camera
- **Manual Input**: Option to enter barcodes manually
- **Multiple Formats**: Supports Code128, EAN, UPC, and more
- **Mobile Responsive**: Works on smartphones and tablets

### 🚚 Delivery System
- **Barcode Scanning**: Scan items for delivery processing
- **Auto-Fill Details**: Product information populated automatically
- **Stock Reduction**: Automatic inventory updates
- **Customer Tracking**: Record customer name and delivery date
- **Delivery History**: Complete audit trail of all deliveries

### 📊 Reports & Analytics
- **Excel Export**: Detailed reports in .xlsx format
- **PDF Export**: Professional reports for printing/sharing
- **Dashboard Analytics**: Real-time statistics and insights
- **Filtering Options**: Date ranges, customer names, categories

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all device sizes
- **Tailwind CSS**: Modern, clean interface
- **Real-time Updates**: Live data refresh
- **Intuitive Navigation**: Easy-to-use interface

## Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Bwip-js**: Barcode generation
- **QuaggaJS**: Barcode scanning

### Frontend
- **EJS**: Template engine
- **Tailwind CSS**: Styling framework
- **Font Awesome**: Icons
- **JavaScript**: Client-side functionality

### Additional Libraries
- **XLSX**: Excel file generation
- **Puppeteer**: PDF generation
- **Moment.js**: Date handling
- **Bcrypt**: Password hashing

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+) 
- npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `config.env.example` to `config.env` (if exists)
   - Update MongoDB URI and session secret in `config.env`

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Create your first admin user:**
   ```bash
   npm run create-admin
   ```
   Follow the prompts to create an admin account with your own credentials.

5. **Start application:**
   ```bash
   npm start
   ```

6. **Open browser:** http://localhost:3000

## User Management

### Creating Your First Admin User

For security reasons, dummy accounts have been removed. To create your first admin user:

```bash
npm run create-admin
```

You'll be prompted to enter:
- Username (min 3 characters)
- Email address
- Password (min 6 characters)

### Public User Registration

Users can now sign up directly from the login page:
1. Visit http://localhost:3000/signup
2. Fill in username, email, and password
3. New users are created with **Staff** role by default
4. After signup, login with your credentials

### Adding Additional Users (Admin Only)

Once logged in as admin:
1. Navigate to **Add User** in the top menu
2. Fill in user details (username, email, password, role)
3. Choose role: **Admin** (full access) or **Staff** (delivery & reports)

## Usage Guide

### 1. First Login
- Login with your admin account credentials
- Set up your inventory items with categories, sizes, and colors
- Each item gets a unique auto-generated barcode

### 2. Adding Inventory
- Navigate to **Inventory** → **Add New Item**
- Fill in item details (name, category, size, color, quantity, price)
- Barcode is automatically generated
- **NEW**: Check "Export item details to Excel" to download item info immediately
- Items appear in the inventory list with barcode images

### 2.1. Exporting Inventory
- On the **Inventory List** page, click **"Export to Excel"** button
- Downloads complete inventory with summary statistics
- Includes: item details, stock levels, values, and timestamps

### 3. Processing Deliveries
- Go to **Scan Delivery**
- Start camera for barcode scanning OR enter barcode manually
- Item details auto-populate
- Enter customer name and quantity
- System automatically reduces stock

### 4. Generating Reports
- Visit **Reports** section
- Choose delivery or inventory reports
- Select date ranges and filters
- Export as Excel (.xlsx) or PDF (.pdf)

### 5. Dashboard Monitoring
- View real-time statistics
- Monitor low stock items
- Track recent deliveries
- Category-wise stock overview

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /register` - Admin user registration page
- `POST /register` - Create new user (admin only)

### Inventory
- `GET /inventory` - List all items
- `GET /inventory/add` - Add item form
- `POST /inventory/add` - Create new item
- `GET /inventory/edit/:id` - Edit item form
- `POST /inventory/edit/:id` - Update item
- `POST /inventory/delete/:id` - Delete item
- `GET /inventory/barcode/:barcode` - Get barcode image
- `GET /inventory/api/barcode/:barcode` - Get item by barcode (API)

### Delivery
- `GET /delivery/scan` - Delivery scanning page
- `POST /delivery/scan` - Process barcode scan
- `POST /delivery/record` - Record delivery
- `GET /delivery/history` - Delivery history
- `GET /delivery/api/stats` - Delivery statistics (API)

### Reports
- `GET /reports` - Reports page
- `GET /reports/delivery/excel` - Export delivery Excel
- `GET /reports/delivery/pdf` - Export delivery PDF
- `GET /reports/inventory/excel` - Export inventory Excel

### Dashboard
- `GET /dashboard` - Main dashboard
- `GET /dashboard/api/stats` - Dashboard statistics (API)

## File Structure

```
uniform-inventory-system/
├── config.env                 # Environment variables
├── package.json              # Dependencies and scripts
├── server.js                 # Main application file
├── seed.js                   # Database seeding script
├── README.md                 # This file
├── models/                   # Database models
│   ├── User.js              # User model
│   ├── Inventory.js         # Inventory model
│   └── Delivery.js          # Delivery model
├── routes/                   # Route handlers
│   ├── auth.js              # Authentication routes
│   ├── inventory.js         # Inventory routes
│   ├── delivery.js          # Delivery routes
│   ├── reports.js           # Report routes
│   └── dashboard.js         # Dashboard routes
├── middleware/               # Custom middleware
│   └── auth.js              # Authentication middleware
└── views/                    # EJS templates
    ├── layout.ejs           # Main layout
    ├── error.ejs            # Error page
    ├── auth/                # Authentication views
    │   ├── login.ejs
    │   └── register.ejs
    ├── dashboard/           # Dashboard views
    │   └── index.ejs
    ├── inventory/           # Inventory views
    │   ├── list.ejs
    │   ├── add.ejs
    │   └── edit.ejs
    ├── delivery/            # Delivery views
    │   ├── scan.ejs
    │   └── history.ejs
    └── reports/             # Report views
        └── index.ejs
```

## 🛠️ Troubleshooting

### 🔴 Common Issues & Solutions

<details>
<summary><strong>📋 MongoDB Connection Error</strong></summary>

**Symptoms**: `MongoDB connection error` or `ECONNREFUSED`

**Solutions**:
- ✓ Ensure MongoDB service is running
- ✓ Check `config.env` connection string
- ✓ Verify MongoDB is on port 27017
- ✓ Try: `mongosh` to test connection

```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/uniform_inventory
```
</details>

<details>
<summary><strong>📹 Camera/Barcode Scanning Issues</strong></summary>

**Symptoms**: Camera not loading or barcode not recognized

**Solutions**:
- ✓ Use HTTPS in production (required for camera access)
- ✓ Grant browser camera permissions
- ✓ Ensure good lighting conditions
- ✓ Hold barcode steady in camera view
- ✓ Use manual barcode input as fallback
- ✓ Try different barcode formats (Code128, EAN)

</details>

<details>
<summary><strong>📈 Reports Not Generating</strong></summary>

**Symptoms**: PDF/Excel downloads fail or timeout

**Solutions**:
- ✓ Check Puppeteer installation: `npm ls puppeteer`
- ✓ Ensure sufficient disk space
- ✓ Verify date range selections
- ✓ Check browser popup/download blockers

</details>

<details>
<summary><strong>🚀 Performance Issues</strong></summary>

**Solutions**:
- ✓ Add database indexes for frequently queried fields
- ✓ Implement pagination for large datasets
- ✓ Consider caching for barcode images
- ✓ Monitor MongoDB performance

</details>

### Performance Optimization

1. **Database Indexing**
   - Barcode field is indexed for fast lookups
   - Consider adding indexes for frequently queried fields

2. **Image Optimization**
   - Barcode images are generated on-demand
   - Consider caching for frequently accessed barcodes

3. **Pagination**
   - Large datasets are paginated for better performance
   - Adjust page size in route files if needed

## Recent Updates

### Version 1.2.0 - Public Signup & Enhanced Export

**New Features:**
- ✅ **Public Signup Page**: Users can now register directly from the login page
  - Accessible at `/signup` route
  - New users get 'Staff' role by default
  - Password confirmation validation
  - Link from login page to signup
- ✅ **Inventory List Export**: Export all inventory items to Excel from the list page
  - Includes summary statistics (total items, stock, value)
  - Filters apply to export (category, search)
  - Professional formatting with column widths

**System Improvements:**
- ✅ **Removed seed.js**: No longer needed with public signup functionality
- ✅ **Simplified Setup**: Users can self-register, admins use `create-admin` script
- ✅ **Better User Flow**: Clear signup/login navigation

### Version 1.1.0 - Security & Feature Enhancements

**Security Improvements:**
- ✅ Removed hardcoded dummy accounts from login page
- ✅ Updated seed script to prevent automatic creation of demo accounts
- ✅ Added interactive admin user creation script (`npm run create-admin`)
- ✅ Enhanced password security requirements

**New Features:**
- ✅ **Excel Export on Item Creation**: Option to export item details to Excel immediately after adding
- ✅ **Enhanced Delivery Reports**: Improved Excel and PDF generation with better error handling
- ✅ **Data Validation**: Added null checks and validation for populated database references
- ✅ **Better Date Filtering**: Fixed date range filtering to include end-of-day timestamps

**Bug Fixes:**
- ✅ Fixed delivery report generation issues (Excel & PDF)
- ✅ Resolved missing data in reports when references are deleted
- ✅ Improved error messages for empty report results

## Security Considerations

1. **User Account Management**
   - No default passwords - create your own admin account
   - Use strong, unique passwords (minimum 6 characters)
   - Regularly update user credentials

2. **Environment Variables**
   - Change JWT and session secrets in production
   - Use environment-specific configurations
   - Never commit `.env` files to version control

3. **HTTPS in Production**
   - Enable HTTPS for secure camera access
   - Update session cookie settings (`secure: true`)

4. **Database Security**
   - Use MongoDB authentication
   - Restrict database access to application only
   - Regular backups recommended

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue in the repository

---

**Built with ❤️ for efficient inventory management**
