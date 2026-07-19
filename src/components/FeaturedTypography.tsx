"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINES = [
  "One Stop Destination for World Class Interior Solutions",
  "Window to the world of interior products",
  "Incredible products of world renowned brands",
  "Carefully curated products focused on unique experience",
  "The experience you've only dreamt about",
  "To see the unseen",
];

export default function FeaturedTypography() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef    = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section   = sectionRef.current;
    const container = containerRef.current;
    const lines     = linesRef.current.filter(Boolean) as HTMLParagraphElement[];

    if (!section || !container || lines.length === 0) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(lines, { opacity: 1, scale: 1, rotationX: 0, z: 0, color: "#eaeef4" });
        return;
      }

      /* ── initial state ── */
      gsap.set(lines, {
        opacity: 0.2,
        scale: 0.8,
        rotationX: 30,
        z: -100,
        color: "rgba(234,238,244,0.3)",
        transformOrigin: "50% 50%",
      });
      gsap.set(lines[0], { opacity: 1, scale: 1.15, rotationX: 0, z: 0, color: "#eaeef4" });

      const mapper = gsap.utils.pipe(
        gsap.utils.mapRange(0, 1, 0, lines.length - 1),
        gsap.utils.snap(1)
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const activeIdx = mapper(self.progress) as number;

          /* center active line vertically */
          const targetLine    = lines[activeIdx];
          if (!targetLine) return;
          const targetY = -(
            targetLine.offsetTop +
            targetLine.clientHeight / 2 -
            container.clientHeight / 2
          );
          gsap.to(container, {
            y: targetY,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });

          /* style each line */
          lines.forEach((el, i) => {
            if (i === activeIdx) {
              gsap.to(el, {
                opacity: 1,
                scale: 1.15,
                rotationX: 0,
                z: 0,
                color: "#eaeef4",
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else {
              const dir = i < activeIdx ? -1 : 1;
              gsap.to(el, {
                opacity: 0.2,
                scale: 0.8,
                rotationX: 30 * dir,
                z: -100,
                color: "rgba(234,238,244,0.3)",
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="theme-dark"
      style={{ position: "relative", height: "280vh", overflow: "visible" }}
    >
      {/* ── sticky viewport ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", zIndex: 1 }} />

        {/* Grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            opacity: 0.45,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Label bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "2rem 0.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 4,
            borderBottom: "0.1rem solid rgba(255,255,255,0.07)",
          }}
        >
          <span className="t-tag" style={{ color: "rgba(255,255,255,0.35)" }}>Featured</span>
          <span className="t-tag" style={{ color: "rgba(255,255,255,0.18)" }}>
            {LINES.length} Lines
          </span>
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: "absolute",
            right: "2.4rem",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            zIndex: 4,
          }}
        >
          {LINES.map((_, i) => (
            <div
              key={i}
              style={{
                width: "0.4rem",
                height: "0.4rem",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>

        {/* 3-D perspective stage */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            maxWidth: "110rem",
            width: "100%",
            padding: "0 2.4rem",
            textAlign: "center",
            height: "45rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Scrolling text wrapper */}
          <div
            ref={containerRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2.5rem",
              willChange: "transform",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              transformStyle: "preserve-3d",
            }}
          >
            {LINES.map((line, idx) => (
              <p
                key={idx}
                ref={(el) => { linesRef.current[idx] = el; }}
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 3.6rem)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  margin: 0,
                  width: "100%",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  color: "#eaeef4",
                  willChange: "transform, opacity",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
