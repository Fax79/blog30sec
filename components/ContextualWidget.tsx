import React from 'react';

interface WidgetProps {
  type: 'tiqets' | 'kiwi' | 'hotel';
  label: string;
  link: string;
  image?: string;
}

const ContextualWidget = ({ type, label, link, image }: WidgetProps) => {
  return (
    <div className="my-8 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {image && (
          <div className="w-full md:w-1/3 h-32 relative rounded-lg overflow-hidden bg-gray-100">
             {/* Per semplicità usiamo img standard */}
             <img src={image} alt={label} className="object-cover w-full h-full" />
             <div className="absolute top-2 left-2 bg-[#E67E22] text-white text-xs font-bold px-2 py-1 rounded">
               CONSIGLIATO
             </div>
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{label}</h3>
          <p className="text-sm text-gray-500 mb-3">
            {type === 'tiqets' && "Prenota online ed evita la fila alla biglietteria."}
            {type === 'kiwi' && "Trova i voli più economici per questa destinazione."}
            {type === 'hotel' && "Migliori offerte hotel in zona."}
          </p>
          <a href={link} target="_blank" rel="noreferrer" className="inline-block bg-[#2C3E50] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#E67E22] transition-colors">
            Verifica Prezzi ➜
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContextualWidget;