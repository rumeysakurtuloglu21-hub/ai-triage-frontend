import { useEffect, useState } from "react";

export default function Medication() {

  const [name, setName] = useState("");

  const [type, setType] =
    useState("continuous");

  const [days, setDays] =
    useState(7);

  const [doses, setDoses] =
    useState(3);

  // ⏰ HER DOZ İÇİN SAAT
  const [times, setTimes] =
    useState(["09:00", "13:00", "20:00"]);

  const [list, setList] =
    useState([]);

  const today =
    new Date().toLocaleDateString("tr-TR");

  // 🔔 NOTIFICATION
  useEffect(() => {

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }


  const getMedicines = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/medications",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const data = await response.json();

      setList(data.data || data);


    } catch(err){

      console.log(err);

    }

  };


  getMedicines();


}, []);

  // ⏰ DOSE SAYISI DEĞİŞİNCE SAAT ARRAYİNİ AYARLA
  useEffect(() => {

    setTimes((prev) => {

      const arr = [...prev];

      while (arr.length < doses) {
        arr.push("09:00");
      }

      return arr.slice(0, doses);
    });

  }, [doses]);

  // 🔔 BİLDİRİM KONTROL
  useEffect(() => {

    const interval = setInterval(() => {

      const current =
        new Date()
          .toTimeString()
          .slice(0, 5);

      list.forEach((m) => {

        m.times.forEach((t) => {

          if (
            t === current &&
            Notification.permission ===
              "granted"
          ) {

            new Notification(
              "💊 İlaç Hatırlatma",
              {
                body:
                  `${m.name} ilacını alma zamanı`,
              }
            );
          }
        });
      });

    }, 60000);

    return () =>
      clearInterval(interval);

  }, [list]);

  // ➕ ADD
  const addMed = async () => {

  if (!name.trim()) return;


  const medicine = {

    name,

    type,

    totalDays:
      type === "short"
      ? Number(days)
      : null,

    doses,

    times,

  };


  try {

    const token =
      localStorage.getItem("token");


    const response = await fetch(
      "https://ai-triage-mvp-1.onrender.com/triage/medications",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(medicine)
      }
    );


    const data =
      await response.json();


    setList(prev => [
      ...prev,
      data.data || data
    ]);


    setName("");

  }
  catch(err){

    console.log(err);
    alert("İlaç kaydedilemedi");

  }

};

  // ✔ DOZ
  // ✔ DOZ
const toggleDose = async (id, index) => {

  try {

    const token = localStorage.getItem("token");


    const response = await fetch(
      `http://localhost:8000/medications/${id}/dose`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dose: index,
        }),
      }
    );


    if (!response.ok) {
      throw new Error("Doz güncellenemedi");
    }


    // backend başarılıysa ekrandaki listeyi güncelle
    setList((prev) =>

      prev.map((m) => {

        if (m.id !== id) return m;


        const todayLog =
          m.log?.[today] ||
          Array(m.doses).fill(false);


        const updated =
          [...todayLog];


        updated[index] =
          !updated[index];


        return {

          ...m,

          log: {
            ...(m.log || {}),
            [today]: updated,
          },

        };

      })

    );


  } catch (err) {

    console.log(err);
    alert("Doz kaydedilemedi");

  }

};

       

  // ⏰ SAAT GÜNCELLE
  const updateTime = (
    index,
    value
  ) => {

    const updated =
      [...times];

    updated[index] = value;

    setTimes(updated);
  };

  const getTaken = (arr) =>
    arr.filter(Boolean).length;

  return (

    <div className="medPage">

      {/* HERO */}
      <div className="medHero">

        <h1>
          💊 İLAÇ TAKİP MERKEZİ
        </h1>

        <p>
          Günlük tedavi ve doz kontrol sistemi
        </p>

      </div>

      {/* PANEL */}
      <div className="medPanel">

        <input
          className="medInput"
          placeholder="İlaç adı"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        {/* TYPE */}
        <div className="segmented">

          <button
            className={
              type === "continuous"
                ? "active"
                : ""
            }
            onClick={() =>
              setType("continuous")
            }
          >
            Sürekli
          </button>

          <button
            className={
              type === "short"
                ? "active"
                : ""
            }
            onClick={() =>
              setType("short")
            }
          >
            Kısa
          </button>

        </div>

        {/* DAYS */}
        {type === "short" && (

          <input
            className="medInput"
            type="number"
            value={days}
            onChange={(e) =>
              setDays(e.target.value)
            }
            placeholder="Kaç gün?"
          />

        )}

        {/* DOSE */}
        <div className="doseControl">

          <button
            onClick={() =>
              setDoses((d) =>
                Math.max(1, d - 1)
              )
            }
          >
            −
          </button>

          <span>
            {doses} DOZ
          </span>

          <button
            onClick={() =>
              setDoses((d) => d + 1)
            }
          >
            +
          </button>

        </div>

        {/* ⏰ TIME INPUTS */}
        <div className="timeList">

          {times.map((t, i) => (

            <div
              key={i}
              className="timePicker"
            >

              <label>
                ⏰ Doz {i + 1} Saati
              </label>

              <input
                type="time"
                value={t}
                onChange={(e) =>
                  updateTime(
                    i,
                    e.target.value
                  )
                }
              />

            </div>
          ))}

        </div>

        <button
          className="addBtn"
          onClick={addMed}
        >
          Ekle
        </button>

      </div>

      {/* GRID */}
      <div className="medGrid">

        {list.map((m) => {

          const todayLog =
            m.log[today] ||
            Array(m.doses).fill(false);

          const taken =
            getTaken(todayLog);

          return (

            <div
              key={m.id}
              className="medCard"
            >

              {/* TOP */}
              <div className="medTop">

                <h3>{m.name}</h3>

                <span className="tag">

                  {m.type === "short"
                    ? `${m.totalDays} gün`
                    : "Sürekli"}

                </span>

              </div>

              {/* META */}
              <div className="metaBar">

                <span>
                  📅 {today}
                </span>

                <span>
                  {taken}/{m.doses} doz
                </span>

              </div>

              {/* SAATLER */}
              <div className="timeBadges">

                {m.times.map(
                  (t, i) => (

                    <div
                      key={i}
                      className="timeBadge"
                    >
                      ⏰ {t}
                    </div>
                  )
                )}

              </div>

              {/* DOSE */}
              <div className="doseRow">

                {todayLog.map(
                  (v, i) => (

                    <button
                      key={i}
                      className={`doseChip ${
                        v ? "active" : ""
                      }`}
                      onClick={() =>
                        toggleDose(
                          m.id,
                          i
                        )
                      }
                    >

                      {v
                        ? "✔ DOZ " +
                          (i + 1)
                        : "DOZ " +
                          (i + 1)}

                    </button>
                  )
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
