import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import articlesData from '@/data/articles.json';
// Importiamo il widget dei voli esistente
import FlightWidget from '@/components/FlightWidget';

// --- DEFINIZIONE DEI TIPI ---

type WidgetType = 'script' | 'banner' | 'button' | 'banner-gyg' | 'banner-heymondo' | 'banner-saily';

interface Widget {
  type: string;
  label?: string;
  url?: string;
  image?: string;     
  subtitle?: string;  
  icon?: string;      
  colorClass?: string;
  links?: { name: string; url: string }[]; // Per i banner con link multipli (GYG)
  scriptUrl?: string; // Per widget specifici che usano script url
}

// Aggiunto tipo per il Badge
interface Badge {
  type: string;
  label: string;
  image: string;
}

// Aggiornata sezione per includere image e badge
interface Section {
  title: string;
  content: string;
  image?: string; 
  badge?: Badge;
  widget?: Widget | null;
}

interface Article {
  slug: string;
  meta_title: string;
  meta_description: string;
  hero_image: string;
  hero_title: string;
  intro_text: string;
  author: string;
  date: string;
  read_time: string;
  sections: Section[];
}

const articles = articlesData as unknown as Article[];

// --- WIDGET COMPONENTS HELPERS ---

// Banner Standard
const BannerWidget = ({ label, url, image }: { label?: string; url?: string; image?: string }) => {
  if (!url) return null;
  return (
    <div className="my-10 group">
      <Link href={url} target="_blank" className="block relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="relative h-64 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image || ''} 
            alt={label || 'Banner'} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Consigliato</p>
              <h3 className="text-white text-2xl font-bold">{label} ➜</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Banner Multiplo (Es. GetYourGuide)
const MultiLinkBanner = ({ label, image, links }: { label?: string; image?: string; links?: { name: string; url: string }[] }) => {
  return (
    <div className="my-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="relative h-48 w-full">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image || ''} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold shadow-sm">{label}</h3>
            </div>
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-4">
            {links?.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-orange-50 text-orange-700 py-3 rounded-lg font-bold hover:bg-orange-100 transition-colors border border-orange-200">
                    {link.name} ➜
                </a>
            ))}
        </div>
    </div>
  );
}

// Button Widget
const ButtonWidget = ({ label, subtitle, url, icon, colorClass }: { label?: string; subtitle?: string; url?: string; icon?: string; colorClass?: string }) => {
  if (!url) return null;
  const isExternal = url.startsWith('http');
  const isPdf = url.endsWith('.pdf');
  
  return (
    <div className="my-8 flex justify-center">
      <a 
        href={url} 
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? "noopener noreferrer" : undefined}
        download={isPdf} 
        className={`group flex items-center space-x-4 px-8 py-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-full md:w-auto ${colorClass || 'bg-gray-100 text-gray-900'}`}
      >
        <div className="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-sm group-hover:scale-110 transition-transform">
          {icon || '👉'}
        </div>
        <div className="text-left">
          <div className="font-bold text-lg leading-none">{label}</div>
          {subtitle && <div className="text-sm opacity-70 mt-1 font-medium">{subtitle}</div>}
        </div>
      </a>
    </div>
  );
};

// --- MOTORE WIDGET ---
const WidgetRenderer = ({ widget }: { widget?: Widget | null }) => {
  if (!widget) return null;

  // Normalizziamo i tipi per gestire i casi del JSON
  const type = widget.type;

  if (type === 'script' || type === 'widget-kiwi') {
     // Usa l'URL dello script se presente, altrimenti l'url generico
     const src = widget.scriptUrl || widget.url;
     if (!src) return null;
     return (
        <div className="my-8 min-h-[200px] bg-gray-50 rounded-xl overflow-hidden">
             <FlightWidget src={src} />
        </div>
      );
  }

  if (type === 'banner-gyg' && widget.links) {
      return <MultiLinkBanner label={widget.label} image={widget.image} links={widget.links} />;
  }

  if (type.includes('banner')) {
      return <BannerWidget label={widget.label} url={widget.url} image={widget.image} />;
  }

  if (type === 'button') {
      return <ButtonWidget label={widget.label} subtitle={widget.subtitle} url={widget.url} icon={widget.icon} colorClass={widget.colorClass} />;
  }

  return null;
};

// --- RENDERER BADGE ---
const BadgeRenderer = ({ badge }: { badge?: Badge }) => {
    if (!badge) return null;
    return (
        <div className="badge-container">
            <div className="badge-circle">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={badge.image} alt={badge.label} className="badge-image" />
            </div>
            <div className="badge-label">{badge.label}</div>
        </div>
    );
};

// Generazione Parametri Statici
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// --- MAIN PAGE COMPONENT ---

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white font-sans pb-20">
      
      {/* HEADER IMMAGINE */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image 
          src={article.hero_image} 
          alt={article.hero_title} 
          fill 
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-bold uppercase tracking-widest transition-colors">
            ← Torna al Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {article.hero_title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
            <span className="bg-orange-600 px-3 py-1 rounded-md font-bold text-white">
              {article.read_time}
            </span>
            <span>di <span className="font-bold border-b border-orange-500">{article.author}</span></span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      {/* CONTENUTO ARTICOLO */}
      <div className="max-w-3xl mx-auto px-5 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          
          <p className="text-xl md:text-2xl text-gray-700 font-serif italic mb-10 leading-relaxed border-l-4 border-orange-500 pl-6">
            &quot;{article.intro_text}&quot;
          </p>

          <div className="space-y-12">
            {article.sections.map((section, index) => (
              <section key={index} className="prose prose-lg max-w-none text-gray-600">
                {section.title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 mt-8">
                    {section.title}
                    </h2>
                )}
                
                <div className="leading-relaxed whitespace-pre-line mb-6">
                  {section.content}
                </div>

                {/* 1. RENDER IMMAGINE SEZIONE */}
                {section.image && (
                   <div className="my-8 relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-md">
                     <Image 
                       src={section.image} 
                       alt={section.title || 'Immagine articolo'} 
                       fill 
                       className="object-cover"
                     />
                   </div>
                )}

                {/* 2. RENDER BADGE */}
                <BadgeRenderer badge={section.badge} />

                {/* 3. RENDER WIDGET TECNICO */}
                <WidgetRenderer widget={section.widget} />
                
                {index < article.sections.length - 1 && (
                  <hr className="border-gray-100 my-10" />
                )}
              </section>
            ))}
          </div>

        </div>
      </div>
      
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <Link href="/blog" className="text-orange-600 font-bold hover:underline">
          Vedi tutti gli altri articoli
        </Link>
      </div>

    </article>
  );
}
