import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    kullanici: "",
    email: "",
    sifre: ""
  });

  const kayit = async () => {

  if (!form.kullanici || !form.email || !form.sifre) {
    alert("Bilgileri doldur");
    return;
  }


  if (form.sifre.length < 8) {
    alert("Şifre en az 8 karakter olmalı");
    return;
  }


  try {

    const response = await fetch(
      "http://localhost:8000/register",
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
      alert(data.message || "Kayıt başarısız");
      return;
    }


    alert("Kayıt başarılı");

    nav("/");


  } catch(err) {

    console.log(err);
    alert("Backend bağlantısı yok");

  }

};

  return (
    <div className="bg">

      {/* FLOATING BACKGROUND */}
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>

      <div className="center">

        <div className="card glass bigCard">

          <h1>🧾 KAYIT OL</h1>
          <p className="sub">
            AI Triaj Sistemine katılmak için hesap oluştur
          </p>

          <input
            placeholder="Kullanıcı adı"
            onChange={(e) =>
              setForm({ ...form, kullanici: e.target.value })
            }
          />

          <input
            placeholder="E-posta"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Şifre (min 8 karakter)"
            onChange={(e) =>
              setForm({ ...form, sifre: e.target.value })
            }
          />

          <button className="btn" onClick={kayit}>
            Hesap Oluştur
          </button>

          {/* LOGIN LINK */}
          <p className="registerText" onClick={() => nav("/")}>
            Zaten hesabın var mı? <span>Giriş yap</span>
          </p>

        </div>

      </div>
    </div>
  );
}