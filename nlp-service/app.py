from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import re
from datetime import datetime, timedelta
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string

load_dotenv()

app = Flask(__name__)
CORS(app)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

# Initialize NLTK tools
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Enhanced keywords for classification
CATEGORIES = {
    'work': [
        'meeting', 'report', 'presentation', 'email', 'deadline', 'project', 
        'client', 'boss', 'office', 'work', 'conference', 'call', 'task',
        'document', 'proposal', 'budget', 'team', 'collaboration', 'review',
        'analysis', 'planning', 'strategy', 'business', 'professional'
    ],
    'personal': [
        'family', 'friend', 'birthday', 'shopping', 'home', 'personal', 
        'doctor', 'appointment', 'gym', 'exercise', 'hobby', 'vacation',
        'travel', 'health', 'fitness', 'relationship', 'self-care', 'relaxation',
        'entertainment', 'movie', 'book', 'music', 'pet'
    ],
    'urgent': [
        'urgent', 'asap', 'emergency', 'critical', 'important', 'immediate', 
        'now', 'today', 'hurry', 'rush', 'priority', 'crucial', 'vital',
        'pressing', 'time-sensitive'
    ]
}

PRIORITIES = {
    'high': [
        'urgent', 'asap', 'critical', 'important', 'deadline', 'emergency', 
        'immediate', 'must', 'need', 'crucial', 'vital', 'pressing', 'priority',
        'today', 'tomorrow', 'this week'
    ],
    'low': [
        'maybe', 'someday', 'eventually', 'when possible', 'low priority',
        'optional', 'if time', 'consider', 'think about', 'next month'
    ]
}

# Time-related patterns
TIME_PATTERNS = {
    'today': timedelta(days=0),
    'tomorrow': timedelta(days=1),
    'next week': timedelta(days=7),
    'next month': timedelta(days=30),
    'this week': timedelta(days=7),
    'this month': timedelta(days=30)
}

def preprocess_text(text):
    """Clean and preprocess text"""
    # Convert to lowercase
    text = text.lower()
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove punctuation and stopwords
    tokens = [token for token in tokens if token not in string.punctuation]
    tokens = [token for token in tokens if token not in stop_words]
    
    # Lemmatize
    tokens = [lemmatizer.lemmatize(token) for token in tokens]
    
    return tokens

def extract_keywords(text, top_n=5):
    """Extract important keywords from text"""
    tokens = preprocess_text(text)
    
    # Count frequency
    word_freq = {}
    for token in tokens:
        word_freq[token] = word_freq.get(token, 0) + 1
    
    # Sort by frequency
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    
    # Return top N keywords
    return [word for word, freq in sorted_words[:top_n]]

def classify_category(text):
    """Enhanced category classification"""
    text_lower = text.lower()
    tokens = preprocess_text(text)
    
    scores = {category: 0 for category in CATEGORIES}
    
    # Score based on exact matches
    for category, keywords in CATEGORIES.items():
        for keyword in keywords:
            if keyword in text_lower:
                scores[category] += 2
            # Also check lemmatized tokens
            for token in tokens:
                if token == lemmatizer.lemmatize(keyword):
                    scores[category] += 1
    
    max_score = max(scores.values())
    if max_score == 0:
        return 'other'
    
    # If urgent has high score, prioritize it
    if scores['urgent'] >= 2:
        return 'urgent'
    
    return max(scores, key=scores.get)

def classify_priority(text):
    """Enhanced priority classification"""
    text_lower = text.lower()
    
    # Check for high priority indicators
    high_score = sum(1 for keyword in PRIORITIES['high'] if keyword in text_lower)
    low_score = sum(1 for keyword in PRIORITIES['low'] if keyword in text_lower)
    
    if high_score >= 2:
        return 'high'
    elif low_score >= 1:
        return 'low'
    elif high_score >= 1:
        return 'high'
    
    return 'medium'

def extract_due_date(text):
    """Extract due date from natural language"""
    text_lower = text.lower()
    
    for pattern, delta in TIME_PATTERNS.items():
        if pattern in text_lower:
            due_date = datetime.now() + delta
            return due_date.isoformat()
    
    # Check for specific date patterns (e.g., "on monday", "in 3 days")
    # Basic implementation - can be enhanced
    days_pattern = re.search(r'in (\d+) days?', text_lower)
    if days_pattern:
        days = int(days_pattern.group(1))
        due_date = datetime.now() + timedelta(days=days)
        return due_date.isoformat()
    
    return None

