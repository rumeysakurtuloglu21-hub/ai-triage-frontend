import { useState } from "react";

export default function PrescriptionRequest() {
  const [form, setForm] = useState({
    chronicDiseases: "",
    medications: [{ name: "", dose: "", frequency: "" }],
    notes: ""
  });

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updated = [...form.medications];
      updated[index][name] = value;
      setForm({ ...form, medications: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addMedication = () => {
    setForm({
      ...form,
      medications: [
        ...form.medications,
        { name: "", dose: "", frequency: "" }
      ]
    });
  };

  const removeMedication = (index) => {
    const updated = form.medications.filter((_, i) => i !== index);
    setForm({ ...form, medications: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://ai-triage-mvp-1.onrender.com/prescription-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Talep gönderildi");
  };

  return (
    <div className="rx-page">

      <div className="rx-header">
        <h2>💊 Kronik İlaç Talebi</h2>
        <p>Aile hekimine otomatik yenileme isteği gönder</p>
      </div>

      <form className="rx-card" onSubmit={handleSubmit}>

        <div className="rx-section">
          <label>Kronik Hastalıklar</label>
          <textarea
            name="chronicDiseases"
            value={form.chronicDiseases}
            onChange={handleChange}
            placeholder="Örn: Diyabet, hipertansiyon"
          />
        </div>

        <div className="rx-section">
          <div className="rx-row">
            <h3>İlaçlar</h3>
            <button type="button" onClick={addMedication}>
              + Ekle
            </button>
          </div>

          {form.medications.map((med, i) => (
            <div key={i} className="rx-med">

              <input
                name="name"
                placeholder="İlaç adı"
                value={med.name}
                onChange={(e) => handleChange(e, i)}
              />

              <input
                name="dose"
                placeholder="Doz"
                value={med.dose}
                onChange={(e) => handleChange(e, i)}
              />

              <input
                name="frequency"
                placeholder="Kullanım"
                value={med.frequency}
                onChange={(e) => handleChange(e, i)}
              />

              <button
                type="button"
                onClick={() => removeMedication(i)}
              >
                ✕
              </button>

            </div>
          ))}
        </div>

        <div className="rx-section">
          <label>Ek Not</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Varsa açıklama..."
          />
        </div>

        <button className="rx-submit" type="submit">
          Aile Hekimine Gönder
        </button>

      </form>

    </div>
  );
}
