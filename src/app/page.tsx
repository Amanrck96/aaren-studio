"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { SiteSettingsItem, DEFAULT_SETTINGS } from "@/lib/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Projects ─── */
const PROJECTS = [
  {
    client: "The Oberoi",
    sub: "Presidential Suite — Lobby Renovation",
    year: "2025",
    code: "OB",
    num: "01",
    slug: "oberoi-lobby",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Taj Hotels",
    sub: "Spa & Wellness Sanctuary",
    year: "2025",
    code: "TJ",
    num: "02",
    slug: "taj-spa",
    img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Ratan Group",
    sub: "Corporate Headquarters — Mumbai",
    year: "2025",
    code: "RG",
    num: "03",
    slug: "ratan-hq",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Godrej Properties",
    sub: "Luxury Showflat — Worli",
    year: "2024",
    code: "GP",
    num: "04",
    slug: "godrej-worli",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Private Villa",
    sub: "Bespoke Residence — Alibaug",
    year: "2024",
    code: "PV",
    num: "05",
    slug: "alibaug-villa",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Nykaa",
    sub: "Flagship Retail Experience",
    year: "2023",
    code: "NK",
    num: "06",
    slug: "nykaa-retail",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Lodha Group",
    sub: "Club Lounge & Amenity Deck",
    year: "2023",
    code: "LG",
    num: "07",
    slug: "lodha-club",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Birla Estates",
    sub: "Penthouse Interiors — Delhi",
    year: "2023",
    code: "BE",
    num: "08",
    slug: "birla-penthouse",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  },
];



/* ─── Services ─── */
const SERVICES = [
  "Plywood",
  "Decorative surfaces",
  "Cladding & Decking",
  "Wooden flooring",
  "Screens",
  "Doors",
  "Windows",
  "Kitchen",
  "Wardrobe",
  "Hardware",
  "Partition",
  "FF&E",
  "Tiles",
  "Wellness",
];

/* ─── Logo letters for staggered reveal ─── */
const LOGO_LETTERS = ["A", "A", "R", "E", "N"];

const CATEGORY_BRAND_LOGOS: Record<string, string> = {
  "plywood": "/brands/logos/peelply_logo.png",
  "peelply": "/brands/logos/peelply_logo.png",
  "cat-pw": "/brands/logos/peelply_logo.png",
  "laminate": "/brands/logos/formica_logo.png",
  "laminates": "/brands/logos/formica_logo.png",
  "formica": "/brands/logos/formica_logo.png",
  "cat-lm": "/brands/logos/formica_logo.png",
  "facade": "/brands/logos/newtechwood_logo.png",
  "cladding": "/brands/logos/newtechwood_logo.png",
  "decking": "/brands/logos/newtechwood_logo.png",
  "newtech": "/brands/logos/newtechwood_logo.png",
  "newtechwood": "/brands/logos/newtechwood_logo.png",
  "cat-fc": "/brands/logos/newtechwood_logo.png",
  "wooden-flooring": "/brands/logos/mafi_logo.png",
  "flooring": "/brands/logos/mafi_logo.png",
  "mafi": "/brands/logos/mafi_logo.png",
  "cat-wf": "/brands/logos/mafi_logo.png",
  "screens": "/brands/logos/freedom_screens_logo.jpg",
  "freedom-screens": "/brands/logos/freedom_screens_logo.jpg",
  "cat-ss": "/brands/logos/freedom_screens_logo.jpg",
  "door-system": "/brands/logos/waltz_logo.png",
  "doorsystem": "/brands/logos/waltz_logo.png",
  "waltz": "/brands/logos/waltz_logo.png",
  "cat-ds": "/brands/logos/waltz_logo.png",
  "doors": "/brands/logos/slashform_logo.png",
  "cat-wd": "/brands/logos/slashform_logo.png",
  "windows": "/brands/logos/slashform_logo.png",
  "cat-ww": "/brands/logos/slashform_logo.png",
  "kitchen": "/brands/logos/slashform_logo.png",
  "slashform": "/brands/logos/slashform_logo.png",
  "cat-kk": "/brands/logos/slashform_logo.png",
  "wardrobe": "/brands/logos/slashform_logo.png",
  "cat-wrd": "/brands/logos/slashform_logo.png",
  "furniture": "/brands/logos/loco_logo.png",
  "loco": "/brands/logos/loco_logo.png",
  "inclass": "/brands/logos/inclass_logo.png",
  "cat-ff": "/brands/logos/loco_logo.png",
  "tiles": "/brands/logos/mirage_logo.png",
  "mirage": "/brands/logos/mirage_logo.png",
  "wow": "/brands/logos/wow_logo.png",
  "cat-tl": "/brands/logos/mirage_logo.png",
  "bathroom-fittings": "/brands/logos/fima_logo.png",
  "fima": "/brands/logos/fima_logo.png",
  "cat-bf": "/brands/logos/fima_logo.png",
  "sanitary-ware": "/brands/logos/falper_logo.png",
  "sanitaryware": "/brands/logos/falper_logo.png",
  "falper": "/brands/logos/falper_logo.png",
  "cat-sw": "/brands/logos/falper_logo.png",
  "mirrors": "/brands/logos/waltz_logo.png",
  "cat-mr": "/brands/logos/waltz_logo.png",
  "wallpapers": "/brands/logos/inkiostro_bianco_logo.png",
  "wall-covering": "/brands/logos/inkiostro_bianco_logo.png",
  "inkiostro": "/brands/logos/inkiostro_bianco_logo.png",
  "inkiostro-bianco": "/brands/logos/inkiostro_bianco_logo.png",
  "joinery": "/brands/logos/iww_logo.png",
  "iww": "/brands/logos/iww_logo.png",
};

