import { getServicesStore } from "@/lib/store";
import { Sparkles, Layers, Box, Globe, Shield, Megaphone, FileText, Camera, Video, Palette, BrainCircuit } from "lucide-react";

export const dynamic = "force-dynamic";

const ICONS = [Sparkles, Layers, Box, Globe, Shield, Palette, Megaphone, FileText, Video, Camera, BrainCircuit];

const DEFAULT_SERVICES = [
  { title: "Brand Strategy", desc: "Positioning premium brands to lead their digital fields." },
  { title: "Creative Direction", desc: "Establishing high-end art assets and unique aesthetic visual layouts." },
  { title: "Motion Graphics", desc: "Curating high-fidelity fluid motion design sequences." },
  { title: "3D Animation", desc: "Premium WebGL modeling and rendering simulations." },
  { title: "UI UX Design", desc: "Clean modern design languages focusing on interactions." },
  { title: "Web Design", desc: "Vibrant visual interfaces built to load instantly." },
  { title: "Website Development", desc: "High-performance codebases utilising React and modern frameworks." },
  { title: "Digital Marketing", desc: "Strategic deployment and SEO search prioritization." },
  { title: "Content Production", desc: "Premium copywriting, audio elements and assets." },
  { title: "Video Production", desc: "High definition recording, assembly and sound designs." },
  { title: "Photography", desc: "Stunning physical asset capture and studio imagery." },
  { title: "AI Solutions", desc: "Intelligent content generation APIs and integrations." },
];

export default async function Services() {
  const rawServices = await getServicesStore();
  const servicesList = (rawServices && rawServices.length > 0)
    ? rawServices.map((s: any, idx: number) => ({
        title: s.title,
        desc: s.description,
        icon: ICONS[idx % ICONS.length],
      }))
    : DEFAULT_SERVICES.map((s, idx) => ({
        ...s,
        icon: ICONS[idx % ICONS.length],
      }));

  return (
    <div style={{ background: "#E6E2D8", color: "#1e1e1e", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "6rem" }}>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header__inner">
          <div className="page-meta">
            CAPABILITIES &amp; EXPERTISE
          </div>
          <h1 className="page-title">
            OUR SERVICES
          </h1>
          <p className="page-desc">
            Architectural material curation, spatial consulting, bespoke joinery, and turnkey specification services for luxury spaces.
          </p>
        </div>
      </div>

      <div className="page-content-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.4rem" }}>
          {servicesList.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "#FAF9F6",
                  border: "1px solid rgba(129, 102, 63, 0.18)",
                  borderRadius: "8px",
                  padding: "3.2rem 2.8rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "border-color 0.25s ease, transform 0.25s ease",
                }}
              >
                <div>
                  <IconComp style={{ color: "#81663F", marginBottom: "2rem" }} size={32} />
                  <h3 className="section-title" style={{ fontSize: "2rem", marginBottom: "1.2rem" }}>{service.title}</h3>
                  <p className="page-desc" style={{ fontSize: "1.4rem", lineHeight: 1.6, color: "rgba(0,0,0,0.68)" }}>{service.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
