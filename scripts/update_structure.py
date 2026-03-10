
import os

def replace_in_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# Directories to process
directories = [
    r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex",
    r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex\chapters",
    r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex\styles"
]

# Replacements
replacements = {
    "{settings/preamble.tex}": "{styles/preamble.tex}",
    "{tex_python/": "{chapters/python/",
    "assets/code/": "code/",
    "{assets/code/": "{code/",
    "graphicspath{{assets/}}": "graphicspath{{images/}}",
    "{assets/}": "{images/}",
    "addbibresource{references.bib}": "addbibresource{styles/references.bib}"
}

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tex") or file.endswith(".bat"):
                replace_in_file(os.path.join(root, file), replacements)
