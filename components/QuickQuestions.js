export default function QuickQuestions({ onSelect }) {
  const questions = [
    "cliente está doente",
    "cliente não pode pagar agora",
    "cliente não pode falar agora",
    "cliente disse que já pagou",
    "cliente pediu desconto",
    "cliente pediu prazo maior",
    "cliente não reconhece a dívida",
    "cliente desligou a ligação",
    "cliente não vai pagar"
  ];
  return (
    <div className="mb-2 p-2 border rounded bg-gray-50">
      {questions.map((q, i) => (
        <button key={i} onClick={() => onSelect(q)} className="block w-full text-left px-2 py-1 hover:bg-gray-200 rounded">
          {q}
        </button>
      ))}
    </div>
  )
}