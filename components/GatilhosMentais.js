export default function GatilhosMentais() {
  const gatilhos = [
    "Mostre empatia e compreensão",
    "Reforce benefícios do pagamento imediato",
    "Ofereça alternativas de negociação",
    "Explique as consequências sem ameaças",
    "Agende nova data de contato com compromisso"
  ];
  return (
    <div className="mb-2 p-2 border rounded bg-yellow-50">
      {gatilhos.map((g, i) => (
        <div key={i} className="px-2 py-1">🔑 {g}</div>
      ))}
    </div>
  )
}