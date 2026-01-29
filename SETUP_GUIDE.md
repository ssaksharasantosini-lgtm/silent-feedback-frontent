# Silent Feedback System - Setup Guide

## Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx) or PHP built-in server

## Step 1: Install MySQL/MariaDB

### For Windows:
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP (includes Apache, MySQL, and PHP)
3. Start Apache and MySQL from XAMPP Control Panel

OR

1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Install and configure MySQL

## Step 2: Create the Database

### Method 1: Using phpMyAdmin (if using XAMPP)
1. Open http://localhost/phpmyadmin
2. Click on "SQL" tab
3. Copy and paste the contents of `database.sql`
4. Click "Go" to execute

### Method 2: Using MySQL Command Line
```bash
mysql -u root -p < database.sql
```

### Method 3: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. File > Run SQL Script
4. Select `database.sql`
5. Execute

## Step 3: Configure Database Connection

Open `submitfeedback.php` and update the database credentials (lines 13-16):

```php
$host = 'localhost';
$dbname = 'silent_feedback';
$username = 'root';  // Change if needed
$password = '';      // Add your MySQL password if set
```

## Step 4: Run the Project

### Option 1: Using XAMPP
1. Copy your project folder to `C:\xampp\htdocs\`
2. Access via: http://localhost/silent%201/index.html/index.html

### Option 2: Using PHP Built-in Server
1. Open terminal in project directory
2. Run: `php -S localhost:8000`
3. Access via: http://localhost:8000/index.html/index.html

### Option 3: Using VS Code Live Server (Already installed)
1. Right-click on index.html
2. Select "Open with Live Server"
3. Note: You'll need XAMPP or MySQL running separately for database access

## Step 5: Test the System

### Default Login Credentials:

**HR Account:**
- Email: hr@company.com
- Password: password
- Role: HR Manager

**Employee Account:**
- Email: employee@company.com
- Password: password
- Role: Employee

## Troubleshooting

### Error: "Database connection failed"
- Make sure MySQL service is running
- Check database credentials in `submitfeedback.php`
- Verify database `silent_feedback` exists

### Error: "Connection error" on signup/login
- Ensure PHP is processing the `submitfeedback.php` file
- Check browser console for errors
- Verify the file path in JavaScript matches your folder structure

### XAMPP Not Starting MySQL
- Check if another MySQL service is running
- Try changing MySQL port in XAMPP config
- Run XAMPP as Administrator

### PHP Not Found
- Install PHP: https://www.php.net/downloads
- Or use XAMPP which includes PHP

## Database Structure

The system ensures COMPLETE ANONYMITY:
- ✅ Users table: Only for authentication
- ✅ Feedback table: NO user_id column
- ✅ No way to trace feedback back to users
- ✅ Even database admins cannot identify who submitted what

## Project Features Working After Setup

✅ User Registration & Login
✅ Role-based access (Employee/HR)
✅ Anonymous feedback submission
✅ HR dashboard with analytics
✅ Feedback filtering and search
✅ Status management
✅ Custom question management
✅ Real-time statistics

## Security Notes

1. Change default passwords before production
2. Use HTTPS in production
3. Update database credentials
4. Enable PHP error logging (not display) in production
5. Add input sanitization as needed
6. Consider adding CSRF protection

## Support

For issues:
1. Check browser console (F12)
2. Check PHP error logs
3. Verify all database tables exist
4. Ensure proper file permissions

Enjoy your Silent Feedback System! 🎉
