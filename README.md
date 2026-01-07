# Linux/DevOps Command Reference Guide - Full Web Application

A comprehensive, interactive web application for Linux and DevOps command references with search, dark mode, and export functionality.

## 📋 Features

### Core Features

- **Three-Part Reference Guide**

  - Part 1: System Administration (10 sections)
  - Part 2: DevOps Tools (13 sections)
  - Part 3: Monitoring & Security (6 sections)

- **Interactive Search**

  - Real-time command search
  - Keyboard shortcut: `Ctrl+Shift+F`
  - Search history tracking
  - Highlight matching results

- **User Interface**

  - Dark mode toggle (`Ctrl+Shift+T`)
  - Responsive mobile design
  - Sticky navigation
  - Back-to-top button
  - Print-friendly layout

- **Copy & Share**

  - One-click copy to clipboard
  - Download as HTML file
  - Print version
  - Export as JSON/CSV

- **Accessibility**

  - Keyboard navigation
  - High contrast support
  - Semantic HTML
  - ARIA labels

- **Performance**
  - Lazy loading images
  - Optimized CSS/JS
  - Local storage for preferences
  - Fast search with indexing

## 📁 File Structure

```
Command Summary/
├── system-admin.html       # System Administration commands
├── devops-tools.html       # DevOps Tools commands
├── monitoring-security.html # Monitoring & Security commands
├── styles.css              # Main stylesheet
├── scripts.js              # Interactive features
├── app.py                  # Flask backend server
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Option 1: Direct HTML (No Backend)

1. Open `system-admin.html` in your web browser
2. Use navigation to switch between parts
3. All interactive features work without a server

### Option 2: Flask Server (Recommended)

**Prerequisites:**

- Python 3.7+
- pip (Python package manager)

**Installation:**

```bash
# Navigate to the Command Summary directory
cd "D:\02. Personal\Command Summary"

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

**Access:**

- Open browser to `http://localhost:5000`
- Or navigate to http://127.0.0.1:5000

## 🎯 Features Guide

### Search Commands

1. Press `Ctrl+Shift+F` to focus search box
2. Type your search term (e.g., "docker", "kubernetes")
3. Click "Search" or press Enter
4. Results show matching commands
5. Click "Reset" to show all commands

### Copy Commands

- Hover over any command block
- Click the "Copy" button in the top-right
- Command is copied to clipboard
- Visual feedback confirms copy

### Dark Mode

- Click theme toggle button (top-right)
- Or press `Ctrl+Shift+T`
- Preference saved to browser
- Automatically applies on reload

### Export Data

- **Download HTML**: Save the entire page as HTML file
- **Print**: Optimized print layout
- **API Export**: Access via Flask endpoints

## 🔌 API Endpoints (When Using Flask)

### Commands

```
GET /api/commands?filter=docker
```

Returns: List of commands matching filter

### Search

```
POST /api/search
Body: {"query": "kubectl", "file": "devops-tools.html"}
```

Returns: Detailed search results

### Statistics

```
GET /api/statistics
```

Returns: Page statistics and metadata

### Export

```
GET /api/export?format=json
GET /api/export?format=csv
```

Returns: Commands in specified format

### Health Check

```
GET /api/health
```

Returns: Server health status

## 🎨 Customization

### Change Colors

Edit `styles.css` CSS variables:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  /* ... more variables ... */
}
```

### Add New Commands

Add `<div class="command-block">` sections in HTML:

```html
<div class="command-block">
  <h4>Command Title</h4>
  <pre><code>your command here</code></pre>
</div>
```

### Modify Keyboard Shortcuts

Edit `scripts.js` `initKeyboardShortcuts()` function

## 🛠️ Troubleshooting

### Commands not showing

- Check browser console for errors (F12)
- Ensure HTML files are in same directory
- Verify CSS/JS files are loaded

### Search not working

- Clear browser cache (Ctrl+Shift+Delete)
- Check that `scripts.js` is loaded
- Verify command blocks have correct CSS class

### Flask server won't start

```bash
# Check Python version
python --version

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Check if port 5000 is available
netstat -ano | findstr :5000
```

### Dark mode not saving

- Enable localStorage in browser
- Check privacy settings
- Clear browser cache

## 📊 Statistics

- **Total Commands**: 100+
- **Total Sections**: 29
- **File Size**: ~1.5MB (HTML files)
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

## ✨ Tips & Tricks

1. **Bookmark important sections**: Use browser bookmarks for quick access
2. **Print specific sections**: Select text and print to PDF
3. **Share searches**: Copy URL with search results (via API)
4. **Keyboard navigation**: Tab through all interactive elements
5. **Mobile viewing**: Responsive design works on tablets/phones
6. **Session storage**: Search history preserved during session

## 🔐 Security Notes

- All code runs locally (no external API calls by default)
- No data is sent to external servers
- Commands are for reference only - always verify before running
- Some commands require root/sudo privileges
- Test in safe environment first

## 📝 Content Organization

### Part 1: System Administration

- System Information & Navigation
- File Operations
- Text Editors
- Permissions & Ownership
- User & Group Management
- Process Management
- Systemd Services
- Package Management
- RPM Management
- System Logging

### Part 2: DevOps Tools

- Disk Management
- Networking
- Firewall
- SSH
- Text Processing
- Bash Scripting
- Python for DevOps
- Git Version Control
- Docker
- Kubernetes
- Ansible
- Terraform
- AWS CLI

### Part 3: Monitoring & Security

- Monitoring Commands
- Security & Hardening
- Performance Tuning
- Backup & Recovery
- Automation & Scheduling
- Miscellaneous Commands
- Summary

## 🤝 Contributing

To add or modify commands:

1. Edit the relevant HTML file (system-admin.html, devops-tools.html, or monitoring-security.html)
2. Add command blocks with proper formatting
3. Maintain the `.command-block` CSS class structure
4. Test in browser
5. Verify search functionality

## 📄 License

This reference guide is provided as-is for educational and reference purposes.

## 🔗 Links

- Part 1: [System Administration](system-admin.html)
- Part 2: [DevOps Tools](devops-tools.html)
- Part 3: [Monitoring & Security](monitoring-security.html)

## 💡 Support

For issues or questions:

1. Check browser console (F12 > Console)
2. Verify all files are present
3. Try clearing browser cache
4. Restart Flask server if using backend
5. Check firewall/antivirus settings

---

**Last Updated**: 2024
**Version**: 1.0
