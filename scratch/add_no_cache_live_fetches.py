import re

# 1. Update src/app/projects/page.tsx
proj_path = 'src/app/projects/page.tsx'
with open(proj_path, 'r', encoding='utf-8') as f:
    p_content = f.read()

p_fetch_snippet = """export default function AllProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [projectsList, setProjectsList] = useState<Project[]>(ALL_PROJECTS);

  // Live fetch from database (No-cache)
  useEffect(() => {
    fetch("/api/projects?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map((p: any, idx: number) => ({
            id: p.id || `proj-\${idx}`,
            slug: p.slug || p.id || `proj-\${idx}`,
            client: p.client || p.name || "Client Project",
            code: p.code || "AP",
            num: String(idx + 1).padStart(2, "0"),
            title: p.title || p.name || "Architectural Project",
            year: p.year || "2025",
            category: p.category || "Commercial",
            location: p.location || "Bengaluru",
            image: p.imageUrl || p.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
            description: p.description || "Architectural space by Aaren Studio.",
            tags: p.tags || ["Architecture", "Design"],
          }));
          setProjectsList(mapped);
        }
      })
      .catch(() => {});
  }, []);"""

p_content = p_content.replace(
    'export default function AllProjectsPage() {\n  const [activeFilter, setActiveFilter] = useState("All");\n  const [searchQuery, setSearchQuery] = useState("");\n  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");\n  const [hoveredProject, setHoveredProject] = useState<string | null>(null);\n  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });',
    p_fetch_snippet
)

p_content = p_content.replace(
    'const filteredProjects = ALL_PROJECTS.filter((project) => {',
    'const filteredProjects = projectsList.filter((project) => {'
)

# Ensure useEffect is imported in projects/page.tsx
if "useEffect," not in p_content and "useEffect }" not in p_content:
    p_content = p_content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')

with open(proj_path, 'w', encoding='utf-8') as f:
    f.write(p_content)

print("Updated src/app/projects/page.tsx with live no-cache database fetching!")

# 2. Update src/app/careers/page.tsx
careers_path = 'src/app/careers/page.tsx'
with open(careers_path, 'r', encoding='utf-8') as f:
    c_content = f.read()

c_fetch_snippet = """export default function Careers() {
  const [positionsList, setPositionsList] = useState(positions);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "1",
    portfolio: "",
    resume: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/careers?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPositionsList(data.data);
        }
      })
      .catch(() => {});
  }, []);"""

c_content = c_content.replace(
    'export default function Careers() {\n  const [formData, setFormData] = useState({\n    name: "",\n    email: "",\n    position: "1",\n    portfolio: "",\n    resume: "",\n  });\n  const [success, setSuccess] = useState(false);',
    c_fetch_snippet
)

c_content = c_content.replace('positions.map((pos)', 'positionsList.map((pos)')

if "useEffect" not in c_content:
    c_content = c_content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')

with open(careers_path, 'w', encoding='utf-8') as f:
    f.write(c_content)

print("Updated src/app/careers/page.tsx with live no-cache database fetching!")

# 3. Update src/app/faq/page.tsx
faq_path = 'src/app/faq/page.tsx'
with open(faq_path, 'r', encoding='utf-8') as f:
    faq_content = f.read()

faq_fetch_snippet = """export default function FaqPage() {
  const [faqList, setFaqList] = useState<FaqItem[]>(FAQ_DATA);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "faq-1": true });

  useEffect(() => {
    fetch("/api/faq?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFaqList(data.data);
        }
      })
      .catch(() => {});
  }, []);"""

if "export default function FaqPage()" in faq_content:
    faq_content = re.sub(
        r'export default function FaqPage\(\) \{[\s\S]*?const \[openItems, setOpenItems\] = useState<Record<string, boolean>>\(\{ "faq-1": true \}\);',
        faq_fetch_snippet,
        faq_content
    )

faq_content = faq_content.replace('const filteredFaqs = FAQ_DATA.filter((item) => {', 'const filteredFaqs = faqList.filter((item) => {')

if "useEffect" not in faq_content:
    faq_content = faq_content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')

with open(faq_path, 'w', encoding='utf-8') as f:
    f.write(faq_content)

print("Updated src/app/faq/page.tsx with live no-cache database fetching!")
