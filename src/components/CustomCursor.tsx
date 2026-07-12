"use client";
import { useEffect, useRef } from "react";

/**
 * CustomCursor — exact Sturdy.co implementation
 * - 7.2rem × 7.2rem circular element
 * - backdrop-filter: blur(1rem)
 * - background: rgba(0,0,0,0.4)
 * - scales from 0 on init → 1 when hovering links / interactive elements
 * - smooth follow with requestAnimationFrame lerp
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        cursor.classList.add("is-visible");
      }
    };

    const onEnterLink = () => {
      cursor.classList.add("is-link");
    };

    const onLeaveLink = () => {
      cursor.classList.remove("is-link");
    };

    const addListeners = () => {
      document
        .querySelectorAll("a, button, [data-cursor]")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnterLink);
          el.addEventListener("mouseleave", onLeaveLink);
        });
    };

    const loop = () => {
      // Lerp for smooth trailing
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      cursor.style.left = currentX + "px";
      cursor.style.top = currentY + "px";

      rafRef.current = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove);
    addListeners();

    // Re-add listeners when DOM updates (Next.js navigation)
    const observer = new MutationObserver(() => {
      addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="s-cursor"
      aria-hidden="true"
    />
  );
}