def generate_smart_suggestions(text, category, priority):
    """Generate context-aware suggestions"""
    suggestions = []
    text_lower = text.lower()
    keywords = extract_keywords(text)
    
    # Category-specific suggestions
    if category == 'work':
        if any(word in text_lower for word in ['meeting', 'call', 'presentation']):
            suggestions.extend([
                'Prepare agenda and key discussion points',
                'Send calendar invite to participants',
                'Gather necessary materials and documents'
            ])
        elif any(word in text_lower for word in ['report', 'document', 'analysis']):
            suggestions.extend([
                'Collect and organize relevant data',
                'Create document outline',
                'Schedule time for review and editing'
            ])
        elif any(word in text_lower for word in ['email', 'message', 'communication']):
            suggestions.extend([
                'Draft key points to communicate',
                'Review tone and clarity',
                'Include clear call-to-action'
            ])
        else:
            suggestions.extend([
                'Break down into smaller actionable steps',
                'Set clear milestones',
                'Identify required resources'
            ])
    
    elif category == 'personal':
        if any(word in text_lower for word in ['shopping', 'buy', 'purchase']):
            suggestions.extend([
                'Create shopping list',
                'Compare prices and options',
                'Check budget availability'
            ])
        elif any(word in text_lower for word in ['appointment', 'doctor', 'health']):
            suggestions.extend([
                'Check appointment availability',
                'Prepare questions or concerns',
                'Set reminder for appointment'
            ])
        elif any(word in text_lower for word in ['exercise', 'gym', 'workout']):
            suggestions.extend([
                'Schedule workout time',
                'Prepare workout gear',
                'Track progress and goals'
            ])
        else:
            suggestions.extend([
                'Set aside dedicated time',
                'Gather necessary items',
                'Create a simple plan'
            ])
    
    elif category == 'urgent':
        suggestions.extend([
            'Prioritize this task immediately',
            'Clear your schedule if needed',
            'Communicate urgency to relevant parties',
            'Focus on quick wins first'
        ])
    
    # Priority-specific suggestions
    if priority == 'high' and category != 'urgent':
        suggestions.append('Schedule this within the next 24-48 hours')
    
    # Add suggestions based on keywords
    if 'deadline' in keywords or 'deadline' in text_lower:
        suggestions.append('Set interim checkpoints before final deadline')
    
    if 'team' in keywords or 'collaboration' in text_lower:
        suggestions.append('Coordinate with team members early')
    
    # Return unique suggestions (max 5)
    unique_suggestions = []
    for s in suggestions:
        if s not in unique_suggestions:
            unique_suggestions.append(s)
    
    return unique_suggestions[:5]

def intelligent_task_breakdown(text):
    """Break down task into subtasks intelligently"""
    text_lower = text.lower()
    keywords = extract_keywords(text)
    
    subtasks = []
    
    # Pattern-based breakdown
    if any(word in text_lower for word in ['launch', 'create', 'build', 'develop']):
        subtasks = [
            '📋 Research and planning phase',
            '🎨 Design and prototyping',
            '⚙️ Development and implementation',
            '🧪 Testing and quality assurance',
            '🚀 Launch and deployment',
            '📊 Monitor and gather feedback'
        ]
    
    elif any(word in text_lower for word in ['organize', 'plan', 'arrange']):
        subtasks = [
            '🎯 Define clear objectives and goals',
            '📅 Create detailed timeline',
            '👥 Assign roles and responsibilities',
            '✅ Execute according to plan',
            '🔍 Review and adjust as needed'
        ]
    
    elif any(word in text_lower for word in ['write', 'document', 'report', 'article']):
        subtasks = [
            '🔍 Research topic thoroughly',
            '📝 Create outline and structure',
            '✍️ Write first draft',
            '✏️ Review and edit content',
            '✨ Finalize and polish',
            '📤 Publish or submit'
        ]
    
    elif any(word in text_lower for word in ['meeting', 'presentation']):
        subtasks = [
            '📋 Define meeting objectives',
            '📄 Prepare materials and slides',
            '👥 Send invites and agenda',
            '🎤 Conduct the meeting',
            '📝 Document action items',
            '📧 Send follow-up communication'
        ]
    
    elif any(word in text_lower for word in ['learn', 'study', 'course']):
        subtasks = [
            '🎯 Set learning goals',
            '📚 Gather learning resources',
            '📖 Study and take notes',
            '💡 Practice and apply knowledge',
            '✅ Test understanding',
            '🔄 Review and reinforce'
        ]
    
    else:
        # Generic breakdown
        subtasks = [
            '🎯 Define the goal clearly',
            '📋 List required resources',
            '⚡ Break into smaller steps',
            '✅ Execute step by step',
            '🔍 Review and complete'
        ]
    
    return subtasks

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Enhanced NLP Service is running'})

@app.route('/api/nlp/classify', methods=['POST'])
def classify_task():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'error': 'Text is required'
            }), 400
        
        # Extract features
        category = classify_category(text)
        priority = classify_priority(text)
        keywords = extract_keywords(text)
        due_date = extract_due_date(text)
        suggestions = generate_smart_suggestions(text, category, priority)
        
        return jsonify({
            'category': category,
            'priority': priority,
            'keywords': keywords,
            'dueDate': due_date,
            'suggestions': suggestions
        })
    except Exception as e:
        print(f"Error in classify_task: {str(e)}")
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
        
        # Generate intelligent breakdown
        subtasks = intelligent_task_breakdown(text)
        keywords = extract_keywords(text)
        category = classify_category(text)
        
        suggestions = [
            'Start with the first subtask and work sequentially',
            'Set realistic deadlines for each subtask',
            'Track progress and adjust as needed'
        ]
        
        return jsonify({
            'subtasks': subtasks,
            'keywords': keywords,
            'category': category,
            'suggestions': suggestions
        })
    except Exception as e:
        print(f"Error in breakdown_task: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/nlp/extract-keywords', methods=['POST'])
def extract_keywords_endpoint():
    try:
        data = request.json
        text = data.get('text', '')
        top_n = data.get('top_n', 5)
        
        if not text:
            return jsonify({
                'error': 'Text is required'
            }), 400
        
        keywords = extract_keywords(text, top_n)
        
        return jsonify({
            'keywords': keywords
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)