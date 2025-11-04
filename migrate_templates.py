"""
Template Migration Script
Renames new templates to replace old ones after backup
"""

import os
import shutil
from datetime import datetime

def migrate_templates():
    """Migrate to new professional templates"""
    
    templates_dir = 'templates'
    backup_dir = f'templates_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
    
    # Create backup directory
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"✓ Created backup directory: {backup_dir}")
    
    # Files to backup and replace
    migrations = [
        ('base.html', 'base_new.html'),
        ('index.html', 'index_new.html'),
        ('samplespace.html', 'samplespace_new.html'),
        ('execution.html', 'execution_new.html'),
    ]
    
    for old_file, new_file in migrations:
        old_path = os.path.join(templates_dir, old_file)
        new_path = os.path.join(templates_dir, new_file)
        backup_path = os.path.join(backup_dir, old_file)
        
        # Backup old file if it exists
        if os.path.exists(old_path):
            shutil.copy2(old_path, backup_path)
            print(f"✓ Backed up {old_file} to {backup_dir}")
        
        # Replace with new file if it exists
        if os.path.exists(new_path):
            shutil.copy2(new_path, old_path)
            print(f"✓ Replaced {old_file} with {new_file}")
        else:
            print(f"✗ Warning: {new_file} not found")
    
    print("\n" + "="*50)
    print("Migration complete!")
    print("="*50)
    print(f"\nOld templates backed up to: {backup_dir}")
    print("\nNext steps:")
    print("1. Test the application: python app.py")
    print("2. Create a user account at /register")
    print("3. If issues occur, restore from backup")
    print("\nTo restore from backup:")
    print(f"  Copy files from {backup_dir} back to templates/")

if __name__ == '__main__':
    print("Smart Agent Survey - Template Migration")
    print("="*50)
    print("\nThis script will:")
    print("1. Backup existing templates")
    print("2. Replace them with new professional templates")
    print("\nPress Enter to continue or Ctrl+C to cancel...")
    input()
    
    try:
        migrate_templates()
    except Exception as e:
        print(f"\n✗ Error during migration: {e}")
        print("Please restore from backup if needed")
