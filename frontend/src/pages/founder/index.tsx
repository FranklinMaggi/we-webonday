
import founderImg from "../../assets/founder.png";

export default function ChiSiamo() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      
      {/* HERO FUTURISTICO */}
      <header className="relative text-center py-20 bg-gradient-to-r from-purple-800 via-pink-600 to-blue-700">
        <h1 className="text-5xl md:text-7xl font-extrabold neon-title mb-6">
          🚀 WebOnDay 2025
        </h1>

        <p className="max-w-3xl mx-auto text-xl neon-bubble">
          Proiettati nel futuro , abbiamo percorso il web come pionieri.
          Oggi siamo una realtà <strong>cyber-digitale</strong> che trasforma aziende in leggende.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-20">

        {/* FOUNDER FUTURISTICO */}
        <section className="relative bg-gray-900/70 rounded-3xl shadow-xl p-8 border border-cyan-400 backdrop-blur neon-panel">
          <div className="flex flex-col md:flex-row items-center gap-10">

            <img
              src={founderImg}
              alt="Francesco Maggi Founder WebOnDay"
              className="w-40 h-40 object-cover rounded-full border-4 border-cyan-400 shadow-lg"
            />

            <div>
              <h2 className="text-4xl font-bold text-cyan-300 neon-title mb-2">
                Francesco Maggi
              </h2>

              <h3 className="text-lg font-semibold text-pink-400 mb-4">
                Creator & Cyber-Founder
              </h3>

              <p className="text-gray-300 leading-relaxed neon-bubble">
                ⚡ “Nel 2025, il digitale non è più solo tecnologia: è <strong>coscienza collettiva</strong>.
                WebOnDay non crea solo siti, ma portali verso realtà parallele.”
              </p>
            </div>

          </div>
        </section>

        {/* MISSIONE FUTURISTICA */}
        <section className="bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 rounded-3xl border border-fuchsia-400 shadow-2xl p-10 neon-panel text-center">
          <h2 className="text-4xl font-bold text-yellow-300 neon-title mb-6">
            🌌 La Missione 2026
          </h2>

          <p className="text-lg text-gray-100 neon-bubble">
            Non digitalizziamo più aziende:
            <strong> le proiettiamo nel metaverso.</strong><br />
            Creiamo mondi immersivi dove brand e clienti interagiscono in modo naturale,
            etico e sostenibile.
          </p>
        </section>

        {/* TEAM FUTURISTICO */}
        <section className="grid md:grid-cols-3 gap-8">

          <div className="p-6 bg-gray-900/80 rounded-xl border border-blue-500 shadow-lg neon-panel text-center">
            <p className="text-6xl">🤖</p>
            <h3 className="text-xl font-bold text-blue-300 mt-2">Coders Synth</h3>
            <p className="text-gray-300 neon-bubble">
              Programmiamo con AI quantistica. I nostri codici vivono e respirano.
            </p>
          </div>

          <div className="p-6 bg-gray-900/80 rounded-xl border border-pink-500 shadow-lg neon-panel text-center">
            <p className="text-6xl">🎨</p>
            <h3 className="text-xl font-bold text-pink-300 mt-2">Creativi Olografici</h3>
            <p className="text-gray-300 neon-bubble">
              Design in 5D. Le interfacce non si guardano, si attraversano.
            </p>
          </div>

          <div className="p-6 bg-gray-900/80 rounded-xl border border-cyan-500 shadow-lg neon-panel text-center">
            <p className="text-6xl">📡</p>
            <h3 className="text-xl font-bold text-cyan-300 mt-2">Comunic-AI</h3>
            <p className="text-gray-300 neon-bubble">
              I tuoi messaggi vengono trasmessi in tempo reale in tutta la rete neurale globale.
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}