const BRAND_LOGOS: Record<string, string> = {
  "slashform": "/brands/logos/slashform_logo.png",
  "waltz": "/brands/logos/waltz_logo.png",
  "newtech": "/brands/logos/newtechwood_logo.png",
  "newtech-wood": "/brands/logos/newtechwood_logo.png",
  "newtechwood": "/brands/logos/newtechwood_logo.png",
  "formica": "/brands/logos/formica_logo.png",
  "loco": "/brands/logos/loco_logo.png",
  "falper": "/brands/logos/falper_logo.png",
  "fima": "/brands/logos/fima_logo.png",
  "inkiostro": "/brands/logos/inkiostro_bianco_logo.png",
  "inkiostro-bianco": "/brands/logos/inkiostro_bianco_logo.png",
  "mafi": "/brands/logos/mafi_logo.png",
  "mirage": "/brands/logos/mirage_logo.png",
  "freedom-screens": "/brands/logos/freedom_screens_logo.jpg",
  "peelply": "/brands/logos/peelply_logo.png",
  "inclass": "/brands/logos/inclass_logo.png",
  "wow": "/brands/logos/wow_logo.png",
  "iww": "/brands/logos/iww_logo.png",
};

const HOME_CATEGORIES = [
  { id: "plywood", code: "PW", num: "01", name: "Plywood", sub: "Structural Panels", img: "/categories/cat_1.jpg", logo: "/brands/logos/peelply_logo.png" },
  { id: "laminate", code: "LM", num: "02", name: "Laminate", sub: "Decorative Surfaces", img: "/categories/cat_2.jpg", logo: "/brands/logos/formica_logo.png" },
  { id: "facade", code: "FC", num: "03", name: "Facade", sub: "Cladding & Decking", img: "/categories/cat_3.jpg", logo: "/brands/logos/newtechwood_logo.png" },
  { id: "wooden-flooring", code: "WF", num: "04", name: "Wooden Flooring", sub: "Engineered & Solid", img: "/categories/cat_4.jpg", logo: "/brands/logos/mafi_logo.png" },
  { id: "screens", code: "SS", num: "05", name: "Screens", sub: "Zipline Systems", img: "/categories/cat_5.jpg", logo: "/brands/logos/freedom_screens_logo.jpg" },
  { id: "door-system", code: "DS", num: "06", name: "Door System", sub: "Aluminum & Slashform", img: "/categories/cat_6.jpg", logo: "/brands/logos/waltz_logo.png" },
  { id: "doors", code: "WD", num: "07", name: "Doors", sub: "Wood & Laminate", img: "/categories/cat_7.jpg", logo: "/brands/logos/slashform_logo.png" },
  { id: "windows", code: "WW", num: "08", name: "Windows", sub: "Timber & Aluminum", img: "/categories/cat_8.jpg", logo: "/brands/logos/slashform_logo.png" },
  { id: "kitchen", code: "KK", num: "09", name: "Kitchen", sub: "Slashform K+W", img: "/categories/cat_9.jpg", logo: "/brands/logos/slashform_logo.png" },
  { id: "wardrobe", code: "WW", num: "10", name: "Wardrobe", sub: "Freedom & Slashform", img: "/categories/cat_10.jpg", logo: "/brands/logos/slashform_logo.png" },
  { id: "furniture", code: "FF", num: "11", name: "Furniture", sub: "Millwork & Bespoke", img: "/categories/cat_11.jpg", logo: "/brands/logos/loco_logo.png" },
  { id: "tiles", code: "TL", num: "12", name: "Tiles", sub: "Floors, Walls & Facades", img: "/categories/cat_12.jpg", logo: "/brands/logos/mirage_logo.png" },
  { id: "bathroom-fittings", code: "BF", num: "13", name: "Bathroom Fittings", sub: "Fima · Falper · Mildue", img: "/categories/cat_13.jpg", logo: "/brands/logos/fima_logo.png" },
  { id: "sanitary-ware", code: "SW", num: "14", name: "Sanitary Ware", sub: "IWW · Flaminia", img: "/categories/cat_14.jpg", logo: "/brands/logos/falper_logo.png" },
  { id: "mirrors", code: "MR", num: "15", name: "Mirrors", sub: "Mira · Waltz", img: "/categories/cat_15.jpg", logo: "/brands/logos/waltz_logo.png" },
];

const HOME_BRANDS = [
  { id: "slashform", code: "SF", num: "01", name: "Slashform", sub: "Doors · Windows · Kitchens", img: "/brands/brand_1_1.jpg", logo: "/brands/logos/slashform_logo.png" },
  { id: "waltz", code: "WB", num: "02", name: "Waltz by JB Glass", sub: "Mirrors · Glass Systems", img: "/brands/brand_2_1.jpg", logo: "/brands/logos/waltz_logo.png" },
  { id: "newtech", code: "NW", num: "03", name: "Newtech Wood", sub: "WPC · Facade", img: "/brands/brand_3_1.jpg", logo: "/brands/logos/newtechwood_logo.png" },
  { id: "formica", code: "FC", num: "04", name: "Formica", sub: "Laminates · Surfaces", img: "/brands/brand_4_1.jpg", logo: "/brands/logos/formica_logo.png" },
  { id: "loco", code: "LC", num: "05", name: "Loco", sub: "Furniture · Millwork", img: "/brands/brand_5_1.jpg", logo: "/brands/logos/loco_logo.png" },
  { id: "falper", code: "FP", num: "06", name: "Falper", sub: "Bathroom Fittings", img: "/brands/brand_6_1.jpg", logo: "/brands/logos/falper_logo.png" },
  { id: "fima", code: "FM", num: "07", name: "Fima Carlo Frattini", sub: "Tapware · Showers", img: "/brands/brand_7_1.jpg", logo: "/brands/logos/fima_logo.png" },
  { id: "inkiostro", code: "IB", num: "08", name: "Inkiostro Bianco", sub: "Wallcoverings · Decor", img: "/brands/brand_8_1.jpg", logo: "/brands/logos/inkiostro_bianco_logo.png" },
  { id: "mafi", code: "MF", num: "09", name: "Mafi", sub: "Engineered Wood Floors", img: "/brands/brand_9_1.jpg", logo: "/brands/logos/mafi_logo.png" },
  { id: "mirage", code: "MG", num: "10", name: "Mirage", sub: "Porcelain Tiles", img: "/brands/brand_10_1.jpg", logo: "/brands/logos/mirage_logo.png" },
  { id: "freedom-screens", code: "FS", num: "11", name: "Freedom Screens", sub: "Retractable Screens", img: "/brands/brand_freedom_screens.jpg", logo: "/brands/logos/freedom_screens_logo.jpg" },
  { id: "peelply", code: "PP", num: "12", name: "Peelply", sub: "Engineered Plywood", img: "/brands/brand_2_1.jpg", logo: "/brands/logos/peelply_logo.png" },
  { id: "inclass", code: "IC", num: "13", name: "Inclass", sub: "Designer Furniture", img: "/brands/brand_3_1.jpg", logo: "/brands/logos/inclass_logo.png" },
  { id: "wow", code: "WW", num: "14", name: "WOW", sub: "3D Ceramic Tiles", img: "/brands/brand_4_1.jpg", logo: "/brands/logos/wow_logo.png" },
  { id: "iww", code: "IW", num: "15", name: "IWW", sub: "Stone & Joinery", img: "/brands/brand_5_1.jpg", logo: "/brands/logos/iww_logo.png" },
];

