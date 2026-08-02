import json

with open('scratch/brands_data_generated.json', 'r') as f:
    brands_data = json.load(f)

brands_json_str = json.dumps(brands_data, indent=2)

page_path = 'src/app/brands/page.tsx'
with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "const DEFAULT_BRANDS: BrandItemData[] = ["
end_marker = "];\n\nexport default function BrandsPage()"

if start_marker in content and end_marker in content:
    part1 = content.split(start_marker)[0]
    part2 = content.split(end_marker)[1]
    content = part1 + f"const DEFAULT_BRANDS: BrandItemData[] = {brands_json_str};\n\nexport default function BrandsPage()" + part2

# Now update catalogs-row rendering block
old_catalogs_row = """                {/* Catalogs Row */}
                <div className="catalogs-row">
                  {brand.catalogs.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className={`catalog-thumb ${cat.themeClass || "ct-cream"}`}
                      style={cat.themeStyle}
                    >
                      <span className="cat-title">{cat.title}</span>
                    </div>
                  ))}
                </div>"""

new_catalogs_row = """                {/* Catalogs Row — First Page PDF Previews from Excel */}
                <div
                  className="catalogs-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  {brand.catalogs.map((cat, cIdx) => {
                    const hasCover = Boolean(cat.coverImage);
                    const pdfHref = cat.pdfUrl || cat.pdfDownloadUrl || "#";

                    return (
                      <a
                        key={cIdx}
                        href={pdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="catalog-pdf-card"
                        title={`Open ${cat.title}`}
                        style={{
                          position: "relative",
                          aspectRatio: "3/4",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "0.5px solid var(--border)",
                          background: "var(--surface-1)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "8px",
                          textDecoration: "none",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                      >
                        {hasCover ? (
                          <Image
                            src={cat.coverImage!}
                            alt={cat.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            style={{ objectFit: "cover", zIndex: 0 }}
                            unoptimized
                          />
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(135deg, #1f2937, #111827)",
                              zIndex: 0,
                            }}
                          />
                        )}

                        {/* Top PDF Badge */}
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            alignSelf: "flex-start",
                            background: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            fontSize: "8px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            padding: "3px 6px",
                            borderRadius: "3px",
                            backdropFilter: "blur(4px)",
                            textTransform: "uppercase",
                          }}
                        >
                          PDF · Pg 1
                        </div>

                        {/* Bottom Label Bar */}
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            background: "rgba(0,0,0,0.68)",
                            color: "#ffffff",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            backdropFilter: "blur(6px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {cat.title}
                          </span>
                          <span style={{ fontSize: "9px", opacity: 0.8 }}>↳</span>
                        </div>
                      </a>
                    );
                  })}
                </div>"""

content = content.replace(old_catalogs_row, new_catalogs_row)

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied updated DEFAULT_BRANDS & PDF catalog previews to src/app/brands/page.tsx!")
