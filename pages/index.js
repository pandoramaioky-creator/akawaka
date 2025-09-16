import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Head from 'next/head'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

export default function ChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMessages([{
      id: 1,
      text: "👋 Olá! Sou o assistente da Maklen para cobrança call center. Digite sua pergunta sobre cobrança ou 'admin ativar' para perguntas gerais.",
      sender: 'bot',
      timestamp: new Date()
    }])
  }, [])

  const getGeminiResponse = async (prompt) => {
    try {
      if (!API_KEY) throw new Error('API Key não configurada')
      
      const genAI = new GoogleGenerativeAI(API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      let enhancedPrompt = adminMode 
        ? `Responda qualquer pergunta de forma completa: ${prompt}`
        : `Você é especialista em cobrança call center. Responda apenas sobre cobrança, negociação e call center: ${prompt}`
      
      const result = await model.generateContent(enhancedPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      return "Erro na conexão com IA. Tente novamente."
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    if (input.toLowerCase().includes('admin ativar')) {
      setAdminMode(true)
      setMessages(prev => [...prev, 
        { id: Date.now(), text: input, sender: 'user', timestamp: new Date() },
        { id: Date.now() + 1, text: "🔓 MODO ADM ATIVADO! Agora respondo qualquer pergunta.", sender: 'bot', timestamp: new Date() }
      ])
      setInput('')
      return
    }

    if (input.toLowerCase().includes('admin desativar')) {
      setAdminMode(false)
      setMessages(prev => [...prev, 
        { id: Date.now(), text: input, sender: 'user', timestamp: new Date() },
        { id: Date.now() + 1, text: "🔒 MODO ADM DESATIVADO! Agora só respondo sobre cobrança.", sender: 'bot', timestamp: new Date() }
      ])
      setInput('')
      return
    }

    setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user', timestamp: new Date() }])
    setIsLoading(true)
    
    const response = await getGeminiResponse(input)
    setMessages(prev => [...prev, { id: Date.now(), text: response, sender: 'bot', timestamp: new Date() }])
    
    setInput('')
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>Maklen Chat Bot</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
          
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-bold">Maklen Chat Bot</h1>
            <div className={`text-sm ${adminMode ? 'text-green-200' : 'text-red-200'}`}>
              {adminMode ? '🔓 MODO ADM: ON' : '🔒 MODO ADM: OFF'}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-center">Carregando...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua pergunta..."
                className="flex-1 border rounded-lg p-3"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}