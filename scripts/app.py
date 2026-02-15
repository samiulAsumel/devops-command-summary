#!/usr/bin/env python3
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime
import re
import logging
import sys

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure paths with validation
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    TEMPLATE_DIR = BASE_DIR
    
    # Validate directories exist
    if not os.path.exists(BASE_DIR):
        raise FileNotFoundError(f"Base directory not found: {BASE_DIR}")
    
    app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
except Exception as e:
    logger.error(f"Failed to configure paths: {e}")
    sys.exit(1)

# Create command index
def extract_commands_from_html(filename):
    """Extract commands from HTML file with proper validation"""
    # Input validation
    if not filename or not isinstance(filename, str):
        logger.error("Invalid filename provided")
        return []
    
    # Sanitize filename to prevent path traversal
    filename = os.path.basename(filename)
    if not filename.endswith('.html'):
        logger.warning(f"Skipping non-HTML file: {filename}")
        return []
    
    filepath = os.path.join(TEMPLATE_DIR, filename)
    
    try:
        # Validate file exists and is readable
        if not os.path.exists(filepath):
            logger.warning(f"File not found: {filepath}")
            return []
        
        if not os.path.isfile(filepath):
            logger.warning(f"Path is not a file: {filepath}")
            return []
        
        # Check file size to prevent processing extremely large files
        file_size = os.path.getsize(filepath)
        if file_size > 50 * 1024 * 1024:  # 50MB limit
            logger.warning(f"File too large, skipping: {filepath} ({file_size} bytes)")
            return []
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Validate content is not empty
        if not content.strip():
            logger.warning(f"Empty file: {filepath}")
            return []
        
        # Extract command blocks with improved regex
        commands = []
        pattern = r'<div class="command-block">.*?<h4>(.*?)</h4>.*?<code[^>]*>(.*?)</code>'
        matches = re.findall(pattern, content, re.DOTALL)
        
        for title, code in matches:
            # Clean up HTML tags and validate
            title = re.sub(r'<[^>]+>', '', title).strip()
            code = re.sub(r'<[^>]+>', '', code).strip()
            
            # Validate extracted data
            if title and code and len(title) < 200 and len(code) < 1000:
                commands.append({
                    'title': title,
                    'code': code,
                    'file': filename
                })
        
        logger.info(f"Extracted {len(commands)} commands from {filename}")
        return commands
        
    except PermissionError:
        logger.error(f"Permission denied reading file: {filepath}")
        return []
    except UnicodeDecodeError:
        logger.error(f"Encoding error reading file: {filepath}")
        return []
    except Exception as e:
        logger.error(f"Error reading {filename}: {e}")
        return []

# Build command index
COMMAND_INDEX = []
for filename in ['system-admin.html', 'devops-tools.html', 'monitoring-security.html']:
    COMMAND_INDEX.extend(extract_commands_from_html(filename))

# Routes
@app.route('/')
def index():
    """Main page - redirect to index"""
    return index_redirect()

@app.route('/index.html')
def index_redirect():
    """Serve main page"""
    try:
        with open(os.path.join(TEMPLATE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
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
    try:
        filter_term = request.args.get('filter', '').strip()
        
        # Input validation
        if len(filter_term) > 100:
            return jsonify({'error': 'Filter term too long'}), 400
        
        if filter_term:
            filtered = [cmd for cmd in COMMAND_INDEX 
                       if filter_term.lower() in cmd['title'].lower() or filter_term.lower() in cmd['code'].lower()]
            return jsonify({
                'total': len(filtered),
                'commands': filtered[:50]  # Limit to 50 results
            })
        
        return jsonify({
            'total': len(COMMAND_INDEX),
            'commands': COMMAND_INDEX[:50]
        })
    except Exception as e:
        logger.error(f"Error in /api/commands: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/statistics', methods=['GET'])
def api_statistics():
    """API endpoint for page statistics"""
    return jsonify({
        'total_commands': len(COMMAND_INDEX),
        'total_parts': 3,
        'last_updated': datetime.now().isoformat(),
        'files': ['system-admin.html', 'devops-tools.html', 'monitoring-security.html']
    })

@app.route('/api/search', methods=['POST'])
def api_search():
    """Advanced search API with validation"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
        
        query = data.get('query', '').strip()
        file_filter = data.get('file', None)
        
        # Input validation
        if len(query) > 200:
            return jsonify({'error': 'Query too long'}), 400
        
        if file_filter:
            file_filter = os.path.basename(file_filter)  # Prevent path traversal
            if not file_filter.endswith('.html'):
                return jsonify({'error': 'Invalid file filter'}), 400
        
        results = COMMAND_INDEX
        
        if file_filter:
            results = [cmd for cmd in results if cmd['file'] == file_filter]
        
        if query:
            results = [cmd for cmd in results 
                      if query.lower() in cmd['title'].lower() or query.lower() in cmd['code'].lower()]
        
        return jsonify({
            'query': query,
            'total_results': len(results),
            'results': results[:100]  # Limit results
        })
        
    except Exception as e:
        logger.error(f"Error in /api/search: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/export', methods=['GET'])
def api_export():
    """Export commands as JSON with validation"""
    try:
        export_format = request.args.get('format', 'json').strip().lower()
        
        # Validate export format
        if export_format not in ['json', 'csv']:
            return jsonify({'error': 'Invalid export format'}), 400
        
        if export_format == 'json':
            return jsonify(COMMAND_INDEX)
        elif export_format == 'csv':
            csv_content = "Title,Code,File\n"
            for cmd in COMMAND_INDEX:
                # Sanitize data for CSV
                title = cmd.get('title', '').replace('"', '""')
                code = cmd.get('code', '').replace('\n', ' ').replace('"', '""')
                file = cmd.get('file', '').replace('"', '""')
                
                # Validate data length
                if len(title) > 1000 or len(code) > 5000 or len(file) > 100:
                    continue  # Skip problematic entries
                
                csv_content += f'"{title}","{code}","{file}"\n'
            
            return csv_content, 200, {
                'Content-Disposition': 'attachment; filename=commands.csv',
                'Content-Type': 'text/csv'
            }
            
    except Exception as e:
        logger.error(f"Error in /api/export: {e}")
        return jsonify({'error': 'Internal server error'}), 500

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
