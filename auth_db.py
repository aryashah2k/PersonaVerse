import json
import os
import bcrypt
from datetime import datetime
from pathlib import Path

class UserDatabase:
    """Simple JSON-based user database for authentication and credits management"""
    
    def __init__(self, db_path='Data/users.json'):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
    
    def _init_db(self):
        """Initialize database file if it doesn't exist"""
        if not self.db_path.exists():
            self._save_db({'users': {}})
    
    def _load_db(self):
        """Load database from file"""
        try:
            with open(self.db_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {'users': {}}
    
    def _save_db(self, data):
        """Save database to file"""
        with open(self.db_path, 'w') as f:
            json.dump(data, f, indent=4)
    
    def create_user(self, username, password):
        """Create a new user with hashed password and initial credits"""
        db = self._load_db()
        
        if username in db['users']:
            return False, "Username already exists"
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user with 5 initial credits
        db['users'][username] = {
            'password_hash': password_hash,
            'credits': 5,
            'created_at': datetime.now().isoformat(),
            'last_login': None,
            'api_calls': 0
        }
        
        self._save_db(db)
        return True, "User created successfully"
    
    def verify_user(self, username, password):
        """Verify user credentials"""
        db = self._load_db()
        
        if username not in db['users']:
            return False
        
        user = db['users'][username]
        password_hash = user['password_hash'].encode('utf-8')
        
        if bcrypt.checkpw(password.encode('utf-8'), password_hash):
            # Update last login
            user['last_login'] = datetime.now().isoformat()
            self._save_db(db)
            return True
        
        return False
    
    def get_user(self, username):
        """Get user data"""
        db = self._load_db()
        return db['users'].get(username)
    
    def get_credits(self, username):
        """Get user's current credits"""
        user = self.get_user(username)
        return user['credits'] if user else 0
    
    def deduct_credit(self, username):
        """Deduct one credit from user's account"""
        db = self._load_db()
        
        if username not in db['users']:
            return False, "User not found"
        
        if db['users'][username]['credits'] <= 0:
            return False, "Insufficient credits"
        
        db['users'][username]['credits'] -= 1
        db['users'][username]['api_calls'] += 1
        self._save_db(db)
        
        return True, db['users'][username]['credits']
    
    def add_credits(self, username, amount):
        """Add credits to user's account"""
        db = self._load_db()
        
        if username not in db['users']:
            return False, "User not found"
        
        db['users'][username]['credits'] += amount
        self._save_db(db)
        
        return True, db['users'][username]['credits']
    
    def update_password(self, username, old_password, new_password):
        """Update user password"""
        if not self.verify_user(username, old_password):
            return False, "Invalid current password"
        
        db = self._load_db()
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db['users'][username]['password_hash'] = password_hash
        self._save_db(db)
        
        return True, "Password updated successfully"
