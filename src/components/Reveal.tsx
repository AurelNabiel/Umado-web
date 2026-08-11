"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}>{children}</div>;
}
