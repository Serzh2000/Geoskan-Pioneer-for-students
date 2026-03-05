
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

# Fix paths in python chapters
python_chapters_dir = r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex\chapters\python"
replacements = {
    "{../code/python/examples/": "{code/python/examples/",
    "{../assets/code/python/examples/": "{code/python/examples/",
}

for root, dirs, files in os.walk(python_chapters_dir):
    for file in files:
        if file.endswith(".tex"):
            replace_in_file(os.path.join(root, file), replacements)
