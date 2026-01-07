# Configuration Guide for Command Reference Web App

## Server Configuration

### Port Settings (app.py)

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

Change `port=5000` to any available port (e.g., 8080, 3000)

### Debug Mode

- `debug=True`: Reload on code changes, detailed error messages (Development)
- `debug=False`: Production mode (safer, faster)

## Frontend Configuration (scripts.js)

### API Endpoints

```javascript
// Change API base URL if hosting on different server
const API_BASE = "http://localhost:5000/api";
```

### Search Settings

- Maximum results per search: 50
- Case-insensitive search enabled by default

### Dark Mode

- Default theme: Light
- Persistent: Saved to browser localStorage

## Styling Customization (styles.css)

### Color Scheme Variables

```css
:root {
  --primary-color: #2c3e50; /* Main heading color */
  --secondary-color: #3498db; /* Links, buttons */
  --accent-color: #e74c3c; /* Hover effects */
  --bg-color: #ecf0f1; /* Page background */
  --text-color: #2c3e50; /* Main text */
  --border-color: #bdc3c7; /* Borders */
  --code-bg: #f4f4f4; /* Code blocks */
  --success-color: #27ae60; /* Success messages */
  --warning-color: #f39c12; /* Warnings */
}
```

### Responsive Breakpoints

- Mobile: Max-width 768px
- Tablet: Max-width 1024px
- Desktop: Full width

## Content Management

### Adding New Commands

1. Open the relevant HTML file (system-admin.html, devops-tools.html, monitoring-security.html)
2. Find the appropriate section
3. Add new command block:

```html
<div class="command-block">
  <h4>Command Title</h4>
  <pre><code>your command here
with multiple lines
supported</code></pre>
</div>
```

### Adding New Sections

1. Add section ID to navigation links
2. Create section header: `<h2 id="section-id">Section Title</h2>`
3. Add commands as described above
4. Update section index if needed

## Database/Storage

Currently: No persistent database

- All data stored in HTML files
- Search indexes built on page load
- Settings stored in browser localStorage

To add database:

1. Create models in app.py
2. Use SQLite, PostgreSQL, or MongoDB
3. Update Flask routes to query database
4. Add admin interface for management

## Performance Optimization

### Current Optimizations

- Lazy loading for images
- Minified CSS/JS possible
- Efficient search algorithm
- Caching via browser localStorage

### Further Optimizations

1. Minify CSS/JS files
2. Implement service workers for offline mode
3. Add content compression
4. Use CDN for static files
5. Implement pagination for large result sets

## Security Considerations

### Current Security Features

- No external API calls
- No user authentication required
- Read-only operations

### If Adding User Accounts

1. Use secure authentication (OAuth, JWT)
2. Hash passwords (bcrypt, argon2)
3. Implement HTTPS
4. Add CSRF protection
5. Validate all inputs
6. Implement rate limiting

### If Accepting User Submissions

1. Sanitize HTML input
2. Validate command syntax
3. Implement moderation workflow
4. Add audit logging
5. Backup before changes

## Deployment Options

### Option 1: Local Flask Server

```bash
python app.py
```

Access at: http://localhost:5000

### Option 2: Static HTML Only

- Copy all HTML, CSS, JS files to web server
- No Python/Flask required
- Deploy to GitHub Pages, Netlify, etc.

### Option 3: Cloud Deployment

- Heroku: Push Python app to Heroku
- AWS: Use EC2 + Flask
- Azure: Azure App Service
- Google Cloud: Cloud Run or App Engine

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Build and run:

```bash
docker build -t command-ref .
docker run -p 5000:5000 command-ref
```

## Monitoring & Logging

### Adding Logging to app.py

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/commands')
def api_commands():
    logger.info(f"Search query: {request.args.get('filter')}")
    # ... rest of function
```

### Performance Monitoring

```python
from time import time

@app.before_request
def before_request():
    request.start_time = time()

@app.after_request
def after_request(response):
    elapsed = time() - request.start_time
    logger.info(f"Request took {elapsed:.2f}s")
    return response
```

## Environment Variables

Create `.env` file:

```
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=app.py
SEARCH_MAX_RESULTS=50
```

Load in Python:

```python
import os
from dotenv import load_dotenv

load_dotenv()
DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
```

## API Rate Limiting

To prevent abuse, add rate limiting:

```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/search')
@limiter.limit("100 per hour")
def api_search():
    # ... implementation
```

## Backup & Version Control

### Git Setup

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Backup Important Files

- HTML files (system-admin.html, devops-tools.html, monitoring-security.html)
- Configuration files
- Custom CSS/JS modifications

## Testing

### Manual Testing

1. Test on different browsers (Chrome, Firefox, Safari, Edge)
2. Test on mobile devices
3. Test all keyboard shortcuts
4. Test search functionality
5. Test dark mode
6. Test export/download features

### Automated Testing (Optional)

```bash
pip install pytest
```

Create tests in `test_app.py`:

```python
def test_homepage(client):
    response = client.get('/')
    assert response.status_code == 200

def test_api_commands(client):
    response = client.get('/api/commands')
    assert response.status_code == 200
```

Run tests:

```bash
pytest test_app.py -v
```

## Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Module Not Found

```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### CSS/JS Not Loading

- Check file paths in HTML
- Check browser console for 404 errors
- Ensure files are in same directory
- Clear browser cache (Ctrl+Shift+Delete)

## Support & Documentation

- See README.md for usage guide
- Check app.py comments for API details
- Review styles.css for customization options
- Inspect scripts.js for feature implementation

---

For questions or issues, refer to the README.md file or check browser console (F12).
