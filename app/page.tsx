import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import articles from '@/data/articles.json';

export const metadata = {
  title: 'Blog - 30SecondsToGuide',
  description: 'Diari di viaggio, esperimenti con l\'AI e itinerari slow travel.',
};

export default function BlogHome() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* --- HERO SECTION --- */}
      <div className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        {/* Sfondo Hero: Usiamo l'immagine di Budapest scura come sfondo generale */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/budapest-hero.jpg" 
            alt="Travel Blog Hero" 
            fill 
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500 text-white text-xs font-bold tracking-widest uppercase mb-4">
            Official Blog
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            30 Seconds To <span className="text-orange-400">Guide</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Non solo algoritmi. Storie di viaggi reali, sfide all'Intelligenza Artificiale e itinerari testati sul campo.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="https://www.30secondstoguide.it" className="px-6 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors">
              Vai al Wizard 🧙‍♂️
            </a>
          </div>
        </div>
      </div>

      {/* --- ARTICLES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Ultimi Articoli</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {articles.map((article) => (
            <Link 
              href={`/${article.slug}`} 
              key={article.slug}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src={article.hero_image} 
                  alt={article.hero_title} 
                  fill 
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-sm">
                    {article.read_time}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                  <span className="font-medium text-orange-600 uppercase tracking-wider">Travel Experiment</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                  {article.hero_title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                  {article.intro_text}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {article.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{article.author}</span>
                  </div>
                  <span className="text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Leggi articolo <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}