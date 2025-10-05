# Changelog

## Version 1.2.0 - 2025-10-05

### ✨ New Features

#### Public Signup Page
- **Created**: `views/auth/signup.ejs` - Public user registration page
  - Accessible at `/signup` route
  - Form validation with password confirmation
  - Auto-assigns 'Staff' role to new signups
  - Link from login page to signup page
  
- **Auth Routes**: Added public signup endpoints
  - File: `routes/auth.js`
  - GET `/signup` - Display signup form
  - POST `/signup` - Process registration
  - Validates password match and unique username/email
  - Redirects to login after successful signup

#### Inventory List Excel Export
- **Inventory List Page**: Added "Export to Excel" button
  - File: `views/inventory/list.ejs`
  - Green button at top of page next to "Add New Item"
  - Exports all items visible based on current filters

- **Export Route**: New endpoint for bulk inventory export
  - File: `routes/inventory.js`
  - GET `/inventory/export-all`
  - Exports all inventory items with filters applied
  - Includes summary statistics row (total items, stock, value, low stock count)
  - Professional Excel formatting with column widths
  - Filename includes timestamp

### 🗑️ Removed Files

#### seed.js Removal
- **Deleted**: `seed.js` - No longer needed
- **Reason**: Public signup functionality makes seed script obsolete
- **Impact**: Users can self-register or use `create-admin` script
- **package.json**: Removed `"seed": "node seed.js"` script

### 📝 Documentation Updates

#### README.md
- Added Version 1.2.0 section to "Recent Updates"
- Updated "User Management" section with public signup instructions
- Added "Exporting Inventory" subsection
- Documented new signup flow and routes

#### SETUP_GUIDE.md
- Updated setup steps to make admin creation optional
- Added "Getting Started" section with two options:
  - Option 1: Sign up via web interface (recommended)
  - Option 2: Create admin via command line
- Updated "Key Features" with inventory export instructions
- Enhanced troubleshooting section
- Updated security notes

### 🔧 Technical Changes

#### Modified Files
1. `views/auth/login.ejs` - Added "Sign up here" link
2. `views/auth/signup.ejs` - New public signup page (created)
3. `routes/auth.js` - Added GET/POST `/signup` routes
4. `views/inventory/list.ejs` - Added "Export to Excel" button
5. `routes/inventory.js` - Added `/export-all` route with summary stats
6. `package.json` - Removed seed script
7. `README.md` - Updated documentation
8. `SETUP_GUIDE.md` - Updated setup instructions
9. `CHANGELOG.md` - This file

#### Deleted Files
1. `seed.js` - Removed (no longer needed)

### 🎯 User Experience Improvements

- **Simplified Onboarding**: Users can now register without admin intervention
- **Better Export Options**: Export entire inventory list with one click
- **Clear Navigation**: Login page has clear link to signup
- **Summary Statistics**: Inventory exports include helpful summary data
- **Professional Output**: Excel exports have proper formatting and column widths

### 📊 Statistics

- **Files Modified**: 9
- **Files Created**: 1
- **Files Deleted**: 1
- **New Routes**: 3 (GET/POST /signup, GET /inventory/export-all)
- **Lines Added**: ~200
- **Lines Removed**: ~60

---

## Version 1.1.0 - 2025-10-05

### 🔒 Security Enhancements

#### Removed Dummy Accounts
- **Login Page**: Removed hardcoded demo account credentials display
  - File: `views/auth/login.ejs`
  - Removed the section showing "Admin: admin / admin123" and "Staff: staff / staff123"
  
- **Seed Script**: Updated to prevent automatic creation of demo accounts
  - File: `seed.js`
  - Now checks if admin exists before seeding
  - Provides guidance instead of creating default accounts

#### New Admin Creation Tool
- **Created**: `createAdmin.js` - Interactive script to create admin users
  - Prompts for username, email, and password
  - Validates input (min 3 chars for username, min 6 chars for password)
  - Checks for existing users before creation
  - Added npm script: `npm run create-admin`

