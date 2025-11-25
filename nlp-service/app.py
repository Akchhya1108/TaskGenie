from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'NLP Service is running'})

@app.route('/api/nlp/classify', methods=['POST'])
def classify_task():
    data = request.json
    text = data.get('text', '')
    
    # Placeholder - we'll add real NLP later
    return jsonify({
        'category': 'work',
        'priority': 'medium',
        'suggestions': []
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)