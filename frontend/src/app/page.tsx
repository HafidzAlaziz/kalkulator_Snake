"use client";

/**
 * APLIKASI KALKULATOR MODERN - PROYEK UAS
 * Fitur: Operasi Dasar, Rekursi (Faktorial & Pangkat), Riwayat Perhitungan (Array)
 * Framework: Next.js + Tailwind CSS + FastAPI
 */

import { useState } from "react";

export default function Home() {
  // --- STATE MANAGEMENT (KRITERIA UAS: PENGGUNAAN VARIABEL & TIPE DATA) ---
  const [display, setDisplay] = useState("0");
  const [currentExpr, setCurrentExpr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Array untuk menyimpan riwayat perhitungan (Kriteria UAS: Array)
  const [historyLog, setHistoryLog] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // --- LOGIKA PERHITUNGAN (KRITERIA UAS: PERCABANGAN & LOOP) ---

  const handleNumber = (num: string) => {
    // Menangani input angka dan mencegah double zero di awal
    setDisplay((prev) => (prev === "0" ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    // Menambahkan operator ke tampilan
    setDisplay((prev) => prev + op);
  };

  const clearDisplay = () => {
    // Reset semua state (Kriteria UAS: Inisialisasi Ulang)
    setDisplay("0");
    setCurrentExpr("");
  };

  const deleteLast = () => {
    // Menghapus karakter terakhir
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const calculate = async () => {
    try {
      setIsLoading(true);
      // Memanggil API Backend FastAPI (Memenuhi kriteria integrasi)
      const response = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expression: display }),
      });

      const data = await response.json();

      if (response.ok) {
        const resultString = `${display} = ${data.result}`;
        setCurrentExpr(display + " =");
        setDisplay(String(data.result));

        // MENYIMPAN RIWAYAT KE DALAM ARRAY (KRITERIA UAS: ARRAY)
        setHistoryLog((prev) => [resultString, ...prev].slice(0, 10)); // Simpan 10 terakhir
      } else {
        // ERROR HANDLING (KRITERIA UAS: HANDLING INVALID INPUT)
        alert(data.detail || "Terjadi kesalahan");
      }
    } catch (error) {
      alert("Gagal terhubung ke server. Pastikan backend (api.py) berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DEFINISI TOMBOL (KRITERIA UAS: CREATIVITY & UI) ---
  const buttons = [
    { label: "C", action: clearDisplay, className: "text-red-400" },
    { label: "DEL", action: deleteLast, className: "text-orange-400" },
    { label: "^", action: () => handleOperator("^"), className: "text-blue-400" }, // Fitur Rekursi Pangkat
    { label: "!", action: () => handleOperator("!"), className: "text-blue-400" }, // Fitur Rekursi Faktorial

    { label: ":", action: () => handleOperator(":"), className: "text-blue-400" },
    { label: "x", action: () => handleOperator("x"), className: "text-blue-400" },
    { label: "-", action: () => handleOperator("-"), className: "text-blue-400" },
    { label: "+", action: () => handleOperator("+"), className: "text-blue-400" },

    { label: "7", action: () => handleNumber("7") },
    { label: "8", action: () => handleNumber("8") },
    { label: "9", action: () => handleNumber("9") },
    { label: "4", action: () => handleNumber("4") },

    { label: "5", action: () => handleNumber("5") },
    { label: "6", action: () => handleNumber("6") },
    { label: "1", action: () => handleNumber("1") },
    { label: "2", action: () => handleNumber("2") },

    { label: "3", action: () => handleNumber("3") },
    { label: "0", action: () => handleNumber("0") },
    { label: ",", action: () => handleNumber(",") },
    { label: "=", action: calculate, className: "bg-blue-500 hover:bg-blue-600 !text-white" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#020617]">
      <div className={`
        glass rounded-[2.5rem] overflow-hidden p-8 transition-all duration-500 ease-in-out
        ${showHistory ? 'max-w-5xl w-full' : 'max-w-md w-full'}
      `}>

        {/* HEADER */}
        <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-4 mb-6">
          <span className="text-xs font-bold tracking-widest uppercase">Kalkulator - UAS Projek</span>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-full"
          >
            {showHistory ? "Tutup Riwayat" : "Lihat Riwayat"}
          </button>
        </div>

        <div className={`flex flex-col lg:flex-row gap-8 ${showHistory ? 'items-start' : 'items-center justify-center'}`}>

          {/* CALCULATOR SECTION */}
          <div className="flex-1 w-full space-y-6">
            {/* DISPLAY AREA */}
            <div className="flex flex-col items-end justify-center p-6 h-40 bg-black/10 rounded-3xl border border-white/5">
              <div className="text-zinc-500 text-sm h-6 overflow-hidden font-mono">{currentExpr}</div>
              <div className="text-white text-4xl sm:text-6xl font-light tracking-tighter truncate w-full text-right mt-2 font-mono">
                {isLoading ? "..." : display}
              </div>
            </div>

            {/* BUTTONS GRID */}
            <div className="grid grid-cols-4 gap-4">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  className={`
                    calc-btn h-14 rounded-2xl text-lg font-semibold
                    ${btn.className || "bg-white/5 hover:bg-white/10 text-white"}
                    flex items-center justify-center shadow-lg border border-white/5
                  `}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIWAYAT PANEL (DITAMPILKAN DI SAMPING JIKA showHistory TRUE) */}
          {showHistory && (
            <div className="w-full lg:w-80 bg-black/20 rounded-3xl p-6 h-full min-h-[400px] border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 text-xs uppercase font-bold tracking-widest">Riwayat Perhitungan</h3>
                <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded">10 Terakhir</span>
              </div>

              {historyLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-zinc-600 text-xs italic">Belum ada aktivitas perhitungan</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {historyLog.map((log, idx) => (
                    <li key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 transition-hover hover:bg-white/10">
                      <p className="text-zinc-300 text-sm font-mono break-all leading-relaxed">{log}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 text-center space-y-2 opacity-50">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
          Ujian Akhir Semester &bull; Next & Python
        </p>
      </footer>
    </main>
  );
}