/* ── Top brand carousel images (fast slideshow for first 2 brands) ── */
const BRAND_CAROUSEL_IMGS = [
  [
    "/brands/brand_1_1.jpg",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "/brands/brand_2_1.jpg",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  ],
];

const INTRO_SENTENCES = [
  "One Stop Destination for World<br />Class Interior Solutions",
  "Window to the world<br />of interior products",
  "Incredible products of<br />world renowned brands",
  "Carefully curated products<br />focused on unique experience",
  "The experience you've only<br />dreamt about",
  "To see the unseen"
];

/* ─── Hook: scroll-triggered class ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function Home() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsItem>(DEFAULT_SETTINGS);
  const [categoriesList, setCategoriesList] = useState(HOME_CATEGORIES);
  const [brandsList, setBrandsList] = useState(HOME_BRANDS);
  const [projectsList, setProjectsList] = useState(PROJECTS);

  useEffect(() => {
    Promise.all([
      fetch("/api/site-settings").then((r) => r.json()).catch(() => null),
      fetch("/api/categories").then((r) => r.json()).catch(() => null),
      fetch("/api/brands").then((r) => r.json()).catch(() => null),
      fetch("/api/projects").then((r) => r.json()).catch(() => null),
    ]).then(([settingsJson, catsJson, brandsJson, projectsJson]) => {
      if (settingsJson?.success && settingsJson?.data) {
        setSiteSettings(settingsJson.data);
      }
      if (catsJson?.success && Array.isArray(catsJson.data) && catsJson.data.length > 0) {
        const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        setCategoriesList(
          catsJson.data.map((c: any) => {
            const rawId = (c.id || "").toLowerCase();
            const rawName = norm(c.name || "");
            const logo = CATEGORY_BRAND_LOGOS[rawId] || CATEGORY_BRAND_LOGOS[rawName] || CATEGORY_BRAND_LOGOS[c.shortCode?.toLowerCase()] || "";
            return {
              id: c.id,
              code: c.shortCode ? c.shortCode.split(" ")[0] : "CAT",
              num: c.sequenceNumber ? String(c.sequenceNumber).padStart(2, "0") : "01",
              name: c.name,
              sub: c.description || "Architectural Surface",
              img: c.coverImage || "/categories/cat_1.jpg",
              logo,
            };
          })
        );
      }
      if (brandsJson?.success && Array.isArray(brandsJson.data) && brandsJson.data.length > 0) {
        const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        setBrandsList(
          brandsJson.data.map((b: any) => {
            const explicitLogo = b.logoUrl && !b.logoUrl.includes("brand_") && !b.logoUrl.endsWith("_2.png") ? b.logoUrl : "";
            const rawId = (b.id || "").toLowerCase();
            const rawName = norm(b.name || "");
            const logo = explicitLogo || BRAND_LOGOS[rawId] || BRAND_LOGOS[rawName] || "";
            return {
              id: b.id,
              code: b.shortCode ? b.shortCode.split(" ")[0] : "BR",
              num: b.sequenceNumber ? String(b.sequenceNumber).padStart(2, "0") : (b.shortCode && b.shortCode.split(" ")[1] ? b.shortCode.split(" ")[1] : "01"),
              name: b.name,
              sub: b.description || b.tagline || "Partner Brand",
              img: b.bannerUrl || b.imageUrl || "/brands/brand_1_1.jpg",
              logo,
            };
          })
        );
      }
      if (projectsJson?.success && Array.isArray(projectsJson.data) && projectsJson.data.length > 0) {
        setProjectsList(
          projectsJson.data.map((p: any, idx: number) => ({
            client: p.client || p.title,
            sub: p.title || p.description || "Architectural Project",
            year: p.year || "2025",
            code: p.code || (p.client ? p.client.slice(0, 2).toUpperCase() : "PR"),
            num: String(idx + 1).padStart(2, "0"),
            slug: p.slug || p.id,
            img: p.image || p.imageUrl || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
          }))
        );
      }
    });
  }, []);

  const logoLetters = (siteSettings?.heroTitle || "AAREN").split("");

  /* ── Logo reveal state ── */
  const [lettersRevealed, setLettersRevealed] = useState<boolean[]>(
    Array(12).fill(false)
  );

  /* ── Hover image state ── */
  const [hovered, setHovered] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [flip, setFlip] = useState(false);

  /* ── Email state ── */
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  /* ── Category full-width carousel state ── */
  const [catIdx, setCatIdx] = useState(0);
  const [catPaused, setCatPaused] = useState(false);
  const catTotal = categoriesList.length;
  useEffect(() => {
    if (catTotal <= 1 || catPaused) return;
    const t = setInterval(() => setCatIdx((p) => (p + 1) % catTotal), 6000);
    return () => clearInterval(t);
  }, [catTotal, catPaused]);

  /* ── Brands full-width carousel state ── */
  const [brandIdx, setBrandIdx] = useState(0);
  const [brandPaused, setBrandPaused] = useState(false);
  const brandTotal = brandsList.length;
  useEffect(() => {
    if (brandTotal <= 1 || brandPaused) return;
    const t = setInterval(() => setBrandIdx((p) => (p + 1) % brandTotal), 6000);
    return () => clearInterval(t);
  }, [brandTotal, brandPaused]);

  /* ── Intro scroll-driven text refs ── */
  const introSectionRef = useRef<HTMLDivElement>(null);
  const introTextContainerRef = useRef<HTMLDivElement>(null);
  const introLinesRef = useRef<(HTMLParagraphElement | null)[]>([]);

  /* ── Scroll observer refs ── */
  const introRef = useInView(0.1);
  const projectsRef = useInView(0.05);
  const newsletterRef = useInView(0.2);

  /* ── Logo reveal on mount ── */
  useEffect(() => {
    logoLetters.forEach((_, i) => {
      setTimeout(() => {
        setLettersRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 120);
    });
  }, [siteSettings?.heroTitle]);

  /* ── Mouse tracking ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setFlip(e.clientX > window.innerWidth / 2);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  /* ── Client 3D Cylinder Scroll Animation (Sturdy.co UX) ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();


      // 0. Intro Section Scroll-driven 3D Drum Text Animation
      const introLines = introLinesRef.current.filter(Boolean) as HTMLParagraphElement[];
      if (introLines.length > 0 && introSectionRef.current && introTextContainerRef.current) {
        if (prefersReducedMotion) {
          gsap.set(introLines, {
            opacity: 1,
            scale: 1,
            z: 0,
            rotationX: 0,
            color: "#80673f"
          });
        } else {
          // Define radius matching the viewport
          const introSetups = [
            { query: "(max-width: 767px)", radius: 140 },
            { query: "(min-width: 768px) and (max-width: 1239px)", radius: 240 },
            { query: "(min-width: 1240px)", radius: 360 }
          ];

          introSetups.forEach(({ query, radius }) => {
            mm.add(query, () => {
              const origin = `50% 50% -${radius}px`;
              const angleStep = 55; // spacing in degrees for each segment

              // Position each sentence on the 3D drum cylinder
              introLines.forEach((el, i) => {
                const rotationX = -angleStep * i;
                gsap.set(el, {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  xPercent: -50,
                  yPercent: -50,
                  z: radius,
                  rotationX: rotationX,
                  transformOrigin: origin,
                  force3D: true,
                  scale: 0.8,
                  opacity: 0.15,
                  color: "rgba(128, 103, 63, 0.35)",
                  width: "100%",
                  textAlign: "center"
                });
              });

              // Initial state for the first item
              if (introLines[0]) {
                gsap.set(introLines[0], {
                  scale: 1.15,
                  opacity: 1,
                  color: "#80673f"
                });
              }

              const lastRotation = -angleStep * (introLines.length - 1);

              const introMapper = gsap.utils.pipe(
                gsap.utils.mapRange(0, 1, 0, introLines.length - 1),
                gsap.utils.snap(1)
              );

              // Timeline for rotating the cylinder container
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: introSectionRef.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                  onUpdate: (self) => {
                    const activeIdx = introMapper(self.progress);
                    introLines.forEach((el, i) => {
                      const diff = Math.abs(i - activeIdx);
                      if (diff === 0) {
                        gsap.to(el, {
                          opacity: 1,
                          scale: 1.15,
                          color: "#80673f",
                          duration: 0.35,
                          ease: "power1.out",
                          overwrite: "auto"
                        });
                      } else {
                        gsap.to(el, {
                          opacity: 0.15,
                          scale: 0.8,
                          color: "rgba(128, 103, 63, 0.35)",
                          duration: 0.35,
                          ease: "power1.out",
                          overwrite: "auto"
                        });
                      }
                    });
                  }
                }
              });

              tl.fromTo(introTextContainerRef.current,
                { rotationX: 0 },
                {
                  rotationX: -lastRotation,
                  ease: "none",
                  transformOrigin: "50% 50%",
                  force3D: true,
                }
              );

              return () => {
                tl.kill();
                gsap.set(introLines, { clearProps: "all" });
                if (introTextContainerRef.current) {
                  gsap.set(introTextContainerRef.current, { clearProps: "all" });
                }
              };
            });
          });
        }
      }


    });

    return () => ctx.revert();
  }, []);

  const getCategoryHref = (cat: { id?: string; name: string }) => {
    return `/products?category=${encodeURIComponent(cat.name)}`;
  };

  const getBrandHref = (brand: { id?: string; name?: string; slug?: string }) => {
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const idNorm = norm(brand.id || "");
    const nameNorm = norm(brand.name || "");

    if (idNorm === "newtech" || idNorm.includes("newtech") || nameNorm.includes("newtech") || nameNorm.includes("new-tech") || nameNorm.includes("new tech")) {
      return "/brands/newtech-wood";
    }
    if (idNorm === "inkiostro" || idNorm.includes("inkiostro") || nameNorm.includes("inkiostro")) {
      return "/brands/inkiostro-bianco";
    }
    if (idNorm === "peelply" || idNorm.includes("peelply") || nameNorm.includes("peelply") || nameNorm.includes("peel ply")) {
      return "/brands/peelply";
    }
    if (idNorm === "freedom" || idNorm.includes("freedom") || nameNorm.includes("freedom")) {
      return "/brands/freedom-screens";
    }
    if (idNorm === "living-ceramica" || nameNorm.includes("living ceramic")) {
      return "/brands/living-ceramica";
    }
    if (idNorm === "alex-turco" || nameNorm.includes("alex turco")) {
      return "/brands/alex-turco";
    }
    if (idNorm === "fima" || nameNorm.includes("fima")) {
      return "/brands/fima";
    }
    if (idNorm === "falper" || nameNorm.includes("falper")) {
      return "/brands/falper";
    }
    if (idNorm === "formica" || nameNorm.includes("formica")) {
      return "/brands/formica";
    }
    if (idNorm === "slashform" || nameNorm.includes("slashform")) {
      return "/brands/slashform";
    }
    if (idNorm === "waltz" || nameNorm.includes("waltz")) {
      return "/brands/waltz";
    }
    if (idNorm === "loco" || nameNorm.includes("loco")) {
      return "/brands/loco";
    }
    if (idNorm === "mafi" || nameNorm.includes("mafi")) {
      return "/brands/mafi";
    }
    if (idNorm === "mirage" || nameNorm.includes("mirage")) {
      return "/brands/mirage";
    }
    if (idNorm === "inclass" || nameNorm.includes("inclass")) {
      return "/brands/inclass";
    }
    if (idNorm === "wow" || nameNorm.includes("wow")) {
      return "/brands/wow";
    }
    if (idNorm === "iww" || nameNorm.includes("iww")) {
      return "/brands/iww";
    }
    if (idNorm === "florim" || nameNorm.includes("florim")) {
      return "/brands/florim";
    }
    if (idNorm === "gelli" || nameNorm.includes("gelli")) {
      return "/brands/gelli";
    }
    if (idNorm === "jacuzzi" || nameNorm.includes("jacuzzi")) {
      return "/brands/jacuzzi";
    }
    return `/brands/${brand.slug || brand.id || nameNorm}`;
  };

  const hovProject = projectsList.find((p) => p.slug === hovered);

  return (
    <>
      {/* ══════════════════════════════════════
          FLOATING PROJECT HOVER IMAGE
          ══════════════════════════════════════ */}
      <div
        className={`project-hover-img${hovered ? " is-active" : ""}`}
        style={{
          left: flip ? "auto" : pos.x + 30,
          right: flip ? `calc(100vw - ${pos.x}px + 30px)` : "auto",
          top: pos.y - 150,
        }}
        aria-hidden="true"
      >
        {hovProject && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hovProject.img} alt="" />
        )}
      </div>

      {/* ══════════════════════════════════════
          SECTION 1: HERO — dark #1e1e1e
          ══════════════════════════════════════ */}
      <section
        className="theme-dark hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0 0.8rem",
          paddingTop: "7rem",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background MP4 Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          key={siteSettings?.heroVideoUrl || "/hero_bg.mp4"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
            pointerEvents: "none",
            zIndex: 0,
          }}
          src={siteSettings?.heroVideoUrl || "/hero_bg.mp4"}
        />

        {/* ── Large AAREN wordmark — letter-by-letter reveal ── */}
        <div
          aria-label={siteSettings?.heroTitle || "AAREN"}
          style={{
            overflow: "hidden",
            lineHeight: 0.85,
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            paddingTop: "0.5rem",
            zIndex: 2,
          }}
        >
          <div
            className="hero-wordmark"
            style={{
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: logoLetters.length > 6 ? "clamp(3.5rem, 10vw, 16rem)" : "clamp(4.5rem, 14vw, 24rem)",
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#ffffff",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {logoLetters.map((letter, i) => (
              <span
                key={i}
                className={`logo-letter${lettersRevealed[i] ? " is-revealed" : ""}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom: tagline + service tags ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2.4rem",
            paddingTop: "4rem",
            borderTop: "0.1rem solid rgba(255,255,255,0.1)",
            zIndex: 2,
          }}
        >
          {/* Tagline */}
          <div
            className="text-splitter"
            style={{
              fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#eaeef4",
              textTransform: "uppercase",
              maxWidth: "70rem",
              opacity: lettersRevealed[0] ? 1 : 0,
              transform: lettersRevealed[0] ? "translateY(0)" : "translateY(2rem)",
              transition: "opacity 0.7s ease 0.7s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s",
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, textTransform: "uppercase", color: "#eaeef4" }}>
              {siteSettings?.heroTagline || "Material Lab"}
            </p>
            {siteSettings?.heroSubtext && (
              <span style={{ display: "block", marginTop: "0.8rem", fontSize: "1.35rem", opacity: 0.8, textTransform: "none", fontWeight: 400, lineHeight: 1.45, color: "#cbd5e1" }}>
                {siteSettings.heroSubtext}
              </span>
            )}
          </div>

          {/* Service pill tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
              opacity: lettersRevealed[0] ? 1 : 0,
              transition: "opacity 0.6s ease 1s",
            }}
          >
            {(siteSettings?.heroCategories || SERVICES).map((svc, i) => (
              <Link
                key={i}
                href={`/products?category=${encodeURIComponent(svc)}`}
                className="btn btn--secondary"
                style={{
                  fontSize: "1.1rem",
                  padding: "0.6rem 1.2rem",
                  textDecoration: "none",
                }}
              >
                {svc}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2: INTRO — light #eaeef4
          ══════════════════════════════════════ */}
      {/* ══════════════════════════════════════
          SECTION 2: INTRO — with showroom background image & scroll-driven typography
          ══════════════════════════════════════ */}
      <section
        ref={introSectionRef}
        className="theme-dark"
        style={{
          position: "relative",
          height: "280vh",
          overflow: "visible",
        }}
      >
        {/* Sticky container to pin viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Blurred background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "url('/showroom.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(6px) brightness(0.4)",
              zIndex: 1,
              transform: "scale(1.05)",
            }}
          />

          {/* Perspective container */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
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
            {/* Scrollable text wrapper */}
            <div
              ref={introTextContainerRef}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {INTRO_SENTENCES.map((line, idx) => (
                <p
                  key={idx}
                  ref={(el) => { introLinesRef.current[idx] = el; }}
                  className={
                    idx === 0
                      ? "intro-drum-label intro-drum-label--first intro-drum-label--one-stop"
                      : idx === 5
                      ? "intro-drum-label"
                      : "intro-drum-label intro-drum-label--first"
                  }
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: "var(--font-jost), sans-serif",
                    margin: 0,
                    width: "100%",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    color: "#80673f",
                    willChange: "transform, opacity",
                  }}
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BROWSE BY CATEGORY — 2-card carousel (1920x1080)
          ══════════════════════════════════════ */}
      <section className="theme-light" style={{ borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>

        {/* Centered Header bar */}
        <div className="cat-header-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4.8rem 2.4rem 2.4rem 2.4rem", borderBottom: "0.1rem solid rgba(0,0,0,0.12)", position: "relative" }}>
          {/* Left pagination & controls */}
          <div style={{ position: "absolute", left: "2.4rem", bottom: "2.4rem", display: "flex", alignItems: "center", gap: "1.6rem" }} className="cat-header-left">
            <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>
              {String(catIdx + 1).padStart(2, "0")} / {String(catTotal).padStart(2, "0")}
            </span>
            <div className="cat-header-dots" style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              {categoriesList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCatIdx(i)}
                  aria-label={`Category ${i + 1}`}
                  style={{ width: catIdx === i ? "2.4rem" : "0.5rem", height: "0.5rem", borderRadius: "0.25rem", background: catIdx === i ? "#81663F" : "rgba(0,0,0,0.18)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
                />
              ))}
            </div>
          </div>

          {/* Centered Title */}
          <span className="cat-header-title" style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#81663F", textAlign: "center" }}>Browse by Category</span>

          {/* Right link */}
          <Link href="/products" id="cat-view-all" className="t-tag ul-link cat-header-view-all" style={{ position: "absolute", right: "2.4rem", bottom: "2.4rem", color: "#81663F", letterSpacing: "0.08em", fontSize: "1.25rem", fontWeight: 700 }}>View all</Link>
        </div>

        {/* 2-card carousel — overflow hidden, slides via CSS transform */}
        <div
          style={{ position: "relative", overflow: "hidden", width: "100%" }}
          onMouseEnter={() => setCatPaused(true)}
          onMouseLeave={() => setCatPaused(false)}
        >

          {/* Slide track — shifts by 50% per step (showing 2 cards) */}
          <div
            style={{
              display: "flex",
              width: `${catTotal * 50}%`,
              transform: `translateX(-${(catIdx * 100) / catTotal}%)`,
              transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {categoriesList.map((cat) => (
              <Link
                key={cat.id}
                href={getCategoryHref(cat)}
                id={`home-cat-${cat.id}`}
                style={{
                  flex: `0 0 ${100 / catTotal}%`,
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                  borderRight: "0.1rem solid rgba(0,0,0,0.12)",
                }}
                className="home-ticket-card"
              >
                {/* 1920x1080 Image Container */}
                <div style={{ position: "relative", overflow: "hidden", width: "100%", aspectRatio: "1920 / 1080", minHeight: "24rem", background: "#d8d4c8" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="home-ticket-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                  />

                  {/* Brand Logo Badge for Category — Bottom-Left */}
                  {cat.logo ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1.4rem",
                        left: "1.4rem",
                        background: "#ffffff",
                        padding: "0.6rem 1.4rem",
                        borderRadius: "0.4rem",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 5,
                        minWidth: "7rem",
                        minHeight: "3.2rem",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.logo}
                        alt={cat.name}
                        style={{
                          maxHeight: "2.4rem",
                          maxWidth: "9rem",
                          width: "auto",
                          height: "auto",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          if (target.parentElement) target.parentElement.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Caption Bar: Category Name (Left), Short Code & Serial Number side-by-side (Right) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2.4rem", padding: "1.8rem 2.4rem", background: "#FAF9F6", transition: "background 0.25s ease" }} className="home-ticket-caption">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" }}>
                    <span style={{ fontSize: "clamp(1.3rem, 1.6vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, textTransform: "uppercase", color: "#81663F" }}>{cat.name}</span>
                    <span style={{ fontSize: "1.1rem", color: "#5E5852", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.2 }}>{cat.sub}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "clamp(2rem, 2.8vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#81663F" }}>{cat.code}</span>
                    <span style={{ fontSize: "clamp(1.6rem, 2.2vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(129,102,63,0.35)" }}>{cat.num}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* LEFT arrow — large, always visible */}
          <button
            onClick={() => setCatIdx((p) => (p - 1 + catTotal) % catTotal)}
            aria-label="Previous category"
            style={{
              position: "absolute", left: "1.6rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "0.1rem solid #D8D0BE",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#81663F", boxShadow: "0 0.4rem 2rem rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            className="cat-nav-btn"
          >←</button>

          {/* RIGHT arrow — large, always visible */}
          <button
            onClick={() => setCatIdx((p) => (p + 1) % catTotal)}
            aria-label="Next category"
            style={{
              position: "absolute", right: "1.6rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "0.1rem solid #D8D0BE",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#81663F", boxShadow: "0 0.4rem 2rem rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            className="cat-nav-btn"
          >→</button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BROWSE BY BRANDS — 2-card full carousel showing ALL ~20 brands (1920x1080)
          ══════════════════════════════════════ */}
      <section className="theme-light" style={{ borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>

        {/* Centered Header bar */}
        <div className="cat-header-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4.8rem 2.4rem 2.4rem 2.4rem", borderBottom: "0.1rem solid rgba(0,0,0,0.12)", position: "relative" }}>
          {/* Left pagination & controls */}
          <div style={{ position: "absolute", left: "2.4rem", bottom: "2.4rem", display: "flex", alignItems: "center", gap: "1.6rem" }} className="cat-header-left">
            <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>
              {String(brandIdx + 1).padStart(2, "0")} / {String(brandTotal).padStart(2, "0")}
            </span>
            <div className="cat-header-dots" style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              {brandsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBrandIdx(i)}
                  aria-label={`Brand ${i + 1}`}
                  style={{ width: brandIdx === i ? "2.4rem" : "0.5rem", height: "0.5rem", borderRadius: "0.25rem", background: brandIdx === i ? "#81663F" : "rgba(0,0,0,0.18)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
                />
              ))}
            </div>
          </div>

          {/* Centered Title */}
          <span className="cat-header-title" style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#81663F", textAlign: "center" }}>Browse by Brands</span>

          {/* Right link */}
          <Link href="/brands" id="brand-view-all" className="t-tag ul-link cat-header-view-all" style={{ position: "absolute", right: "2.4rem", bottom: "2.4rem", color: "#81663F", letterSpacing: "0.08em", fontSize: "1.25rem", fontWeight: 700 }}>View all</Link>
        </div>

        {/* 2-card carousel — overflow hidden, slides via CSS transform */}
        <div
          style={{ position: "relative", overflow: "hidden", width: "100%" }}
          onMouseEnter={() => setBrandPaused(true)}
          onMouseLeave={() => setBrandPaused(false)}
        >

          {/* Slide track — shifts by 50% per step (showing 2 cards on desktop) */}
          <div
            style={{
              display: "flex",
              width: `${brandTotal * 50}%`,
              transform: `translateX(-${(brandIdx * 100) / brandTotal}%)`,
              transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {brandsList.map((brand) => (
              <Link
                key={brand.id}
                href={getBrandHref(brand)}
                id={`home-brand-${brand.id}`}
                style={{
                  flex: `0 0 ${100 / brandTotal}%`,
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                  borderRight: "0.1rem solid rgba(0,0,0,0.12)",
                }}
                className="home-ticket-card"
              >
                {/* 1920x1080 Image Container */}
                <div style={{ position: "relative", overflow: "hidden", width: "100%", aspectRatio: "1920 / 1080", minHeight: "24rem", background: "#d8d4c8" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.img}
                    alt={brand.name}
                    className="home-ticket-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                  />

                  {/* Brand Logo Badge for Brand — Bottom-Left */}
                  {brand.logo ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1.4rem",
                        left: "1.4rem",
                        background: "#ffffff",
                        padding: "0.6rem 1.4rem",
                        borderRadius: "0.4rem",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 5,
                        minWidth: "7rem",
                        minHeight: "3.2rem",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        style={{
                          maxHeight: "2.4rem",
                          maxWidth: "9rem",
                          width: "auto",
                          height: "auto",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          if (target.parentElement) target.parentElement.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Caption Bar: Brand Name (Left), Short Code & Number side-by-side (Right) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2.4rem", padding: "1.8rem 2.4rem", background: "#FAF9F6", transition: "background 0.25s ease" }} className="home-ticket-caption">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" }}>
                    <span style={{ fontSize: "clamp(1.3rem, 1.6vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, textTransform: "uppercase", color: "#81663F" }}>{brand.name}</span>
                    <span style={{ fontSize: "1.1rem", color: "#5E5852", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.2 }}>{brand.sub}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "clamp(2rem, 2.8vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#81663F" }}>{brand.code}</span>
                    <span style={{ fontSize: "clamp(1.6rem, 2.2vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(129,102,63,0.35)" }}>{brand.num}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* LEFT arrow — large, always visible */}
          <button
            onClick={() => setBrandIdx((p) => (p - 1 + brandTotal) % brandTotal)}
            aria-label="Previous brand"
            style={{
              position: "absolute", left: "1.6rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "0.1rem solid #D8D0BE",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#81663F", boxShadow: "0 0.4rem 2rem rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            className="cat-nav-btn"
          >←</button>

          {/* RIGHT arrow — large, always visible */}
          <button
            onClick={() => setBrandIdx((p) => (p + 1) % brandTotal)}
            aria-label="Next brand"
            style={{
              position: "absolute", right: "1.6rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "0.1rem solid #D8D0BE",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#81663F", boxShadow: "0 0.4rem 2rem rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            className="cat-nav-btn"
          >→</button>
        </div>
      </section>


      {/* ══════════════════════════════════════
          SELECTED PROJECTS — 4-across ticket grid
          ══════════════════════════════════════ */}
      <section className="theme-light" style={{ borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>

        {/* Centered Header bar */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4.8rem 2.4rem 2.4rem 2.4rem", borderBottom: "0.1rem solid rgba(0,0,0,0.12)", position: "relative" }}>
          {/* Centered Title */}
          <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#81663F", textAlign: "center" }}>Selected Projects</span>

          {/* Right link */}
          <Link href="/work" className="t-tag ul-link" style={{ position: "absolute", right: "2.4rem", bottom: "2.4rem", color: "#81663F", letterSpacing: "0.08em", fontSize: "1.25rem", fontWeight: 700 }}>View all</Link>
        </div>

        {/* 4-across on desktop, 2-across on mobile */}
        <div className="home-projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", width: "100%" }}>
          {projectsList.slice(0, 4).map((project, i) => (
            <Link
              key={project.slug}
              href="/work"
              id={`home-proj-${project.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: i < 3 ? "0.1rem solid rgba(0,0,0,0.12)" : "none",
                textDecoration: "none",
                color: "inherit",
                overflow: "hidden",
              }}
              className="home-ticket-card"
            >
              <div style={{ overflow: "hidden", height: "clamp(18rem, 22vw, 36rem)", background: "#111", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.img} alt={project.client} className="home-ticket-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.8rem", padding: "1.2rem 0.8rem", background: "#E6E2D8", transition: "background 0.25s ease" }} className="home-ticket-caption">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "clamp(1.0rem, 1.1vw, 1.3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, textTransform: "uppercase", color: "#81663F" }}>{project.client}</span>
                  <span style={{ fontSize: "1.0rem", color: "#5E5852", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2 }}>{project.sub}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "clamp(1.4rem, 2.2vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#81663F" }}>{project.code}</span>
                  <span style={{ fontSize: "clamp(1.2rem, 1.8vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(129,102,63,0.35)" }}>{project.num}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>




      {/* ══════════════════════════════════════
          SECTION 5: NEWSLETTER — light #eaeef4
          ══════════════════════════════════════ */}
      <section
        className="theme-light"
        style={{
          paddingTop: "19.6rem",
          paddingBottom: "19.6rem",
          padding: "19.6rem 0.8rem",
          borderTop: "0.1rem solid var(--color-border)",
        }}
      >
        <div
          ref={newsletterRef.ref}
          style={{ marginLeft: "auto", maxWidth: "72rem" }}
        >
          <p
            className={`text-splitter${newsletterRef.visible ? " is-visible" : ""}`}
            style={{
              fontSize: "clamp(2.4rem, 3.8vw, 4.6rem)",
              letterSpacing: "-0.03em",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.0,
              color: "#81663F",
              marginBottom: "6rem",
            }}
          >
            Keep up with the latest, for all things AAREN.
            Drop your email below, and let&apos;s stay connected.
          </p>

          {/* Email form with blinking cursor */}
          {sent ? (
            <p
              style={{
                fontSize: "1.4rem",
                color: "#5E5852",
                letterSpacing: "-0.01em",
              }}
            >
              Thank you — we&apos;ll be in touch.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                borderBottom: "0.1rem solid rgba(0,0,0,0.2)",
                paddingBottom: "1.2rem",
                maxWidth: "60rem",
              }}
            >
              {/* Blinking cursor before input */}
              <span className="cursor-blink" aria-hidden="true" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "1.4rem",
                  letterSpacing: "-0.01em",
                  color: "#000",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              />
              <button
                type="submit"
                className="btn btn--transparent"
                style={{ flexShrink: 0, fontSize: "1.1rem" }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────
   PROJECT CARD COMPONENT
   ───────────────────────────────────────────────── */
const OBEROI_SLIDES = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80"
];

