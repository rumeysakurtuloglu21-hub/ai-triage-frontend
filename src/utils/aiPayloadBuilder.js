export function buildAIPayload(
  symptom,
  severity,
  duration,
  profile = {},
  user = {}
) {
  return {

    // ana triage verileri
    semptomlar: symptom || "",
    duration: duration || "",
    severity: severity || "",


    // kullanıcı bilgileri
    user: {
      id: user.id || "",
      kullanici: user.kullanici || "",
      email: user.email || "",
      rol: user.rol || "hasta"
    },


    // hasta profili
    patient: {

      age: profile.age || "",
      gender: profile.gender || "",
      weight: profile.weight || "",
      height: profile.height || "",

      blood: profile.blood || "",

      // hastalıklar
      diseases: profile.diseases || [],
      chronic: profile.chronic || "",

      // alerji
      allergies: profile.allergies || [],

      // operasyon geçmişi
      surgeries: profile.surgeries || "",

      // ilaçlar
      medications:
        (profile.medications || []).map(m => ({
          name: m.name || "",
          dose: m.dose || "",
          frequency: m.frequency || "",
          lastTaken: m.lastTaken || ""
        }))
    },


    // ileride kayıt için
    metadata: {
      source: "web",
      createdAt: new Date().toISOString()
    }
  };
}