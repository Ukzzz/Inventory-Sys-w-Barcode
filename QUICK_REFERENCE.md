# Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start the application
npm start

# Create admin user (optional)
npm run create-admin
```

## 🌐 URLs

| Page | URL | Access |
|------|-----|--------|
| Login | http://localhost:3000/login | Public |
| Signup | http://localhost:3000/signup | Public |
| Dashboard | http://localhost:3000/dashboard | Authenticated |
| Inventory | http://localhost:3000/inventory | Authenticated |
| Add Item | http://localhost:3000/inventory/add | Admin Only |
| Scan Delivery | http://localhost:3000/delivery/scan | Authenticated |
| Reports | http://localhost:3000/reports | Staff+ |
| Register User | http://localhost:3000/register | Admin Only |

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Staff** | View inventory, process deliveries, generate reports |
| **Admin** | All staff permissions + manage inventory, manage users |

## 📥 Export Features

### 1. Export Single Item
- **Where**: After adding a new item
- **How**: Check "Export item details to Excel" checkbox
- **Result**: Downloads item details immediately

### 2. Export Inventory List
- **Where**: Inventory list page
- **How**: Click green "Export to Excel" button
- **Result**: Downloads all items with summary statistics

### 3. Export Delivery Report
- **Where**: Reports page
- **How**: Select filters → Click "Export Excel" or "Export PDF"
- **Result**: Downloads delivery report

### 4. Export Inventory Report
- **Where**: Reports page
- **How**: Select category/filters → Click "Export Excel"
- **Result**: Downloads inventory report

## 🔐 Account Creation

### Method 1: Public Signup (Staff Role)
1. Go to http://localhost:3000/signup
2. Fill in username, email, password
3. Confirm password
4. Click "Create Account"
5. Login with credentials

### Method 2: Admin Creation (Admin Role)
```bash
npm run create-admin
```
Follow prompts to create admin user

### Method 3: Admin Creates User (Any Role)
1. Login as admin
2. Click "Add User" in navigation
3. Fill in user details
4. Select role (Admin or Staff)
5. Click "Register User"

## 📊 Key Features

| Feature | Description |
|---------|-------------|
| **Barcode Generation** | Automatic unique barcode for each item |
| **Barcode Scanning** | Camera-based or manual entry |
| **Stock Management** | Real-time quantity tracking |
| **Low Stock Alerts** | Automatic alerts for items ≤10 |
| **Delivery Tracking** | Complete audit trail |
| **Excel Export** | Multiple export options |
| **PDF Reports** | Professional formatted reports |
| **User Management** | Role-based access control |

## 🎯 Common Tasks

### Add Inventory Item
1. Navigate to Inventory → Add New Item
2. Fill in details (name, category, size, color, quantity, price)
3. Optional: Check export checkbox
4. Click "Add Item"

### Process Delivery
1. Go to Scan Delivery
2. Scan barcode or enter manually
3. Enter customer name and quantity
4. Click "Process Delivery"

### Generate Report
1. Navigate to Reports
2. Select report type
3. Choose date range/filters
4. Click "Export Excel" or "Export PDF"

### Export All Inventory
1. Navigate to Inventory
2. Apply filters (optional)
3. Click "Export to Excel"

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Sign up at /signup or run `npm run create-admin` |
| MongoDB error | Start MongoDB with `mongod` |
| Reports not generating | Check date range, ensure data exists |
| Camera not working | Grant browser permissions, use manual entry |
| Export not downloading | Check browser download settings |

## 📱 Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ Camera scanning requires HTTPS in production

## 🔒 Security Best Practices

1. ✅ Use strong passwords (min 6 characters)
2. ✅ Change session secrets in production
3. ✅ Enable HTTPS for production
4. ✅ Use MongoDB authentication
5. ✅ Regular backups recommended

## 📞 Need Help?

- Check **README.md** for detailed documentation
- Review **SETUP_GUIDE.md** for setup instructions
- See **CHANGELOG.md** for version history
- Read **IMPLEMENTATION_SUMMARY.md** for feature details

---

**Version**: 1.2.0  
**Status**: Production Ready ✅  
**Last Updated**: 2025-10-05
