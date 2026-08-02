import re

page_path = 'src/app/products/[slug]/page.tsx'

with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Dimensional Blueprint section completely
content = re.sub(
    r'\{\/\* ── SECTION 4 — DIMENSIONAL BLUEPRINT ── \*\/\}\s*<div className="section-container blueprint-section">[\s\S]*?<\/div>\s*<\/div>',
    '',
    content
)

# If not matched by regex, let's do direct string replacement
blueprint_snippet = """      {/* ── SECTION 4 — DIMENSIONAL BLUEPRINT ── */}
      <div className="section-container blueprint-section">
        <h2 className="section-title">Dimensional Blueprint</h2>
        <div className="blueprint-box">
          {/* Left 60%: Technical Drawing Area */}
          <div className="drawing-area">
            <svg width="100%" height="240" viewBox="0 0 400 240" fill="none">
              <rect x="50" y="40" width="300" height="140" rx="4" stroke="#8c764b" strokeWidth="1.5" strokeDasharray="4 4" fill="rgba(140,118,75,0.05)" />
              {/* Width Arrow */}
              <line x1="50" y1="200" x2="350" y2="200" stroke="#0f172a" strokeWidth="1" />
              <text x="200" y="220" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">WIDTH: {product.width || "140mm"}</text>
              {/* Height Arrow */}
              <line x1="20" y1="40" x2="20" y2="180" stroke="#0f172a" strokeWidth="1" />
              <text x="15" y="115" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600" transform="rotate(-90 15 115)">HEIGHT: {product.height || "22.5mm"}</text>
            </svg>
          </div>

          {/* Right 40%: Dimension Stats */}
          <div className="stats-area">
            <div className="stat-item">
              <span className="s-label">Width</span>
              <span className="s-val">{product.width || "140 mm"}</span>
            </div>
            <div className="stat-item">
              <span className="s-label">Height</span>
              <span className="s-val">{product.height || "22.5 mm"}</span>
            </div>
            <div className="stat-item">
              <span className="s-label">Depth / Thickness</span>
              <span className="s-val">{product.thickness || product.depth || "25 mm"}</span>
            </div>
            <div className="stat-item">
              <span className="s-label">Weight</span>
              <span className="s-val">3.2 kg / meter</span>
            </div>
          </div>
        </div>
      </div>"""

if blueprint_snippet in content:
    content = content.replace(blueprint_snippet, "")

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Blueprint section removed from src/app/products/[slug]/page.tsx!")