const COLLAGE_LAYOUTS = [
  // Layout 0: 2x2 Grid (4 items)
  [
    { top: "0%", left: "0%", width: "50%", height: "50%", opacity: 1 },
    { top: "0%", left: "50%", width: "50%", height: "50%", opacity: 1 },
    { top: "50%", left: "0%", width: "50%", height: "50%", opacity: 1 },
    { top: "50%", left: "50%", width: "50%", height: "50%", opacity: 1 },
  ],
  // Layout 1: Large Left, 2 Small Right (3 items)
  [
    { top: "0%", left: "0%", width: "60%", height: "100%", opacity: 1 },
    { top: "0%", left: "60%", width: "40%", height: "50%", opacity: 1 },
    { top: "50%", left: "60%", width: "40%", height: "50%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 2: 2 Small Left, Large Right (3 items)
  [
    { top: "0%", left: "0%", width: "40%", height: "50%", opacity: 1 },
    { top: "50%", left: "0%", width: "40%", height: "50%", opacity: 1 },
    { top: "0%", left: "40%", width: "60%", height: "100%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 3: 2 Vertical Columns (2 items)
  [
    { top: "0%", left: "0%", width: "50%", height: "100%", opacity: 1 },
    { top: "0%", left: "50%", width: "50%", height: "100%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 4: 3 Vertical Columns (3 items)
  [
    { top: "0%", left: "0%", width: "33.33%", height: "100%", opacity: 1 },
    { top: "0%", left: "33.33%", width: "33.34%", height: "100%", opacity: 1 },
    { top: "0%", left: "66.67%", width: "33.33%", height: "100%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 5: Large Top, 2 Small Bottom (3 items)
  [
    { top: "0%", left: "0%", width: "100%", height: "60%", opacity: 1 },
    { top: "60%", left: "0%", width: "50%", height: "40%", opacity: 1 },
    { top: "60%", left: "50%", width: "50%", height: "40%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ]
];

function CollageSlot({ src, style }: { src: string; style: React.CSSProperties }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (src !== imgSrc) {
      setFade(false);
      const t = setTimeout(() => {
        setImgSrc(src);
        setFade(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [src, imgSrc]);

  return (
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        border: "0.1rem solid var(--color-bg)",
        transition: "top 1.2s cubic-bezier(0.25, 1, 0.5, 1), left 1.2s cubic-bezier(0.25, 1, 0.5, 1), width 1.2s cubic-bezier(0.25, 1, 0.5, 1), height 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease",
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt="Collage segment"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fade ? 1 : 0,
          transform: fade ? "scale(1)" : "scale(1.05)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      />
    </div>
  );
}

function ProjectSlideshow() {
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [activeImages, setActiveImages] = useState<string[]>([
    OBEROI_SLIDES[0],
    OBEROI_SLIDES[1],
    OBEROI_SLIDES[2],
    OBEROI_SLIDES[3]
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Choose new layout
      setLayoutIdx((prev) => {
        let next = Math.floor(Math.random() * COLLAGE_LAYOUTS.length);
        while (next === prev) {
          next = Math.floor(Math.random() * COLLAGE_LAYOUTS.length);
        }
        return next;
      });

      // 2. Select 4 random unique images
      setActiveImages(() => {
        const shuffled = [...OBEROI_SLIDES].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#E6E2D8" }}>
      {COLLAGE_LAYOUTS[layoutIdx].map((slotStyle, i) => (
        <CollageSlot
          key={i}
          src={activeImages[i] || OBEROI_SLIDES[i]}
          style={{
            top: slotStyle.top,
            left: slotStyle.left,
            width: slotStyle.width,
            height: slotStyle.height,
            opacity: slotStyle.opacity,
          }}
        />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: typeof PROJECTS[0];
  onHover: (slug: string | null) => void;
  visible: boolean;
  delay: number;
}

function ProjectCard({
  project,
  onHover,
  visible,
  delay,
}: ProjectCardProps) {
  const isSlideshow = project.slug === "oberoi-lobby";

  return (
    <div className="cursor-trigger project-item project-item--project">
      <Link
        href={`/work/${project.slug}`}
        className="project-item__link"
        onMouseEnter={() => onHover(project.slug)}
        onMouseLeave={() => onHover(null)}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(3rem)",
          transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      >
        {/* Image / Slideshow */}
        <div className="project-item__fig-wrapper">
          <figure className="project-item__fig">
            {isSlideshow ? (
              <ProjectSlideshow />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.img}
                alt={`${project.client} — ${project.sub}`}
              />
            )}
          </figure>
        </div>

        {/* Content */}
        <div className="project-item__content">
          <div className="project-item__inner">
            <h3 className="projec-item__title">
              {project.client}
            </h3>
            <p className="project-item__info">{project.sub}</p>
            <p className="project-item__info">{project.year}</p>
          </div>
          <div className="project-item__inner unicode">
            <p>{project.code}</p>
            <p>{project.num}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
