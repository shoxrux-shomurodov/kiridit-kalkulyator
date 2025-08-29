import React, { useState } from "react";

function App() {
  const [summa, setSumma] = useState(1000000);
  const [muddat, setMuddat] = useState(12);
  const [yillikFoiz, setYillikFoiz] = useState(24);
  const [hisobTuri, setHisobTuri] = useState("annuitet");
  const [lgotaOy, setLgotaOy] = useState(3);
  const [jadval, setJadval] = useState([]);
  const [jamiTolov, setJamiTolov] = useState(0);
  const [faqatFoiz, setFaqatFoiz] = useState(0);

  const annuitetOy = (asosiy, oyStavka, oylar) => {
    if (oylar <= 0) return 0;
    const x = Math.pow(1 + oyStavka, oylar);
    return (asosiy * oyStavka * x) / (x - 1);
  };

  const formatNumber = (num) => {
    return Math.round(num).toLocaleString("ru-RU").replace(/,/g, " ");
  };

  const hisobla = () => {
    if (!summa || !muddat || muddat <= 0) return;

    let qoldiq = Number(summa);
    const r = Number(yillikFoiz) / 100 / 12;
    const g = Math.min(Math.max(0, Number(lgotaOy) || 0), Number(muddat));

    const rows = [];
    let totalPayment = 0;
    let totalInterest = 0;

    if (hisobTuri === "annuitet") {
      for (let i = 1; i <= g; i++) {
        const foiz = qoldiq * r;
        totalPayment += foiz;
        totalInterest += foiz;
        rows.push({ oy: i, foiz, asosiy: 0, jami: foiz, qoldiq });
      }

      const qolgani = Number(muddat) - g;
      const A = annuitetOy(qoldiq, r, qolgani);

      for (let j = 1; j <= qolgani; j++) {
        const foiz = qoldiq * r;
        const asosiy = A - foiz;
        const jami = A;
        qoldiq = Math.max(0, qoldiq - asosiy);

        totalPayment += jami;
        totalInterest += foiz;

        rows.push({ oy: g + j, foiz, asosiy, jami, qoldiq });
      }
    } else {
      const qolgani = Number(muddat) - g;
      const asosiyQism = qolgani > 0 ? Number(summa) / qolgani : 0;

      for (let i = 1; i <= Number(muddat); i++) {
        const foiz = qoldiq * r;
        const asosiy = i > g ? asosiyQism : 0;
        const jami = foiz + asosiy;
        qoldiq = Math.max(0, qoldiq - asosiy);

        totalPayment += jami;
        totalInterest += foiz;

        rows.push({ oy: i, foiz, asosiy, jami, qoldiq });
      }
    }

    setJadval(
      rows.map((r) => ({
        ...r,
        foiz: formatNumber(r.foiz),
        asosiy: formatNumber(r.asosiy),
        jami: formatNumber(r.jami),
        qoldiq: formatNumber(r.qoldiq),
      }))
    );
    setJamiTolov(formatNumber(totalPayment));
    setFaqatFoiz(formatNumber(totalInterest));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">
          💳 Kredit Kalkulyator
        </h1>

        {/* Forma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Kredit summasi</label>
            <input
              type="number"
              value={summa}
              onChange={(e) => setSumma(+e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Muddat (oy)</label>
            <input
              type="number"
              value={muddat}
              onChange={(e) => setMuddat(+e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Yillik foiz (%)</label>
            <input
              type="number"
              value={yillikFoiz}
              onChange={(e) => setYillikFoiz(+e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base"
              min={0}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hisoblash turi</label>
            <select
              value={hisobTuri}
              onChange={(e) => setHisobTuri(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base"
            >
              <option value="annuitet">Annuitet</option>
              <option value="differensial">Differensial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Legota oy</label>
            <input
              type="number"
              value={lgotaOy}
              onChange={(e) => setLgotaOy(+e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm sm:text-base"
              min={0}
              max={muddat}
            />
          </div>
        </div>

        <button
          onClick={hisobla}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Hisoblash
        </button>

        {jadval.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-col gap-2 mb-4 bg-blue-50 p-4 rounded-lg text-sm sm:text-base">
              <p className="text-green-700 font-semibold">
                Olingan kredit: {formatNumber(summa)} so‘m
              </p>
              <p className="text-blue-800 font-semibold">
                Jami to‘lov: {jamiTolov} so‘m
              </p>
              <p className="text-red-600 font-semibold">
                Jami foiz: {faqatFoiz} so‘m
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border text-xs sm:text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="border px-2 sm:px-3 py-2">Oy</th>
                    <th className="border px-2 sm:px-3 py-2">Foiz</th>
                    <th className="border px-2 sm:px-3 py-2">Asosiy</th>
                    <th className="border px-2 sm:px-3 py-2">Jami</th>
                    <th className="border px-2 sm:px-3 py-2">Qoldiq</th>
                  </tr>
                </thead>
                <tbody>
                  {jadval.map((row) => (
                    <tr
                      key={row.oy}
                      className="text-center even:bg-gray-50 hover:bg-purple-50 transition"
                    >
                      <td className="border px-2 sm:px-3 py-1 font-semibold text-gray-700">
                        {row.oy}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 text-red-600">
                        {row.foiz}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 text-green-600">
                        {row.asosiy}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 font-semibold text-blue-700">
                        {row.jami}
                      </td>
                      <td className="border px-2 sm:px-3 py-1 text-gray-700">
                        {row.qoldiq}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