### ✨ New Features

#### Excel Export on Item Addition
- **Inventory Routes**: Added Excel export functionality when adding items
  - File: `routes/inventory.js`
  - New route: `GET /inventory/export-item/:id`
  - Exports item details including barcode, quantities, prices, timestamps
  - Checkbox option in add item form to trigger automatic export

- **Add Item Form**: Added export option checkbox
  - File: `views/inventory/add.ejs`
  - User can choose to export item details immediately after creation
  - Downloads Excel file with complete item information

#### Enhanced Delivery Reports

**Excel Report Improvements:**
- Added validation for populated database references
- Filter out deliveries with missing inventory or user references
- Better error handling with user-friendly messages
- Fixed date range filtering to include end-of-day timestamps
- Show "No records found" message when no data matches criteria

**PDF Report Improvements:**
- Same validation and filtering as Excel reports
- Fixed currency display (changed $ to Rs)
- Better error handling for Puppeteer PDF generation
- Improved date range handling

### 🐛 Bug Fixes

#### Delivery Report Generation
- **Issue**: Reports failing when referenced inventory items or users were deleted
- **Fix**: Added null checks and filtering for valid deliveries only
- **Files Modified**: `routes/reports.js`

#### Date Range Filtering
- **Issue**: End date not including records from the entire day
- **Fix**: Append 'T23:59:59.999Z' to end date for inclusive filtering
- **Impact**: Both Excel and PDF delivery reports

#### Empty Report Handling
- **Issue**: No feedback when no records match filter criteria
- **Fix**: Added flash message and redirect when no data found
- **User Experience**: Clear messaging instead of empty/broken downloads

### 📝 Documentation Updates

#### README.md
- Added "Recent Updates" section documenting version 1.1.0 changes
- Updated "User Management" section with new admin creation process
- Enhanced security considerations
- Updated installation instructions

#### New Files
- **SETUP_GUIDE.md**: Quick setup guide for first-time users
- **CHANGELOG.md**: This file - detailed change tracking
- **createAdmin.js**: Interactive admin user creation script

#### package.json
- Added new script: `"create-admin": "node createAdmin.js"`

### 🔧 Technical Changes

#### Modified Files
1. `views/auth/login.ejs` - Removed demo credentials display
2. `seed.js` - Removed automatic demo account creation
3. `routes/inventory.js` - Added Excel export functionality and route
4. `views/inventory/add.ejs` - Added export checkbox option
5. `routes/reports.js` - Enhanced error handling and validation
6. `package.json` - Added create-admin script
7. `README.md` - Updated documentation

#### New Files
1. `createAdmin.js` - Admin user creation utility
2. `SETUP_GUIDE.md` - Quick setup documentation
3. `CHANGELOG.md` - Version history tracking

### 🚀 Upgrade Instructions

If upgrading from version 1.0.0:

1. Pull the latest changes
2. No database migration needed
3. Create a new admin user if needed: `npm run create-admin`
4. Existing users and data remain unchanged

### ⚠️ Breaking Changes

**Security Update**: 
- Demo accounts are no longer created automatically
- Users must create their first admin account using `npm run create-admin`
- Login page no longer displays demo credentials

**Impact**: 
- New installations require manual admin creation
- Existing installations are unaffected (existing users remain)

### 📊 Statistics

- **Files Modified**: 7
- **Files Created**: 3
- **Lines Added**: ~250
- **Lines Removed**: ~30
- **Security Improvements**: 3
- **New Features**: 2
- **Bug Fixes**: 3

---

## Version 1.0.0 - Initial Release

- Basic inventory management system
- Barcode generation and scanning
- Delivery tracking
- User authentication (Admin/Staff roles)
- Excel and PDF report generation
- Dashboard with analytics
- Responsive UI with Tailwind CSS
