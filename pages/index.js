import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

export default function ChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Mensagem de boas-vindas
    setMessages([{
      id: 1,
      text: "👋 Olá! Sou o assistente da Maklen para **cobrança call center**. Digite 'cliente [sua pergunta]' para começar!",
      sender: 'bot',
      timestamp: new Date()
    }])
  }, [])

  const fallbackResponses = {
    cliente: [
      "📞 Para cobranças eficazes, sempre mantenha um tom respeitoso e profissional.",
      "💡 Registre todas as interações com o cliente no sistema para acompanhamento.",
      "⏰ O melhor horário para ligações é entre 9h-11h e 14h-17h.",
      "📋 Sempre confirme os dados do cliente antes de iniciar a cobrança.",
      "🎯 Foque na solução, não no problema. Ofereça opções de pagamento."
    ]
  }

  const mentalTriggers = [
    "🔥 Urgência: 'Esta oferta vence hoje!'",
    "💎 Exclusividade: 'Apenas para clientes especiais'",
    "🏆 Prova Social: 'Mais de 1000 clientes satisfeitos'",
    "⚡ Escassez: 'Restam apenas 3 vagas'",
    "🎁 Reciprocidade: 'Desconto especial para você'",
    "🛡️ Autoridade: 'Recomendado por especialistas'"
  ]

  const faqSuggestions = [
    "cliente não quer pagar, o que fazer?",
    "cliente pediu desconto, como negociar?",
    "cliente não atende, qual estratégia usar?",
    "cliente está nervoso, como acalmar?",
    "cliente quer parcelar, como proceder?"
  ]

  const getGeminiResponse = async (prompt) => {
    try {
      if (!API_KEY) throw new Error('API Key não configurada')
      
      const genAI = new GoogleGenerativeAI(API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const enhancedPrompt = `Você é um assistente especializado em cobrança call center da empresa Maklen. 
      Responda de forma profissional, prática e objetiva sobre: ${prompt}
      Foque em técnicas de cobrança, negociação e relacionamento com cliente.
      Use emojis apropriados e seja direto ao ponto.`
      
      const result = await model.generateContent(enhancedPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Erro Gemini:', error)
      // Fallback para resposta local
      const responses = fallbackResponses.cliente
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    // Só responde se começar com "cliente"
    if (!textToSend.toLowerCase().startsWith('cliente')) {
      setMessages(prev => [...prev, 
        { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() },
        { id: Date.now() + 1, text: "❌ Por favor, inicie sua pergunta com 'cliente' para que eu possa ajudar com cobrança call center.", sender: 'bot', timestamp: new Date() }
      ])
      setInput('')
      return
    }

    const userMessage = { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await getGeminiResponse(textToSend)
      const botMessage = { id: Date.now(), text: response, sender: 'bot', timestamp: new Date() }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = { id: Date.now(), text: "❌ Erro ao processar sua mensagem. Tente novamente.", sender: 'bot', timestamp: new Date() }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">🏢 Maklen Chat Bot I.A</h1>
          <p className="text-blue-100 text-sm">Especialista em Cobrança Call Center</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t space-y-2">
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setShowTips(!showTips)}
              className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
            >
              💡 Gatilhos Mentais
            </button>
            <button 
              onClick={() => setShowFAQ(!showFAQ)}
              className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600"
            >
              ❓ Perguntas Frequentes
            </button>
          </div>

          {/* Gatilhos Mentais */}
          {showTips && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🧠 Gatilhos Mentais:</h3>
              <div className="space-y-1">
                {mentalTriggers.map((tip, index) => (
                  <div key={index} className="text-sm text-green-700">{tip}</div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {showFAQ && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🤔 Perguntas Frequentes:</h3>
              <div className="space-y-1">
                {faqSuggestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="block w-full text-left text-sm text-purple-700 hover:bg-purple-100 p-1 rounded"
                  >
                    • {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite: cliente [sua pergunta sobre cobrança]..."
              className="flex-1 border border-gray-300 rounded-lg p-3 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 self-end"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}