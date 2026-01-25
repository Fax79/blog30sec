'use client';

import { useEffect, useRef } from 'react';

export default function FlightWidget({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Pulisce il contenitore prima di inserire lo script (evita duplicati)
    containerRef.current.innerHTML = ''; 
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.charset = 'utf-8';
    
    containerRef.current.appendChild(script);
  }, [src]);

  return <div ref={containerRef} className="my-8 min-h-[200px]" />;
}