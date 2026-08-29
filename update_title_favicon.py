import os
import re

dir_path = r"D:\Codes\cscpduama\cssa"

# Mapping page filenames to friendly title names
title_mappings = {
    'index.html': 'CSSA | PDUAM-AMJONGA',
    'about.html': 'About | CSSA | PDUAM-AMJONGA',
    'academics.html': 'Academics | CSSA | PDUAM-AMJONGA',
    'activities.html': 'Activities | CSSA | PDUAM-AMJONGA',
    'alumni.html': 'Alumni | CSSA | PDUAM-AMJONGA',
    'committee.html': 'Committee | CSSA | PDUAM-AMJONGA',
    'contact.html': 'Contact | CSSA | PDUAM-AMJONGA',
    'events.html': 'Events | CSSA | PDUAM-AMJONGA',
    'gallery.html': 'Gallery | CSSA | PDUAM-AMJONGA',
    'members.html': 'Members | CSSA | PDUAM-AMJONGA',
    'projects.html': 'Projects | CSSA | PDUAM-AMJONGA'
}

favicon_tag = '<link rel="icon" href="favicon.ico" type="image/x-icon">'

for file_name in os.listdir(dir_path):
    if file_name.endswith('.html'):
        file_path = os.path.join(dir_path, file_name)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Update the title tag
        target_title = title_mappings.get(file_name, 'CSSA | PDUAM-AMJONGA')
        title_pattern = re.compile(r'<title>.*?</title>', re.IGNORECASE)
        
        if title_pattern.search(content):
            content = title_pattern.sub(f'<title>{target_title}</title>', content)
        
        # 2. Inject favicon link tag in head if not already present
        if '<head>' in content and 'rel="icon"' not in content:
            content = content.replace('<head>', f'<head>\n  {favicon_tag}')
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated title and favicon in {file_name}")
