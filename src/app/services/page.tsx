import { Sparkles, Layers, Box, Globe, Shield, Smartphone, Megaphone, FileText, Camera, Video, Palette, BrainCircuit } from "lucide-react";

const allServices = [
  { title: "Brand Strategy", desc: "Positioning premium brands to lead their digital fields.", icon: Sparkles },
  { title: "Creative Direction", desc: "Establishing high-end art assets and unique aesthetic visual layouts.", icon: Layers },
  { title: "Motion Graphics", desc: "Curating high-fidelity fluid motion design sequences.", icon: FilmIcon },
  { title: "3D Animation", desc: "Premium WebGL modeling and rendering simulations.", icon: Box },
  { title: "UI UX Design", desc: "Clean modern design languages focusing on interactions.", icon: Palette },
  { title: "Web Design", desc: "Vibrant visual interfaces built to load instantly.", icon: Globe },
  { title: "Website Development", desc: "High-performance codebases utilising React and modern frameworks.", icon: Shield },
  { title: "Digital Marketing", desc: "Strategic deployment and SEO search prioritization.", icon: Megaphone },
  { title: "Content Production", desc: "Premium copywriting, audio elements and assets.", icon: FileText },
  { title: "Video Production", desc: "High definition recording, assembly and sound designs.", icon: Video },
  { title: "Photography", desc: "Stunning physical asset capture and studio imagery.", icon: Camera },
  { title: "AI Solutions", desc: "Intelligent content generation APIs and integrations.", icon: BrainCircuit },
];

function FilmIcon(props: any) {
  return <Video {...props} />;
}

export default function Services() {
  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">CAPABILITIES</h4>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-16">
          OUR SERVICES<span className="text-accent">.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allServices.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <div key={idx} className="border border-neutral-900 bg-neutral-950 p-10 flex flex-col justify-between hover:border-accent/40 transition-colors group">
                <div>
                  <IconComp className="text-neutral-500 group-hover:text-accent transition-colors mb-8" size={36} />
                  <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{service.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
                <div className="mt-8 text-xs font-bold uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
