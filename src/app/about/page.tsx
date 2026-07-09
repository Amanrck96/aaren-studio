import { Compass, ShieldCheck, Heart, Users } from "lucide-react";

const team = [
  { name: "Aaren Patel", role: "Creative Director", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { name: "Zoe Chen", role: "Head of 3D Motion", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Marcus Sterling", role: "Lead Interactive Dev", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
];

const steps = [
  { year: "2022", event: "Establishment of Aaren in Bangalore, India." },
  { year: "2024", event: "Expansion of our global virtual motion studios." },
  { year: "2026", event: "Ranked as top immersive premium agency globally." },
];

export default function About() {
  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">THE STUDIO</h4>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-16">
          ABOUT AAREN<span className="text-accent">.</span>
        </h1>

        {/* Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="border border-neutral-900 bg-neutral-950 p-10">
            <Compass className="text-accent mb-6" size={32} />
            <h3 className="text-2xl font-bold uppercase mb-4">OUR MISSION</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We design and construct premium digital realities that elevate the standards of visual aesthetics across every medium.
            </p>
          </div>
          <div className="border border-neutral-900 bg-neutral-950 p-10">
            <ShieldCheck className="text-accent mb-6" size={32} />
            <h3 className="text-2xl font-bold uppercase mb-4">OUR VISION</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              To remain the primary destination for luxury brands seeking custom design architecture, 3D motion, and immersive coding.
            </p>
          </div>
          <div className="border border-neutral-900 bg-neutral-950 p-10">
            <Heart className="text-accent mb-6" size={32} />
            <h3 className="text-2xl font-bold uppercase mb-4">OUR VALUES</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Unyielding precision, premium design frameworks, fast interfaces, and standard production execution.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-32">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">STUDIO TIMELINE</h2>
          <div className="space-y-8 border-l border-neutral-800 pl-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-12 top-1 w-3 h-3 bg-accent rounded-full" />
                <span className="text-xs font-bold text-accent uppercase tracking-widest">{step.year}</span>
                <h3 className="text-xl font-bold uppercase mt-1 mb-2">{step.event}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">THE TEAM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <div key={idx} className="group">
                <div className="aspect-square bg-neutral-900 overflow-hidden mb-6">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h3 className="text-lg font-bold uppercase">{member.name}</h3>
                <p className="text-neutral-500 text-xs mt-1 uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
