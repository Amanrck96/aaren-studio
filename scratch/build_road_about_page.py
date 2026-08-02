import os

code = """"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Award, CheckCircle2, ChevronRight, Layers, ArrowRight, ShieldCheck, Gem, MapPin } from "lucide-react";

type TimelineMilestone = {
  id: string;
  num: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  code: string;
  codeNum: string;
  pinColor: string;
  position: "top" | "bottom" | "left" | "right";
  image: string;
};

const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: "1990",
    num: "1",
    year: "1990",
    title: "Poonam Timbers Inception",
    subtitle: "Raw Material Foundations",
    description: "Founded as Poonam Timbers, establishing our deep roots in high-quality timber and raw surface materials.",
    code: "PT",
    codeNum: "90",
    pinColor: "#ef4444", // Luxury Crimson Pin (matching reference Image 1)
    position: "bottom",
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2015",
    num: "2",
    year: "2015",
    title: "Rebranded as Aaren Intpro",
    subtitle: "Luxury European Expansion",
    description: "Rebranded as Aaren Intpro, expanding into elite global interior products and architectural solutions.",
    code: "AI",
    codeNum: "15",
    pinColor: "#ef4444",
    position: "top",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2021",
    num: "3",
    year: "2021",
    title: "AAREN Experience Studio",
    subtitle: "Bengaluru Flagship Studio",
    description: "Unveiled the multi-floor state-of-the-art AAREN Experience Studio in Bengaluru for architects & designers.",
    code: "AS",
    codeNum: "21",
    pinColor: "#ef4444",
    position: "bottom",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2026",
    num: "4",
    year: "2026",
    title: "Premier Material Destination",
    subtitle: "100% Curated Global Brands",
    description: "Bengaluru's primary destination for world-renowned brands, luxury bathroom fixtures, and surfaces.",
    code: "UD",
    codeNum: "26",
    pinColor: "#ef4444",
    position: "top",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AboutPage() {
  const [activePin, setActivePin] = useState<string>("1990");

  return (
    <div className="about-page font-['Jost',sans-serif]">
      {/* ── HERO SECTION ── */}
      <div className="about-hero">
        <div className="about-hero__inner">
          <div className="about-hero__meta t-tag">
            THE HOUSE — EST. 1990
          </div>
          <h1 className="about-hero__title">ABOUT US</h1>
          <p className="about-hero__desc">
            Aaren Intpro is Bengaluru&apos;s premier material house and luxury lifestyle curator, dedicated to providing world-class interior products under one roof.
          </p>
        </div>
      </div>

      {/* ── MISSION / VISION / VALUES SECTION ── */}
      <div className="about-mvv-strip">
        <div className="mvv-grid">
          {/* Mission */}
          <div className="mvv-card">
            <div className="mvv-card__header">
              <span className="mvv-card__title">OUR MISSION</span>
              <span className="mvv-card__num">01</span>
            </div>
            <p className="mvv-card__text">
              To provide premium, elite, and high-quality lifestyle products under one roof for the global Indian customer.
            </p>
          </div>

          {/* Vision */}
          <div className="mvv-card">
            <div className="mvv-card__header">
              <span className="mvv-card__title">OUR VISION</span>
              <span className="mvv-card__num">02</span>
            </div>
            <p className="mvv-card__text">
              To remain the primary one-stop destination for architects, interior designers, builders, and homeowners seeking world-class materials.
            </p>
          </div>

          {/* Values */}
          <div className="mvv-card">
            <div className="mvv-card__header">
              <span className="mvv-card__title">OUR VALUES</span>
              <span className="mvv-card__num">03</span>
            </div>
            <p className="mvv-card__text">
              Uniting as a family, prioritizing robust value systems, and providing curated designs focusing on unique client experiences.
            </p>
          </div>
        </div>
      </div>

      {/* ── COMPANY TIMELINE (WINDING ROAD MAP ROADWAY) ── */}
      <div className="about-timeline-container">
        <div className="timeline-section-header">
          <span className="t-tag">COMPANY TIMELINE</span>
          <h2 className="timeline-section-title font-light">Our Journey Through Time</h2>
        </div>

        {/* 3D Winding S-Road Highway View for Desktop (1024px+) */}
        <div className="hidden lg:block relative w-full overflow-hidden py-16">
          <div className="max-w-[1280px] mx-auto relative min-h-[580px]">
            {/* Winding Highway SVG Canvas Path */}
            <svg
              className="w-full h-full absolute inset-0 pointer-events-none"
              viewBox="0 0 1200 550"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Road Outer Shadow/Depth */}
              <path
                d="M 50 320 C 200 320, 220 120, 400 120 C 580 120, 600 420, 780 420 C 960 420, 980 200, 1150 200"
                stroke="#1e293b"
                strokeWidth="74"
                strokeLinecap="round"
                opacity="0.2"
                transform="translate(0, 12)"
              />

              {/* Road Base Asphalt */}
              <path
                d="M 50 320 C 200 320, 220 120, 400 120 C 580 120, 600 420, 780 420 C 960 420, 980 200, 1150 200"
                stroke="#334155"
                strokeWidth="68"
                strokeLinecap="round"
              />

              {/* Road Surface Inner Track */}
              <path
                d="M 50 320 C 200 320, 220 120, 400 120 C 580 120, 600 420, 780 420 C 960 420, 980 200, 1150 200"
                stroke="#475569"
                strokeWidth="56"
                strokeLinecap="round"
              />

              {/* White Center Dashed Line */}
              <path
                d="M 50 320 C 200 320, 220 120, 400 120 C 580 120, 600 420, 780 420 C 960 420, 980 200, 1150 200"
                stroke="#ffffff"
                strokeWidth="4"
                strokeDasharray="16 14"
                strokeLinecap="round"
              />
            </svg>

            {/* Milestone Markers along the Winding Highway */}
            
            {/* Milestone 1 (1990) - Left Bottom Curve */}
            <div className="absolute left-[13%] top-[340px] -translate-x-1/2 flex flex-col items-center z-10">
              {/* Pin 1 Marker */}
              <div
                onClick={() => setActivePin("1990")}
                className="road-pin-marker cursor-pointer transform hover:scale-110 transition-transform"
              >
                <div className="pin-head">1</div>
                <div className="pin-pointer" />
              </div>

              {/* Content Card (Bottom) */}
              <div className="road-milestone-box mt-4 w-[280px]">
                <div className="text-3xl font-bold text-[#0f172a] mb-1">1990</div>
                <p className="text-xs text-black/70 leading-relaxed font-medium mb-3">
                  Founded as Poonam Timbers, establishing our deep roots in high-quality timber and raw surface materials.
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold text-black/50 border-t border-black/10 pt-2">
                  <span>PT</span>
                  <span>90</span>
                </div>
              </div>
            </div>

            {/* Milestone 2 (2015) - Upper Center Curve */}
            <div className="absolute left-[38%] top-[20px] -translate-x-1/2 flex flex-col items-center z-10">
              {/* Content Card (Top) */}
              <div className="road-milestone-box mb-4 w-[280px]">
                <div className="text-3xl font-bold text-[#0f172a] mb-1">2015</div>
                <p className="text-xs text-black/70 leading-relaxed font-medium mb-3">
                  Rebranded as Aaren Intpro, expanding into elite global interior products and architectural solutions.
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold text-black/50 border-t border-black/10 pt-2">
                  <span>AI</span>
                  <span>15</span>
                </div>
              </div>

              {/* Pin 2 Marker */}
              <div
                onClick={() => setActivePin("2015")}
                className="road-pin-marker cursor-pointer transform hover:scale-110 transition-transform"
              >
                <div className="pin-head">2</div>
                <div className="pin-pointer" />
              </div>
            </div>

            {/* Milestone 3 (2021) - Lower Center Curve */}
            <div className="absolute left-[65%] top-[430px] -translate-x-1/2 flex flex-col items-center z-10">
              {/* Pin 3 Marker */}
              <div
                onClick={() => setActivePin("2021")}
                className="road-pin-marker cursor-pointer transform hover:scale-110 transition-transform"
              >
                <div className="pin-head">3</div>
                <div className="pin-pointer" />
              </div>

              {/* Content Card (Bottom) */}
              <div className="road-milestone-box mt-4 w-[280px]">
                <div className="text-3xl font-bold text-[#0f172a] mb-1">2021</div>
                <p className="text-xs text-black/70 leading-relaxed font-medium mb-3">
                  Unveiled the multi-floor state-of-the-art AAREN Experience Studio in Bengaluru for architects &amp; designers.
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold text-black/50 border-t border-black/10 pt-2">
                  <span>AS</span>
                  <span>21</span>
                </div>
              </div>
            </div>

            {/* Milestone 4 (2026) - Right Upper Curve */}
            <div className="absolute left-[92%] top-[100px] -translate-x-1/2 flex flex-col items-center z-10">
              {/* Content Card (Top) */}
              <div className="road-milestone-box mb-4 w-[280px]">
                <div className="text-3xl font-bold text-[#0f172a] mb-1">2026</div>
                <p className="text-xs text-black/70 leading-relaxed font-medium mb-3">
                  Bengaluru&apos;s primary destination for world-renowned brands, luxury bathroom fixtures, and surfaces.
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold text-black/50 border-t border-black/10 pt-2">
                  <span>UD</span>
                  <span>26</span>
                </div>
              </div>

              {/* Pin 4 Marker */}
              <div
                onClick={() => setActivePin("2026")}
                className="road-pin-marker cursor-pointer transform hover:scale-110 transition-transform"
              >
                <div className="pin-head">4</div>
                <div className="pin-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Layout (<1024px) */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {TIMELINE_MILESTONES.map((item) => (
            <div key={item.id} className="mobile-milestone-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ef4444] text-white font-bold text-xs flex items-center justify-center shadow-md">
                    {item.num}
                  </div>
                  <span className="text-2xl font-bold text-black">{item.year}</span>
                </div>
                <span className="text-xs font-bold text-[#8c764b]">{item.code} {item.codeNum}</span>
              </div>
              <p className="text-xs text-black/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── STYLES ── */}
      <style jsx>{`
        .about-page {
          background: #eaeef4;
          color: #000000;
          min-height: 100vh;
          padding-top: 80px;
        }

        .t-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(0,0,0,0.45);
        }

        /* Hero Styling */
        .about-hero {
          padding: 70px 24px 50px;
          border-bottom: 0.5px solid rgba(0,0,0,0.12);
        }

        .about-hero__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-hero__meta {
          margin-bottom: 20px;
        }

        .about-hero__title {
          font-family: var(--font-jost), sans-serif;
          font-size: 80px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #000000;
          line-height: 0.95;
          margin: 0 0 20px;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .about-hero__title {
            font-size: 46px;
          }
        }

        .about-hero__desc {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(0,0,0,0.55);
          max-width: 600px;
          margin: 0;
        }

        /* Mission / Vision / Values Strip (Screenshot 2 Match) */
        .about-mvv-strip {
          border-bottom: 0.5px solid rgba(0,0,0,0.12);
          background: #eaeef4;
        }

        .mvv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 768px) {
          .mvv-grid {
            grid-template-columns: 1fr;
          }
        }

        .mvv-card {
          padding: 32px 28px;
          border-right: 0.5px solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 160px;
          transition: background 0.2s ease;
        }

        .mvv-card:last-child {
          border-right: none;
        }

        @media (max-width: 768px) {
          .mvv-card {
            border-right: none;
            border-bottom: 0.5px solid rgba(0,0,0,0.12);
          }
        }

        .mvv-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .mvv-card__title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000000;
        }

        .mvv-card__num {
          font-size: 12px;
          font-weight: 600;
          color: rgba(0,0,0,0.35);
        }

        .mvv-card__text {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(0,0,0,0.6);
          margin: 0;
        }

        /* Winding Timeline Section */
        .about-timeline-container {
          background: #eaeef4;
          padding-top: 50px;
          padding-bottom: 60px;
          border-bottom: 0.5px solid rgba(0,0,0,0.12);
        }

        .timeline-section-header {
          padding: 0 24px 20px;
          border-bottom: 0.5px solid rgba(0,0,0,0.12);
          max-width: 1200px;
          margin: 0 auto 40px;
        }

        .timeline-section-title {
          font-size: 24px;
          color: #000000;
          margin-top: 4px;
        }

        /* 3D Road Pins (Image 1 Red Pin Marker) */
        .road-pin-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 8px 16px rgba(239,68,68,0.4));
        }

        .pin-head {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ef4444;
          border: 3px solid #ffffff;
          color: #ffffff;
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .pin-pointer {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #ef4444;
          margin-top: -2px;
        }

        /* Milestone Info Box */
        .road-milestone-box {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .road-milestone-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .mobile-milestone-card {
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
      `}</style>
    </div>
  );
}
"""

with open('src/app/about/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully written About Page with exact content and winding road map design!")
