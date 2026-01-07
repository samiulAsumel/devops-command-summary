# Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Direct HTML Access (No Installation)

1. Double-click `index.html` or any `part*.html` file
2. Opens in your default browser
3. All features work without Python/Flask installed

### Step 2: Flask Server Setup (Optional - for API features)

**Windows Users:**

```
1. Double-click: start.bat
2. It will automatically:
   - Check Python installation
   - Create virtual environment
   - Install dependencies
   - Start server at http://localhost:5000
3. Browser opens automatically
4. Press Ctrl+C to stop
```

**Mac/Linux Users:**

```
1. Open terminal in this directory
2. Run: chmod +x start.sh
3. Run: ./start.sh
4. Browser opens automatically
5. Press Ctrl+C to stop
```

**Manual Setup:**

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate (Windows)
venv\Scripts\activate

# 3. Activate (Mac/Linux)
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run server
python app.py

# 6. Open browser
http://localhost:5000
```

## 📚 Usage Guide

### Navigation

- Click "Part 1/2/3" buttons to switch between guides
- Use sticky navigation for quick section access
- Back-to-top button appears when scrolling

### Search Commands

- **Keyboard:** Press `Ctrl+Shift+F` to focus search
- **Mouse:** Click search box, type term, press Enter
- Results highlight matching commands
- Click "Reset" to show all commands again

### Copy Commands

1. Find the command you want
2. Hover over the command block
3. Click the "Copy" button
4. Paste anywhere with Ctrl+V

### Dark Mode

- **Keyboard:** Press `Ctrl+Shift+T`
- **Mouse:** Click the 🌙 button (top-right)
- Preference saves automatically

### Export & Print

- **Download HTML:** Download full page
- **Print:** Optimized print layout
- **Export API:** Get JSON/CSV (Flask only)

## 🐍 Python Setup (If Needed)

### Check Python Installation

```bash
python --version
```

If not installed:

1. Visit https://www.python.org/downloads/
2. Download Python 3.8+
3. **Important:** Check "Add Python to PATH"
4. Install with default settings

### Verify pip

```bash
pip --version
```

If missing, upgrade Python or use:

```bash
python -m pip install --upgrade pip
```

## 🌐 Browser Compatibility

✅ Works with:

- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

## 📁 File Descriptions

```
system-admin.html      - System Administration (10 sections, 1600+ lines)
devops-tools.html      - DevOps Tools (13 sections, 5000+ lines)
monitoring-security.html - Monitoring & Security (6 sections, 1500+ lines)
index.html      - Landing page with navigation
styles.css      - All styling (500+ lines)
scripts.js      - Interactive features (300+ lines)
app.py          - Flask server (200+ lines)
requirements.txt - Python dependencies
start.bat       - Windows startup script
start.sh        - Mac/Linux startup script
README.md       - Full documentation
CONFIG.md       - Configuration guide
QUICKSTART.md   - This file
```

## 🎯 Common Tasks

### Task: Add a New Command

1. Open relevant part\*.html file
2. Find appropriate section
3. Add after existing command blocks:

```html
<div class="command-block">
  <h4>Your Command Title</h4>
  <pre><code>command here</code></pre>
</div>
```

4. Save file
5. Refresh browser

### Task: Change Color Scheme

1. Open `styles.css`
2. Find `:root` section (lines 8-19)
3. Change hex colors:

```css
--primary-color: #2c3e50; /* Change #2c3e50 to your color */
```

4. Save and refresh

### Task: Host on Web Server

1. Copy all files to web server directory
2. Ensure Python/Flask not required for static hosting
3. Or run Flask server with:

```bash
python app.py
```

### Task: Search Using API

```
curl http://localhost:5000/api/commands?filter=docker
curl http://localhost:5000/api/statistics
curl http://localhost:5000/api/export?format=json
```

## ⌨️ Keyboard Shortcuts

| Shortcut       | Action                 |
| -------------- | ---------------------- |
| `Ctrl+Shift+F` | Focus search box       |
| `Ctrl+Shift+T` | Toggle dark mode       |
| `Tab`          | Navigate through links |
| `Enter`        | Execute search         |
| `Escape`       | Close popup (if any)   |

## 🛠️ Troubleshooting Quick Fixes

**Problem: Files won't open in browser**

- Solution: Right-click HTML file → Open with → Choose browser

**Problem: Python not found**

- Solution: Reinstall Python, check "Add to PATH"

**Problem: Port 5000 already in use**

- Solution: Change port in app.py (line with `port=5000`)

**Problem: Styles not loading**

- Solution: Clear browser cache (Ctrl+Shift+Delete)

**Problem: Search not working**

- Solution: Open browser console (F12) and check for errors

**Problem: "Module not found" error**

- Solution: Run `pip install -r requirements.txt`

**Problem: Dark mode not saving**

- Solution: Enable cookies/localStorage in browser

## 📞 Need Help?

1. **Check Console:** Press F12, click Console tab
2. **Read README.md:** Full documentation
3. **Read CONFIG.md:** Advanced settings
4. **Check Errors:** Look for red error messages in console
5. **Restart:** Close browser and server, try again

## ✨ Features Summary

✅ 100+ Linux/DevOps commands
✅ Search & filter
✅ Copy to clipboard
✅ Dark mode
✅ Responsive mobile design
✅ Print friendly
✅ Download as HTML
✅ Export as JSON/CSV (API)
✅ Dark/light theme
✅ Keyboard shortcuts
✅ No external dependencies required
✅ 100% local - no data sent anywhere

## 🚀 Next Steps

1. **Explore:** Browse through all three parts
2. **Search:** Try searching for "docker", "kubernetes", "git"
3. **Customize:** Modify colors in styles.css
4. **Share:** Upload to GitHub or share the folder
5. **Extend:** Add your own commands

---

## One-Command Start

**Windows:**

```
start.bat
```

**Mac/Linux:**

```
./start.sh
```

That's it! Browser opens automatically at http://localhost:5000

---

**Happy Learning!** 🎉

For detailed information, see README.md
