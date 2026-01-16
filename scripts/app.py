from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)

# Configure paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = BASE_DIR

app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Create command index
def extract_commands_from_html(filename):
    """Extract commands from HTML file"""
    filepath = os.path.join(TEMPLATE_DIR, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract command blocks
        commands = []
        pattern = r'<div class="command-block">.*?<h4>(.*?)</h4>.*?<code[^>]*>(.*?)</code>'
        matches = re.findall(pattern, content, re.DOTALL)
        
        for title, code in matches:
            # Clean up HTML tags
            title = re.sub(r'<[^>]+>', '', title).strip()
            code = re.sub(r'<[^>]+>', '', code).strip()
            commands.append({
                'title': title,
                'code': code,
                'file': filename
            })
        
        return commands
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

# Build command index
COMMAND_INDEX = []
for filename in ['part1.html', 'part2.html', 'part3.html']:
    COMMAND_INDEX.extend(extract_commands_from_html(filename))

# Routes
@app.route('/')
def index():
    """Main page - redirect to part1"""
    return index_redirect()

@app.route('/index.html')
def index_redirect():
    """Serve main page"""
    try:
        with open(os.path.join(TEMPLATE_DIR, 'part1.html'), 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except:
        return "Error loading page", 404

@app.route('/<path:filename>')
def serve_page(filename):
    """Serve HTML pages"""
    if filename.endswith('.html'):
        try:
            with open(os.path.join(TEMPLATE_DIR, filename), 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Add search functionality
            search_html = '''
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search commands... (Ctrl+Shift+F)">
                    <button id="searchBtn">Search</button>
                    <button id="resetBtn" style="background-color: #95a5a6;">Reset</button>
                </div>
            </div>
            '''
            
            # Add theme toggle and back to top button
            theme_html = '''
            <button class="theme-toggle" id="themeToggle">🌙 Dark Mode</button>
            <button class="back-to-top" id="backToTopBtn">↑</button>
            '''
            
            # Insert after body tag
            content = content.replace('<body>', '<body>' + search_html + theme_html, 1)
            
            return content
        except:
            return "Error loading page", 404
    elif filename.endswith('.css'):
        return send_file(os.path.join(TEMPLATE_DIR, filename), mimetype='text/css')
    elif filename.endswith('.js'):
        return send_file(os.path.join(TEMPLATE_DIR, filename), mimetype='text/javascript')
    return "Not found", 404

# API Routes
@app.route('/api/commands', methods=['GET'])
def api_commands():
    """API endpoint to get commands with optional filter"""
    filter_term = request.args.get('filter', '').lower()
    
    if filter_term:
        filtered = [cmd for cmd in COMMAND_INDEX 
                   if filter_term in cmd['title'].lower() or filter_term in cmd['code'].lower()]
        return jsonify({
            'total': len(filtered),
            'commands': filtered[:50]  # Limit to 50 results
        })
    
    return jsonify({
        'total': len(COMMAND_INDEX),
        'commands': COMMAND_INDEX[:50]
    })

@app.route('/api/statistics', methods=['GET'])
def api_statistics():
    """API endpoint for page statistics"""
    return jsonify({
        'total_commands': len(COMMAND_INDEX),
        'total_parts': 3,
        'last_updated': datetime.now().isoformat(),
        'files': ['part1.html', 'part2.html', 'part3.html']
    })

@app.route('/api/search', methods=['POST'])
def api_search():
    """Advanced search API"""
    data = request.json
    query = data.get('query', '').lower()
    file_filter = data.get('file', None)
    
    results = COMMAND_INDEX
    
    if file_filter:
        results = [cmd for cmd in results if cmd['file'] == file_filter]
    
    if query:
        results = [cmd for cmd in results 
                  if query in cmd['title'].lower() or query in cmd['code'].lower()]
    
    return jsonify({
        'query': query,
        'total_results': len(results),
        'results': results
    })

@app.route('/api/export', methods=['GET'])
def api_export():
    """Export commands as JSON"""
    export_format = request.args.get('format', 'json')
    
    if export_format == 'json':
        return jsonify(COMMAND_INDEX)
    elif export_format == 'csv':
        csv_content = "Title,Code,File\n"
        for cmd in COMMAND_INDEX:
            code = cmd['code'].replace('\n', ' ').replace('"', '""')
            csv_content += f'"{cmd["title"]}","{code}","{cmd["file"]}"\n'
        
        return csv_content, 200, {
            'Content-Disposition': 'attachment; filename=commands.csv',
            'Content-Type': 'text/csv'
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'commands_loaded': len(COMMAND_INDEX)
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Page not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'static'), filename)

if __name__ == '__main__':
    print(f"Loaded {len(COMMAND_INDEX)} commands from HTML files")
    print("Starting Flask server...")
    print("Navigate to http://localhost:5000 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000)
