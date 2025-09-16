export default function MessageBubble({ from, text }) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`whitespace-pre-line leading-relaxed px-4 py-2 rounded-xl shadow-md max-w-[80%] ${
          from === "user"
            ? "bg-blue-500 text-white text-right"
            : "bg-gray-200 text-gray-900 text-left"
        }`}>
        {text}
      </div>
    </div>
  )
}