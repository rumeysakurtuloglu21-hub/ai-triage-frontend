import { useEffect, useState } from "react";

export default function DoctorDashboard() {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);


  // 📥 HASTA TALEPLERİNİ GETİR
  useEffect(() => {

    const getRequests = async () => {

      try {

        const token = localStorage.getItem("token");


        const response = await fetch(
          `https://ai-triage-mvp-1.onrender.com/doctor/request/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const data = await response.json();


        setRequests(data.data || data);


      } catch (err) {

        console.log(err);

        alert("Hasta verileri alınamadı");

      } finally {

        setLoading(false);

      }

    };


    getRequests();


  }, []);



  // ✅ ONAY / RED
  const updateStatus = async (id, status) => {


    try {


      const token =
        localStorage.getItem("token");


      const response = await fetch(
        `http://localhost:8000/doctor/request/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );


      if (!response.ok) {
        throw new Error();
      }



      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
              }
            : r
        )
      );


    } catch (err) {

      console.log(err);

      alert("Durum güncellenemedi");

    }

  };



  if (loading) {

    return (

      <div className="docPage">

        <div className="docHero">

          <h1>
            🩺 DOKTOR PANELİ
          </h1>

          <p>
            Yükleniyor...
          </p>

        </div>

      </div>

    );

  }



  return (

    <div className="docPage">


      {/* HEADER */}

      <div className="docHero">

        <h1>
          🩺 DOKTOR PANELİ
        </h1>

        <p>
          Hasta reçete talepleri ve klinik yönetim
        </p>

      </div>



      {/* STATS */}

      <div className="docStats">


        <div className="docStatCard">

          <h3>
            {requests.length}
          </h3>

          <p>
            Toplam Talep
          </p>

        </div>



        <div className="docStatCard">

          <h3>
            {
              requests.filter(
                r => r.status === "pending"
              ).length
            }
          </h3>

          <p>
            Bekleyen
          </p>

        </div>



        <div className="docStatCard">

          <h3>
            {
              requests.filter(
                r => r.status === "approved"
              ).length
            }
          </h3>

          <p>
            Onaylanan
          </p>

        </div>


      </div>





      {/* LIST */}

      <div className="docGrid">


        {requests.map((r) => (


          <div
            key={r.id}
            className="docCard"
          >


            {/* TOP */}

            <div className="docTop">


              <h3>
                {r.patient}
              </h3>



              <span
                className={`risk ${r.risk}`}
              >

                {r.risk?.toUpperCase()}

              </span>


            </div>





            {/* INFO */}

            <div className="docInfo">


              <p>
                Yaş: {r.age}
              </p>


              <p>
                Tanı: {r.condition}
              </p>


              <p>
                İlaç: {r.meds}
              </p>


            </div>





            {/* STATUS */}

            <div
              className={`status ${r.status}`}
            >

              {r.status === "pending" &&
                "⏳ Bekliyor"
              }


              {r.status === "approved" &&
                "✅ Onaylandı"
              }


              {r.status === "rejected" &&
                "❌ Reddedildi"
              }


            </div>





            {/* ACTIONS */}


            {r.status === "pending" && (


              <div className="docActions">


                <button

                  className="approve"

                  onClick={() =>
                    updateStatus(
                      r.id,
                      "approved"
                    )
                  }

                >

                  Onayla

                </button>





                <button

                  className="reject"

                  onClick={() =>
                    updateStatus(
                      r.id,
                      "rejected"
                    )
                  }

                >

                  Reddet

                </button>


              </div>


            )}



          </div>


        ))}


      </div>


    </div>

  );

}
