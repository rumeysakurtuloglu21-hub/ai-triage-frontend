import { useEffect, useState } from "react";

export default function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const getHistory = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const response = await fetch(
          "http://localhost:8000/triage/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const data =
          await response.json();


        setHistory(data.data || data);


      } catch(err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };


    getHistory();

  }, []);



  const riskColor = (risk) => {

    if (risk === "YÜKSEK")
      return "red";

    if (risk === "ORTA")
      return "orange";

    return "green";

  };



  return (

    <div className="main">

      <h2>📊 Triaj Geçmişi</h2>


      {loading && (
        <div className="card">
          Yükleniyor...
        </div>
      )}



      {!loading && history.length === 0 && (

        <div className="card">

          <p>
            Henüz kayıt yok
          </p>

        </div>

      )}



      <div className="historyGrid">

        {history.map((item, index) => (

          <div
            key={index}
            className={`card ${riskColor(item.aciliyet)}`}
          >

            <h3>
              {item.aciliyet_emoji} {item.aciliyet}
            </h3>


            <p>
              <b>Bölüm:</b> {item.bolum}
            </p>


            <p>
              {item.aciklama}
            </p>


            <small>
              ⚠️ {item.uyari}
            </small>


          </div>

        ))}

      </div>


    </div>

  );

}