import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const nav = useNavigate();

  const [form, setForm] = useState({
    kullanici: "",
    sifre: "",
    rol: "hasta",
  });

  const giris = async () => {

  if (!form.kullanici || !form.sifre) {
    alert("Bilgileri doldur");
    return;
  }

  try {

    const response = await fetch(
      "https://ai-triage-mvp-1.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {
      alert("Giriş başarısız");
      return;
    }


    localStorage.setItem(
      "token",
      data.token
    );


    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );


    if (data.user.rol === "doktor") {
      nav("/doctor-dashboard");
    } else {
      nav("/dashboard");
    }


  } catch(err) {

    console.log(err);
    alert("Backend bağlantısı yok");

  }

};

  return (
    <div className="bg">

      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>

      <div className="center">

        <div className="card glass bigCard">

          <h1>🏥 AI TRİAJ SİSTEMİ</h1>

          <p className="sub">
            Akıllı Klinik Karar Destek Sistemi
          </p>

          <div className="roleSwitch">

            <button
              type="button"
              className={
                form.rol === "hasta"
                  ? "roleBtn active"
                  : "roleBtn"
              }
              onClick={() =>
                setForm({
                  ...form,
                  rol: "hasta",
                })
              }
            >
              👤 Hasta
            </button>

            <button
              type="button"
              className={
                form.rol === "doktor"
                  ? "roleBtn active"
                  : "roleBtn"
              }
              onClick={() =>
                setForm({
                  ...form,
                  rol: "doktor",
                })
              }
            >
              🩺 Doktor
            </button>

          </div>

          <input
            placeholder={
              form.rol === "doktor"
                ? "Doktor Kodunuz"
                : "Kullanıcı Adınız"
            }
            onChange={(e) =>
              setForm({
                ...form,
                kullanici: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Şifre"
            onChange={(e) =>
              setForm({
                ...form,
                sifre: e.target.value,
              })
            }
          />

          <button
            className="btn"
            onClick={giris}
          >
            Sisteme Giriş
          </button>

          <p
            className="registerText"
            onClick={() => nav("/register")}
          >
            Hesabın yok mu? <span>Kayıt ol</span>
          </p>

        </div>

      </div>
    </div>
  );
}
