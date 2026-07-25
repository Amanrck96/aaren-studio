"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor — exact Sturdy.co implementation
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
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

    let animationFrameId: number;
    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      cursor.style.left = currentX + "px";
      cursor.style.top = currentY + "px";

      animationFrameId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove);
    addListeners();

    const observer = new MutationObserver(() => {
      addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animationFrameId);
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
