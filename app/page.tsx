'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import articlesData from '@/data/articles.json';

interface Article {
  slug: string;
  meta_title: string;
  meta_description: string;
  hero_image: string;
  hero_title: string;
  date: string;
  read_time: string;
  category_label?: string;
  section_label?: string;
  section?: string;
  category?: string;
}

const allArticles = articlesData as Article[];

export default function BlogHome() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // 1. ESTRAZIONE DINAMICA DELLE CATEGORIE
  const filters = useMemo(() => {
    const uniqueFilters = new Map();
    uniqueFilters.set('all', 'Tutti gli articoli');

    allArticles.forEach(article => {
      if (article.section_label && article.section) {
        uniqueFilters.set(article.section, article.section_label);
      }
      if (article.category_label && article.category) {
        uniqueFilters.set(article.category, article.category_label);
      }
    });

    return Array.from(uniqueFilters.entries());
  }, []);

  // 2. LOGICA DI FILTRAGGIO
  const visibleArticles = useMemo(() => {
    if (activeFilter === 'all') return allArticles;
    
    return allArticles.filter(article => 
      article.section === activeFilter || article.category === activeFilter
    );
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* HERO SECTION */}
      <div className="bg-white pb-12 pt-16 px-6 text-center border-b border-gray-100">
        
        {/* TITOLO CON 'GUIDE' ARANCIONE */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          30 Seconds To <span className="text-orange-600">Guide</span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Itinerari di viaggio generati dall'AI, testati da umani.
          <br className="hidden md:block" />
          Meno tempo a pianificare, più tempo a viaggiare.
        </p>

        {/* BARRA DEI FILTRI */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${
                activeFilter === key
                  ? 'bg-orange-600 text-white shadow-lg ring-2 ring-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* GRIGLIA ARTICOLI */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {visibleArticles.map((article) => (
            <Link 
              href={`/${article.slug}`} 
              key={article.slug}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
            >
              {/* Immagine Card */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={article.hero_image}
                  alt={article.hero_title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-800 shadow-sm">
                  {article.category_label || article.read_time}
                </div>
              </div>

              {/* Contenuto Card */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-3">
                  {article.date}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                  {article.hero_title}
                </h2>
                <p className="text-gray-500 line-clamp-3 mb-6 flex-1">
                  {article.meta_description}
                </p>
                
                <div className="flex items-center text-sm font-bold text-gray-900 mt-auto">
                  Leggi l'itinerario 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">➜</span>
                </div>
              </div>
            </Link>
          ))}

        </div>

        {/* Messaggio se vuoto */}
        {visibleArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nessun articolo trovato per questa categoria.</p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-orange-600 font-bold hover:underline"
            >
              Mostra tutti
            </button>
          </div>
        )}

      </main>

      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-500 text-sm">
          © 2026 30SecondsToGuide. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
