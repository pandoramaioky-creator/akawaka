import { useState, useRef, useEffect } from "react";
import { getResponse } from "../lib/gemini";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import GatilhosMentais from "./GatilhosMentais";

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "🤖 Bem-vindo ao Maklen Chat Bot I.A – especialista em cobrança!" }
  ]);
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(false);
  const [showGatilhos, setShowGatilhos] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [askPassword, setAskPassword] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (input.trim().toUpperCase() === "MODO ADM") {
      if (isAdmin) {
        setIsAdmin(false);
        setMessages((p) => [...p, { from: "bot", text: "🔒 MODO ADM desativado." }]);
      } else setAskPassword(true);
      setInput(""); return;
    }
    if (askPassword) {
      if (input.trim() === "MK132***") {
        setIsAdmin(true);
        setMessages((p) => [...p, { from: "bot", text: "✅ MODO ADM ativado." }]);
      } else setMessages((p) => [...p, { from: "bot", text: "❌ Senha incorreta." }]);
      setAskPassword(false); setInput(""); return;
    }
    const userMessage = { from: "user", text: input };
    setMessages([...messages, userMessage]); setInput("");
    const botReply = await getResponse(input, isAdmin);
    setMessages((p) => [...p, { from: "bot", text: botReply }]);
  };
  const handleKeyPress = (e) => { if (e.key === "Enter") handleSend(); };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Maklen Chat Bot I.A
        {isAdmin ? <span className="text-green-600 text-sm font-semibold">🔓 ADM Ativo</span> : <span className="text-gray-500 text-sm">🔒 ADM Off</span>}
      </h1>
      <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-3 h-[600px] bg-gray-50 space-y-3">
        {messages.map((msg, i) => <MessageBubble key={i} from={msg.from} text={msg.text} />)}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setShowQuick(!showQuick)} className="bg-gray-300 px-3 py-1 rounded">Perguntas Frequentes</button>
        <button onClick={() => setShowGatilhos(!showGatilhos)} className="bg-yellow-300 px-3 py-1 rounded">Gatilhos Mentais</button>
      </div>
      {showQuick && <QuickQuestions onSelect={setInput} />}
      {showGatilhos && <GatilhosMentais />}
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress}
          placeholder="Digite sua pergunta (comece com 'cliente')..." className="flex-1 border rounded px-3 py-2"/>
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Enviar</button>
      </div>
    </div>
  )
}