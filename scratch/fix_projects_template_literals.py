page_path = 'src/app/projects/page.tsx'

with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\\${', '${')

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed template literals in src/app/projects/page.tsx!")
