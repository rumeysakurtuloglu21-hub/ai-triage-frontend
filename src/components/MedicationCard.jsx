export default function MedicationCard({ med }) {
  return (
    <div style={{
      padding: 10,
      margin: 5,
      background: "var(--card)",
      borderRadius: 10
    }}>
      <h4>💊 {med.name}</h4>
      <p>{med.dose}</p>
      <p>{med.frequency}</p>
      <p>Son alım: {med.lastTaken}</p>
    </div>
  );
}