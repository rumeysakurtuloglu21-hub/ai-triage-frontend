import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrescriptionRequest from "./PrescriptionRequest";

export default function Dashboard() {

  const nav = useNavigate();

  const [activeApp, setActiveApp] = useState(null);

  const [user, setUser] = useState({});

  const [profile, setProfile] = useState(null);



  // 👤 KULLANICI + PROFİL GETİR
  useEffect(() => {


    const getData = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const userData =
          JSON.parse(localStorage.getItem("user")) || {};


        setUser(userData);



        const response = await fetch(
          "http://localhost:8000/profile",
          {
            headers:{
              Authorization:
              `Bearer ${token}`
            }
          }
        );


        const data =
          await response.json();


        if(response.ok){

          setProfile(
            data.data || data
          );

        }


      } catch(err){

        console.log(err);

      }

    };


    getData();


  }, []);




  const toggleTheme = (e) => {

    if (e.target.checked) {

      document.body.classList.add("light");

    } else {

      document.body.classList.remove("light");

    }

  };



  return (

    <div className="dashboard">


      {/* SIDEBAR */}

      <aside className="sidebar">


        <div>

          <div className="logo">
            🏥 AI TRIAGE
          </div>



          <div className="userCard">


            <div className="avatar">

              {
                user?.kullanici?.charAt(0)
                ||
                "A"
              }

            </div>



            <div>

              <h3>
                {
                  user?.kullanici
                  ||
                  "Kullanıcı"
                }
              </h3>


              <p>

                {
                  user?.rol === "doktor"
                  ?
                  "Doktor Paneli"
                  :
                  "Hasta Paneli"
                }

              </p>


            </div>


          </div>





          <nav className="menu">


            <button onClick={()=>nav("/dashboard")}>
              🏠 Dashboard
            </button>


            <button onClick={()=>nav("/triage")}>
              ⚡ AI Triaj
            </button>


            <button onClick={()=>nav("/profile")}>
              👤 Profil
            </button>


            <button
              onClick={()=>setActiveApp("prescription")}
            >
              💊 İlaç Talebi
            </button>


            <button onClick={()=>nav("/medication")}>
              🕒 İlaç Takibi
            </button>


            <button onClick={()=>nav("/history")}>
              📊 Geçmiş
            </button>


          </nav>


        </div>




        <div className="systemStatus">

          <span className="statusDot"></span>

          Sistem Aktif

        </div>


      </aside>





      {/* MAIN */}

      <main className="main">





        {!profile && (

          <div className="profileWarning">


            <div className="warningLeft">


              <div className="warningIcon">
                ⚠️
              </div>


              <div>

                <h3>
                  Profil Bilgileri Eksik
                </h3>


                <p>
                  Daha doğru AI triaj analizi için sağlık bilgilerini eklemelisin.
                </p>

              </div>


            </div>



            <button
              className="warningBtn"
              onClick={()=>nav("/profile")}
            >
              Profili Tamamla
            </button>


          </div>

        )}






        <div className="topbar">


          <div>

            <h1>

              Hoş geldin,{" "}

              {
                user?.kullanici
                ||
                "Kullanıcı"
              }

            </h1>


            <p>
              AI destekli dijital sağlık sistemi
            </p>


          </div>





          <div className="themeArea">


            <span className="themeText">
              Tema
            </span>



            <label className="themeSwitch">


              <input
                type="checkbox"
                onChange={toggleTheme}
              />


              <span className="slider"></span>


            </label>


          </div>


        </div>





        <section className="hero">


          <div className="heroContent">


            <div className="heroBadge">

              AI TRIAGE ENGINE • ONLINE

            </div>



            <h2>
              Kronik İlaçlarını Online Yenile
            </h2>



            <p>

              Hastaneye gitmeden kronik ilaç talebi oluştur.
              Aile hekimi onaylasın.

            </p>




            <div className="heroButtons">


              <button
                className="primaryBtn"
                onClick={()=>nav("/triage")}
              >

                ⚡ Triaj Başlat

              </button>


            </div>


          </div>





          <div className="heroVisual">

            <div className="pulse">

              <div className="pulseInner">
                AI
              </div>

            </div>


          </div>


        </section>






        <section className="contentGrid">



          <div className="mainCard">


            <div className="cardTop">

              <h3>
                💊 Kronik İlaç Yenileme
              </h3>

              <span className="liveBadge">
                CANLI
              </span>


            </div>



            <p>
              Kronik ilaç reçeteni aile hekimine dijital gönder.
            </p>




            <button

              className="fullBtn"

              onClick={()=>setActiveApp("prescription")}

            >

              Talep Oluştur

            </button>



          </div>





          <div className="sideCards">


            <div className="miniCard doctorCard">


              <h3>
                👨‍⚕️ Aile Hekimi
              </h3>


              <div className="doctorOnline">

                <span className="doctorDot"></span>

                Aktif & Çevrimiçi

              </div>


            </div>





            <div className="miniCard">


              <h3>
                📊 Sistem Durumu
              </h3>


              <p>
                TRIAGE ENGINE v2.4
              </p>


              <p>
                AI Modülü Çalışıyor
              </p>



              <div className="doctorOnline">

                <span className="doctorDot"></span>

                Stabil

              </div>



            </div>


          </div>



        </section>



      </main>





      {activeApp==="prescription" && (

        <div className="app-modal">


          <div className="app-modal-content">


            <button
              className="closeBtn"
              onClick={()=>setActiveApp(null)}
            >

              ✕ Kapat

            </button>



            <PrescriptionRequest />


          </div>


        </div>

      )}



    </div>

  );

}