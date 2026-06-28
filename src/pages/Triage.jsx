import { useRef, useState } from "react";

export default function Triage() {
  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // 🎤 VOICE INPUT
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tarayıcı ses desteği yok");
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.start();
    setListening(true);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSymptom(text);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  // 🧠 API CALL
const analyze = async () => {
  if (!symptom.trim()) {
    alert("Lütfen semptomunuzu giriniz.");
    return;
  }

  setLoading(true);
  setResult(null);

  try {
    const response = await fetch("https://ai-triage-mvp-1.onrender.com/triage", {
      // Backend adresi belli olunca burayı değiştir
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        semptomlar: symptom,
        duration,
        severity,
      }),
    });

    if (!response.ok) {
      throw new Error("Sunucu hatası");
    }

    const data = await response.json();

    // Backend'den gelen format:
    // {
    //   success: true,
    //   data: {
    //     aciliyet,
    //     aciliyet_emoji,
    //     bolum,
    //     aciklama,
    //     uyari
    //   }
    // }

    if (data.success) {
      setResult(data.data);
    } else {
      alert("Analiz başarısız.");
    }
  } catch (err) {
    console.error("API Error:", err);
    alert("AI sistemine bağlanılamadı.");
  } finally {
    setLoading(false);
  }
};

  // 🌐 MHRS
  const openMHRS = () => {
    window.open("https://www.mhrs.gov.tr", "_blank");
  };

  // 🎨 RISK COLOR
  const riskColor =
    result?.aciliyet === "YÜKSEK"
      ? "red"
      : result?.aciliyet === "ORTA"
      ? "orange"
      : "green";

  return (
    <div className={`triageWrap ${riskColor}`}>

      {/* LEFT PANEL */}
      <div className="triageLeft">

        <div className="heroAI">
          <span className="tag">AI TRIAGE SYSTEM</span>

          <h1>Akıllı Acil Değerlendirme</h1>

          <p>
            Semptomunu yaz veya sesli söyle,
            sistem risk seviyeni analiz etsin.
          </p>
        </div>

        {/* INPUT */}
        <div className="inputBox">

          <textarea
            placeholder="Örn: Başım ağrıyor, ateşim var..."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />

          <button
            className={`mic ${listening ? "active" : ""}`}
            onClick={startVoice}
          >
            {listening ? "🔴 Dinleniyor..." : "🎤 Sesle Söyle"}
          </button>

        </div>

        {/* OPTIONS */}
        <div className="smartOptions">

          {/* DURATION */}
          <div className="optionCard">
            <span className="optionLabel">⏳ Ne zamandır var?</span>

            <div className="optionButtons">
              {["1 saat", "1 gün", "3 gün", "1 hafta+"].map((item) => (
                <button
                  key={item}
                  className={duration === item ? "optionBtn active" : "optionBtn"}
                  onClick={() => setDuration(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* SEVERITY */}
          <div className="optionCard">
            <span className="optionLabel">⚡ Şiddet</span>

            <div className="optionButtons">
              {["Hafif", "Orta", "Şiddetli"].map((item) => (
                <button
                  key={item}
                  className={severity === item ? "optionBtn active" : "optionBtn"}
                  onClick={() => setSeverity(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ANALYZE BUTTON */}
        <button className="analyzeBtn" onClick={analyze}>
          {loading ? "AI ANALİZ EDİYOR..." : "AI ANALİZ BAŞLAT"}
        </button>

        {/* RESULT */}
        {result && (
          <div className={`resultCard ${riskColor}`}>

            <h2>
              {result.aciliyet_emoji} {result.aciliyet}
            </h2>

            <div className="resultSection">
              <span>Bölüm</span>
              <p>{result.bolum}</p>
            </div>

            <div className="resultSection">
              <span>Açıklama</span>
              <p>{result.aciklama}</p>
            </div>

            <div className="warningBox">
              ⚠️ {result.uyari}
            </div>

            {(result.aciliyet === "ORTA" ||
              result.aciliyet === "YÜKSEK") && (
              <button className="mhrsBtn" onClick={openMHRS}>
                MHRS Randevu Al
              </button>
            )}

          </div>
        )}

      </div>

      {/* RIGHT PANEL */}
      <div className="triageRight">

        <div className="aiPanel">
          <h2>🧠 AI Medical Engine</h2>
          <p>
            Sistem semptomları analiz eder ve risk seviyesini belirler.
          </p>
        </div>

        <div className="infoPanel">
          <h3>⚡ Risk Seviyeleri</h3>

          <div className="legend">
            <div>🟢 Düşük: Evde bakım</div>
            <div>🟡 Orta: Doktor kontrolü</div>
            <div>🔴 Yüksek: Acil müdahale</div>
          </div>
        </div>

      </div>

    </div>
  );
}
