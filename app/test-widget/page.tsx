import FlightWidget from '@/components/FlightWidget';

export default function TestWidgetPage() {
  // Questo è l'URL dello script di Tokyo che mi hai dato
  const scriptUrl = "https://tpemb.com/content?currency=eur&trs=476244&shmarker=686826.TOKYO&locale=it&default_destination=TYO&stops=any&show_hotels=true&powered_by=true&border_radius=0&plain=true&color_button=%2300A991&color_button_text=%23ffffff&promo_id=3414&campaign_id=111";

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#2C3E50]">
        Test Componente Voli
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <p className="mb-4 font-bold text-red-500">
          👇 Qui sotto deve apparire il modulo di ricerca voli:
        </p>

        {/* Qui usiamo il componente appena creato */}
        <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-100 rounded-lg">
            <FlightWidget src={scriptUrl} />
        </div>

      </div>
      
      <div className="text-center mt-10">
        <a href="/" className="underline text-blue-600">Torna alla Home</a>
      </div>
    </div>
  );
}