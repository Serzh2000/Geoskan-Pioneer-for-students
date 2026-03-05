
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

# Update Lua paths in tex/chapters
chapters_dir = r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex\chapters"
lua_replacements = {
    "examples/chapter_": "lua/examples/chapter_",
    "tasks/chapter_": "lua/tasks/chapter_"
}

for root, dirs, files in os.walk(chapters_dir):
    for file in files:
        if file.endswith(".tex"):
            replace_in_file(os.path.join(root, file), lua_replacements)

# Update Python paths in tex/tex_python
python_tex_dir = r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex\tex_python"
python_replacements = {
    "../pioneer-python-example/": "../assets/code/python/examples/"
}

for root, dirs, files in os.walk(python_tex_dir):
    for file in files:
        if file.endswith(".tex"):
            replace_in_file(os.path.join(root, file), python_replacements)
