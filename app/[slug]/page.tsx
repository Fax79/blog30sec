import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import articlesData from '@/data/articles.json';
// Importiamo il Widget FlightWidget che funziona già
import FlightWidget from '@/components/FlightWidget';

// --- DEFINIZIONE DEI TIPI ---

type WidgetType = 'script' | 'banner' | 'button';

interface Widget {
  type: string;
  label: string;
  url: string;
  image?: string;     
  subtitle?: string;  
  icon?: string;      
  colorClass?: string; 
}

interface Section {
  title: string;
  content: string;
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

// --- FUNZIONE PER PULIRE IL TESTO (Via gli asterischi!) ---
const BasicMarkdown = ({ content }: { content: string }) => {
  if (!content) return null;
  
  const lines = content.split('\n');

  return (
    <div className="space-y-4 text-gray-600 leading-relaxed">
      {lines.map((line, index) => {
        if (!line.trim()) return null;

        const isList = line.trim().startsWith('* ');
        const cleanText = isList ? line.trim().substring(2) : line;

        const parts = cleanText.split('**');
        const formattedText = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part
        );

        if (isList) {
          return (
            <div key={index} className="flex items-start pl-4">
              <span className="mr-3 text-orange-500 font-bold">•</span>
              <span>{formattedText}</span>
            </div>
          );
        }

        return <p key={index}>{formattedText}</p>;
      })}
    </div>
  );
};

// --- WIDGET COMPONENTS HELPERS ---

const BannerWidget = ({ label, url, image }: { label: string; url: string; image?: string }) => {
  return (
    <div className="my-10 group">
      <Link href={url} target="_blank" className="block relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="relative h-64 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image || ''} 
            alt={label} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Consigliato dall&apos;AI</p>
              <h3 className="text-white text-2xl font-bold">{label} ➜</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
               </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const ButtonWidget = ({ label, subtitle, url, icon, colorClass }: { label: string; subtitle?: string; url: string; icon?: string; colorClass?: string }) => {
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

const WidgetRenderer = ({ widget }: { widget?: Widget | null }) => {
  if (!widget) return null;

  switch (widget.type) {
    case 'script':
      return (
        <div className="my-8 min-h-[200px] bg-gray-50 rounded-xl overflow-hidden">
             <FlightWidget src={widget.url} />
        </div>
      );
    case 'banner':
      return <BannerWidget label={widget.label} url={widget.url} image={widget.image} />;
    case 'button':
      return <ButtonWidget label={widget.label} subtitle={widget.subtitle} url={widget.url} icon={widget.icon} colorClass={widget.colorClass} />;
    default:
      return null;
  }
};

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
      
      {/* HEADER */}
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
          {/* LINK CORRETTO: punta alla root / */}
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-bold uppercase tracking-widest transition-colors">
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

      {/* CONTENUTO */}
      <div className="max-w-3xl mx-auto px-5 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          
          <p className="text-xl md:text-2xl text-gray-700 font-serif italic mb-10 leading-relaxed border-l-4 border-orange-500 pl-6">
            &quot;{article.intro_text}&quot;
          </p>

          <div className="space-y-12">
            {article.sections.map((section, index) => (
              <section key={index} className="prose prose-lg max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                
                {/* QUI USIAMO IL NOSTRO PULITORE DI TESTO */}
                <BasicMarkdown content={section.content} />

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
        {/* LINK CORRETTO: punta alla root / */}
        <Link href="/" className="text-orange-600 font-bold hover:underline">
          Vedi tutti gli altri articoli
        </Link>
      </div>

    </article>
  );
}