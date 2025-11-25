from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import re
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)

# Keywords for classification
CATEGORIES = {
    'work': ['meeting', 'report', 'presentation', 'email', 'deadline', 'project', 'client', 'boss', 'office', 'work', 'conference', 'call'],
    'personal': ['family', 'friend', 'birthday', 'shopping', 'home', 'personal', 'doctor', 'appointment', 'gym', 'exercise', 'hobby'],
    'urgent': ['urgent', 'asap', 'emergency', 'critical', 'important', 'immediate', 'now', 'today']
}

PRIORITIES = {
    'high': ['urgent', 'asap', 'critical', 'important', 'deadline', 'emergency', 'immediate'],
    'low': ['maybe', 'someday', 'eventually', 'when possible', 'low priority']
}

def classify_category(text):
    """Classify task category based on keywords"""
    text_lower = text.lower()
    
    scores = {category: 0 for category in CATEGORIES}
    
    for category, keywords in CATEGORIES.items():
        for keyword in keywords:
            if keyword in text_lower:
                scores[category] += 1
    
    max_score = max(scores.values())
    if max_score == 0:
        return 'other'
    
    return max(scores, key=scores.get)

def classify_priority(text):
    """Classify task priority based on keywords"""
    text_lower = text.lower()
    
    for keyword in PRIORITIES['high']:
        if keyword in text_lower:
            return 'high'
    
    for keyword in PRIORITIES['low']:
        if keyword in text_lower:
            return 'low'
    
    return 'medium'

def extract_suggestions(text):
    """Generate suggestions based on task content"""
    suggestions = []
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['meeting', 'call', 'presentation']):
        suggestions.append('Prepare agenda and materials')
        suggestions.append('Send calendar invite')
    
    if 'report' in text_lower or 'document' in text_lower:
        suggestions.append('Gather required data')
        suggestions.append('Create outline')
    
    if 'email' in text_lower:
        suggestions.append('Draft key points')
        suggestions.append('Review before sending')
    
    return suggestions[:3]  # Return max 3 suggestions

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'NLP Service is running'})

@app.route('/api/nlp/classify', methods=['POST'])
def classify_task():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'error': 'Text is required'
            }), 400
        
        category = classify_category(text)
        priority = classify_priority(text)
        suggestions = extract_suggestions(text)
        
        return jsonify({
            'category': category,
            'priority': priority,
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/nlp/breakdown', methods=['POST'])
def breakdown_task():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'error': 'Text is required'
            }), 400
        
        # Simple rule-based task breakdown
        subtasks = []
        suggestions = []
        
        text_lower = text.lower()
        
        # Common task patterns
        if 'launch' in text_lower or 'create' in text_lower or 'build' in text_lower:
            subtasks = [
                'Research and planning',
                'Design and development',
                'Testing and review',
                'Launch and deployment'
            ]
        elif 'organize' in text_lower or 'plan' in text_lower:
            subtasks = [
                'Define objectives',
                'Create timeline',
                'Assign responsibilities',
                'Execute and monitor'
            ]
        elif 'write' in text_lower or 'document' in text_lower:
            subtasks = [
                'Outline key points',
                'Draft content',
                'Review and edit',
                'Finalize and publish'
            ]
        else:
            subtasks = [
                'Break down into smaller steps',
                'Prioritize tasks',
                'Execute step by step'
            ]
        
        suggestions = [
            'Set specific deadlines for each subtask',
            'Review progress regularly',
            'Adjust plan as needed'
        ]
        
        return jsonify({
            'subtasks': subtasks,
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)