import { useEffect, useState } from "react";

export default function Profile() {
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    blood: "",
    gender: "",
    chronic: "",
    meds: "",
    surgeries: ""
  });

  useEffect(() => {

  const getProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ai-triage-mvp-1.onrender.com/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) return;


      const data = await response.json();

      setForm(data.data || data);


    } catch(err) {

      console.log(err);

    }

  };


  getProfile();

}, []);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setGender = (value) => {
    setForm({ ...form, gender: value });
  };

  const save = async () => {

  try {

    const token = localStorage.getItem("token");


    const response = await fetch(
      "http://localhost:8000/profile",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
        },
        body:JSON.stringify(form),
      }
    );


    const data = await response.json();


    if(response.ok){
      alert("Profil kaydedildi");
    }
    else{
      alert(data.message || "Kayıt başarısız");
    }


  } catch(err){

    console.log(err);
    alert("Backend bağlantısı yok");

  }

};

  return (
    <div className="profilePage">

      {/* HEADER */}
      <div className="profileHero">

        <div className="heroLeft">

          <div className="avatar">👤</div>

          <div>
            <h1>Hasta Profili</h1>
            <p>AI triaj sistemi için sağlık verilerini yönet</p>
          </div>

        </div>

        <button className="saveBtn" onClick={save}>
          Kaydet
        </button>

      </div>

      <div className="profileGrid">

        {/* MAIN */}
        <div className="mainCard">

          <div className="sectionTitle">Temel Bilgiler</div>

          <div className="inputGrid">

            <div className="inputBox">
              <label>Yaş</label>
              <input name="age" value={form.age} onChange={update} placeholder="22" />
            </div>

            <div className="inputBox">
              <label>Boy</label>
              <input name="height" value={form.height} onChange={update} placeholder="180 cm" />
            </div>

            <div className="inputBox">
              <label>Kilo</label>
              <input name="weight" value={form.weight} onChange={update} placeholder="74 kg" />
            </div>

            <div className="inputBox">
              <label>Kan Grubu</label>
              <input name="blood" value={form.blood} onChange={update} placeholder="0 Rh+" />
            </div>

            <div className="inputBox full">
              <label>Cinsiyet</label>

              <div className="genderSwitch">

                <button
                  type="button"
                  className={form.gender === "Erkek" ? "active" : ""}
                  onClick={() => setGender("Erkek")}
                >
                  Erkek
                </button>

                <button
                  type="button"
                  className={form.gender === "Kadın" ? "active" : ""}
                  onClick={() => setGender("Kadın")}
                >
                  Kadın
                </button>

              </div>

            </div>

          </div>

          <div className="sectionTitle second">Medikal Geçmiş</div>

          <div className="textareaGroup">

            <div className="inputBox">
              <label>Kronik hastalıklar</label>
              <textarea
                name="chronic"
                value={form.chronic}
                onChange={update}
                placeholder="Örn: diyabet, hipertansiyon"
              />
            </div>

            <div className="inputBox">
              <label>Kullanılan ilaçlar</label>
              <textarea
                name="meds"
                value={form.meds}
                onChange={update}
                placeholder="Örn: metformin, aspirin"
              />
            </div>

            <div className="inputBox">
              <label>Geçmiş operasyonlar</label>
              <textarea
                name="surgeries"
                value={form.surgeries}
                onChange={update}
                placeholder="Örn: apandisit ameliyatı 2019"
              />
            </div>

          </div>

        </div>

        {/* SIDE */}
        <div className="sidePanel">

          <div className="sideCard">

            <div className="statusDot"></div>

            <h3>AI Triaj Aktif</h3>

            <p>
              Verileriniz semptom analizi ve aciliyet değerlendirmesi için işlenir.
            </p>

          </div>

          <div className="miniCard">
            <span>⚡ Risk Analizi</span>
            <p>Geçmiş + mevcut semptomlar</p>
          </div>

          <div className="miniCard">
            <span>💊 İlaç Etkileşimi</span>
            <p>Otomatik kontrol sistemi</p>
          </div>

          <div className="miniCard">
            <span>🧠 AI Değerlendirme</span>
            <p>Kişisel sağlık profili optimizasyonu</p>
          </div>

        </div>

      </div>

    </div>
  );
}
