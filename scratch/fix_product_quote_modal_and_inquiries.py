import re

page_path = 'src/app/products/[slug]/page.tsx'

with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update handleQuoteSubmit to POST live inquiries to /api/inquiries
old_submit_fn = """  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setQuoteModalOpen(false);
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    }, 2000);
  };"""

new_submit_fn = """  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: `inq-\${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        productName: product ? `\${product.brand} - \${product.name}` : "Product Quote",
        productId: product?.id || slug,
        type: "Product Quote Request",
        status: "NEW",
        createdAt: new Date().toISOString(),
      };
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to post live inquiry:", err);
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setQuoteModalOpen(false);
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    }, 2000);
  };"""

if old_submit_fn in content:
    content = content.replace(old_submit_fn, new_submit_fn)
else:
    # Pattern fallback replacement
    content = re.sub(
        r'const handleQuoteSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\};',
        new_submit_fn,
        content
    )

# Ensure modal close button color is visible
content = content.replace(
    '.lightbox-close, .modal-close {\n          position: absolute;\n          top: 20px;\n          right: 20px;\n          background: transparent;\n          border: none;\n          color: #ffffff;\n          cursor: pointer;\n        }',
    '.lightbox-close {\n          position: absolute;\n          top: 20px;\n          right: 20px;\n          background: transparent;\n          border: none;\n          color: #ffffff;\n          cursor: pointer;\n        }\n        .modal-close {\n          position: absolute;\n          top: 20px;\n          right: 20px;\n          background: rgba(0,0,0,0.06);\n          border: none;\n          border-radius: 50%;\n          width: 32px;\n          height: 32px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #1e1e1e;\n          cursor: pointer;\n          transition: background 0.2s ease;\n        }\n        .modal-close:hover { background: #e5484d; color: #fff; }'
)

# Fix PDF catalog fallback URL
content = content.replace(
    '/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf',
    '/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf'
)

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated handleQuoteSubmit with live POST to /api/inquiries and enhanced modal visibility!")
