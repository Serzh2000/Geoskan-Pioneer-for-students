import os

directory = r"c:\Users\Master\Documents\GitHub\Geoskan-Pioneer-for-students\personal\lesson1\tex\chapters\python"

for filename in os.listdir(directory):
    if filename.endswith(".tex"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace("{examples/python/", "{python/examples/")
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
