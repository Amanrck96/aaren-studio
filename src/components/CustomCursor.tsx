"use client";
import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const dot  = document.querySelector(".s-cursor") as HTMLElement;
    const ring = document.querySelector(".s-cursor-ring") as HTMLElement;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + "px";
      dot.style.top   = my + "px";
    };

    const loop = () => {
      rx += (mx - rx) * .1;
      ry += (my - ry) * .1;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      raf = requestAnimationFrame(loop);
    };

    const on  = () => { dot.classList.add("hov");  ring.classList.add("hov"); };
    const off = () => { dot.classList.remove("hov"); ring.classList.remove("hov"); };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", on);
      el.addEventListener("mouseleave", off);
    });
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="s-cursor" />
      <div className="s-cursor-ring" />
    </>
  );
}
