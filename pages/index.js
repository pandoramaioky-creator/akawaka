import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Head from 'next/head'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

export default function ChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
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
      text: `👋 **Olá! Sou o assistente da Maklen para cobrança call center!**

🎯 **Como posso ajudar:**
• Digite "cliente [sua pergunta]" para dúvidas sobre cobrança
• Use "admin ativar" para liberar perguntas gerais
• Clique nos botões abaixo para dicas rápidas

💼 **Especialista em:**
✅ Técnicas de cobrança eficaz
✅ Negociação e acordo de pagamento  
✅ Como lidar com clientes difíceis
✅ Scripts e abordagens profissionais
✅ Estratégias de call center

Vamos começar! 🚀`,
      sender: 'bot',
      timestamp: new Date()
    }])
  }, [])

  const comprehensiveResponses = {
    "não quer pagar": `🚫 **CLIENTE NÃO QUER PAGAR - ESTRATÉGIAS AVANÇADAS:**

📋 **1. INVESTIGAÇÃO INICIAL:**
• "Entendo sua situação. Pode me explicar o que está acontecendo?"
• "Quando foi a última vez que conseguiu fazer um pagamento?"
• "Houve alguma mudança na sua situação financeira?"

🎯 **2. TÉCNICAS DE PERSUASÃO:**
• **Empatia primeiro:** "Sei que não é fácil passar por isso..."
• **Consequências positivas:** "Regularizando hoje, você volta a ter crédito"
• **Urgência controlada:** "Hoje posso oferecer condições especiais"

💡 **3. OPÇÕES DE NEGOCIAÇÃO:**
• Parcelamento em até 12x
• Desconto para pagamento à vista (até 30%)
• Entrada mínima + parcelas
• Suspensão temporária com nova data

⚡ **4. SCRIPTS EFICAZES:**
• "E se eu conseguir uma condição que caiba no seu orçamento?"
• "Prefere resolver hoje com desconto ou parcelar sem juros?"
• "Qual valor consegue pagar hoje para começarmos o acordo?"

🛡️ **5. CONTORNANDO OBJEÇÕES:**
• "Não tenho dinheiro" → "Entendo. E R$ 50 para começar?"
• "Vou pensar" → "Claro! Enquanto pensa, anoto essa proposta especial?"
• "Não é prioridade" → "E se tornássemos prioridade com 40% de desconto?"

📞 **6. FECHAMENTO:**
• "Então fico aguardando seu pagamento até às 18h hoje, ok?"
• "Vou enviar os dados por WhatsApp para facilitar"
• "Já está anotado: entrada de R$ X + 6x de R$ Y"`,

    "está nervoso": `😤 **CLIENTE NERVOSO/ALTERADO - TÉCNICAS DE DESESCALAÇÃO:**

🧘 **1. CONTROLE EMOCIONAL (SEU):**
• Respire fundo antes de falar
• Mantenha tom baixo e calmo
• Não leve para o pessoal
• Lembre: cliente está nervoso com a situação, não com você

🎭 **2. TÉCNICA DO ESPELHO EMOCIONAL:**
• "Percebo que está chateado, e te entendo perfeitamente"
• "Realmente deve ser frustrante essa situação"
• "Eu também ficaria preocupado no seu lugar"

🔇 **3. DEIXE DESABAFAR:**
• Escute sem interromper por 30-60 segundos
• Use "ahã", "entendo", "compreendo"
• NÃO tente resolver enquanto ele está falando

💊 **4. FRASES DESESCALADORAS:**
• "Vamos resolver isso juntos, ok?"
• "Estou aqui para ajudar, não para complicar"
• "Que tal começarmos do zero? Me explique a situação"
• "Sua preocupação é válida, vamos ver as opções"

🎯 **5. REDIRECIONAMENTO:**
• "Entendo sua frustração. E se focarmos na solução?"
• "Concordo que a situação é difícil. Vamos ver o que posso fazer"
• "Você tem razão em se preocupar. Posso ajudar assim..."

⚠️ **6. LIMITES PROFISSIONAIS:**
• Se xingar: "Preciso que mantenha o respeito para eu poder ajudar"
• Se ameaçar: "Vou anotar sua manifestação e passar para o supervisor"
• Se gritar: "Vou aguardar o senhor se acalmar para continuarmos"

🔄 **7. RECUPERAÇÃO:**
• "Agora que se acalmou, vamos às opções de pagamento?"
• "Ótimo! Então podemos resolver isso hoje mesmo?"
• "Perfeito! Vejo que quer resolver. Que tal essa proposta?"

📝 **8. REGISTRO:**
• Anote tudo: data, hora, argumentos, acordo
• Grave a ligação (se permitido)
• Confirme dados por WhatsApp/email`,

    "pediu desconto": `💰 **CLIENTE PEDIU DESCONTO - NEGOCIAÇÃO ESTRATÉGICA:**

🎯 **1. NÃO DÊ O DESCONTO IMEDIATAMENTE:**
• "Entendo que quer um desconto. Me fale sua situação atual"
• "Desconto é possível sim. Primeiro preciso entender suas condições"
• "Vamos ver o que posso fazer. Qual seria um valor ideal para você?"

💡 **2. INVESTIGAÇÃO ANTES DA OFERTA:**
• "Qual valor consegue pagar à vista hoje?"
• "Prefere parcelas menores ou desconto maior?"
• "Já teve alguma dificuldade de pagamento antes?"
• "Tem alguma data específica que é melhor para você?"

🔢 **3. ESCALA DE DESCONTOS ESTRATÉGICOS:**
• **1ª tentativa:** Valor total sem desconto
• **2ª tentativa:** 10% de desconto para pagamento à vista
• **3ª tentativa:** 15-20% se insistir e demonstrar dificuldade
• **4ª tentativa:** 25-30% apenas em casos extremos

📋 **4. SCRIPTS PARA NEGOCIAÇÃO:**
• "O desconto que posso oferecer hoje é de 15% para pagamento à vista"
• "Normalmente não faço, mas pelo seu histórico, posso dar 20%"
• "E se eu fizer assim: 25% de desconto, mas precisa ser hoje?"
• "Vou consultar meu supervisor... consegui 30%, mas expira em 2 horas"

⚡ **5. CRIANDO URGÊNCIA NO DESCONTO:**
• "Essa condição é válida apenas para hoje"
• "Tenho autorização para apenas 3 descontos assim hoje"
• "Depois das 18h volta ao valor normal"
• "É um desconto especial que consegui para você"

🎭 **6. CONTORNANDO "DESCONTO BAIXO":**
• Cliente: "Só 15%? Pouco!" 
• Você: "Entendo. E se for 15% + parcelamento sem juros?"
• "E se além dos 15%, eu liberar um prazo extra?"
• "Que tal 15% + entrada simbólica de apenas R$ 50?"

💼 **7. FECHAMENTO COM DESCONTO:**
• "Então fechamos: R$ X com 25% de desconto, pagamento hoje?"
• "Perfeito! Vou enviar os dados para pagamento com desconto"
• "Ótimo! Anoto aqui: valor final R$ X, vence hoje às 18h"

🔒 **8. PROTEGENDO A MARGEM:**
• Sempre ofereça algo em troca (prazo, à vista, histórico)
• Faça parecer que está "conseguindo" o desconto
• Use limitações: "Só posso fazer isso uma vez"
• Confirme: "Fechamos então? Não posso manter essa oferta muito tempo"`,

    "não atende": `📵 **CLIENTE NÃO ATENDE - ESTRATÉGIAS MULTICANAL:**

📞 **1. VARIAÇÃO DE HORÁRIOS:**
• **Manhã:** 8h-10h (pessoas em casa)
• **Meio-dia:** 12h-13h (intervalo almoço)
• **Tarde:** 14h-17h (horário comercial)
• **Início noite:** 18h-20h (chegando do trabalho)

📅 **2. VARIAÇÃO DE DIAS:**
• Segunda: Evite (pessoas ocupadas começando semana)
• Terça-Quinta: Melhores dias
• Sexta: Até 16h (pessoas preparando fim de semana)
• Sábado: 9h-12h (se permitido pela empresa)

💬 **3. ESTRATÉGIA DE MENSAGENS/WhatsApp:**
```
"Olá [Nome]! Sou [Seu Nome] da Maklen. 
Preciso falar sobre sua conta. Pode me retornar? 
WhatsApp: (XX) XXXX-XXXX"
```

```
"[Nome], consegui uma proposta especial para 
regularizar sua situação. Vamos conversar? 
Aguardo seu retorno até às 18h"
```

```
"Última tentativa de contato sobre seu acordo.
Condição especial expira hoje. Me retorne: (XX) XXXX"
```

📧 **4. E-MAIL ESTRATÉGICO:**
**Assunto:** "PROPOSTA ESPECIAL - VENCE HOJE"

"Olá [Nome],

Tentei contato telefônico mas não consegui falar com você.

🎯 **PROPOSTA EXCLUSIVA:**
✅ 30% de desconto para pagamento à vista
✅ Ou parcelamento em até 12x sem juros
✅ **Válido apenas até hoje às 18h**

Para aceitar, responda este email ou ligue:
📞 (XX) XXXX-XXXX
💬 WhatsApp: (XX) XXXX-XXXX

Atenciosamente,
[Seu Nome] - Maklen"

📋 **5. REGISTRO DE TENTATIVAS:**
• Data e horário de cada tentativa
• Meio utilizado (ligação, WhatsApp, email)
• Status: "Não atendeu", "Caixa postal", "Número inexistente"
• Próxima ação programada

🕵️ **6. INVESTIGAÇÃO DE NOVOS CONTATOS:**
• Pergunte para vizinhos/porteiro (se residencial)
• Consulte redes sociais para novos números
• Contate referências/avalistas
• Tente contatos alternativos no cadastro

⏰ **7. TIMING ESTRATÉGICO:**
• **Urgência crescente:** A cada tentativa, aumente a urgência
• **Espaçamento:** Não ligue várias vezes no mesmo dia
• **Persistência:** Mínimo 5 tentativas em horários diferentes
• **Limite:** Máximo 3 tentativas por dia

🎯 **8. SCRIPTS PARA CAIXA POSTAL:**
"Olá [Nome], é [Seu Nome] da Maklen. Preciso 
falar sobre uma proposta especial para sua conta. 
Me retorne no (XX) XXXX ou WhatsApp (XX) XXXX. 
A proposta expira amanhã. Obrigado!"

📊 **9. QUANDO PARAR DE INSISTIR:**
• Após 20 tentativas sem sucesso
• Se o número for inexistente
• Se cliente solicitar para não ligar mais
• Se for para cobrança jurídica`,

    "quer parcelar": `💳 **CLIENTE QUER PARCELAR - MAXIMIZANDO RESULTADOS:**

🎯 **1. INVESTIGAÇÃO INICIAL:**
• "Quantas parcelas você estava pensando?"
• "Qual valor de parcela cabe no seu orçamento?"
• "Prefere parcelas menores ou terminar logo?"
• "Consegue dar uma entrada para reduzir as parcelas?"

💰 **2. ESTRATÉGIA DE ENTRADA:**
• **SEMPRE peça entrada, mesmo simbólica:**
• "E uma entrada de R$ 100 para mostrar boa fé?"
• "Que tal R$ 50 de entrada + 6x de R$ Y?"
• "Entrada de 10% + parcelas menores?"
• "Uma entrada ajuda a conseguir mais desconto"

📊 **3. OPÇÕES DE PARCELAMENTO ESTRATÉGICAS:**

**SITUAÇÃO A - Valor até R$ 500:**
• À vista: 30% desconto
• 2x: 20% desconto
• 3-4x: 10% desconto
• 5-6x: sem desconto

**SITUAÇÃO B - Valor R$ 500-1000:**
• À vista: 35% desconto
• Entrada + 2x: 25% desconto
• Entrada + 4x: 15% desconto
• Entrada + 6x: 10% desconto

**SITUAÇÃO C - Valor acima R$ 1000:**
• À vista: 40% desconto
• Entrada + 3x: 30% desconto
• Entrada + 6x: 20% desconto
• Entrada + 9x: 15% desconto
• Entrada + 12x: 10% desconto

🎭 **4. SCRIPTS DE NEGOCIAÇÃO:**
• "Posso fazer 6x, mas preciso de uma entrada de R$ X"
• "12x é muito. Que tal 8x com R$ Y de entrada?"
• "Vou consultar... consegui 10x, mas só com entrada"
• "E se for assim: entrada + 5x com desconto?"

⚡ **5. CRIANDO VANTAGEM NO PARCELAMENTO:**
• "Menos parcelas = mais desconto"
• "Com entrada, consigo parcelas menores"
• "Parcelamento sem juros, mas precisa ser hoje"
• "Parcelas fixas, sem correção"

💡 **6. CONTORNANDO "MUITAS PARCELAS":**
• Cliente: "Quero 15x"
• Você: "15x não consigo, mas 12x com desconto de 10%?"
• "Que tal 10x com entrada simbólica de R$ 50?"
• "12x é o máximo, mas sem juros e sem correção"

📋 **7. CONFIRMAÇÃO E COMPROMISSO:**
• "Fechamos então: entrada R$ X + 8x de R$ Y?"
• "Primeira parcela vence dia 10. Confirma?"
• "Vou enviar boletos por email. Qual endereço?"
• "Anoto aqui seu compromisso. Conta comigo?"

🔒 **8. GARANTINDO O CUMPRIMENTO:**
• "Vou ligar 2 dias antes de cada vencimento"
• "Qualquer problema, me liga antes do vencimento"
• "WhatsApp sempre disponível para dúvidas"
• "Acordo registrado em sistema. Fique tranquilo"

⚠️ **9. SITUAÇÕES ESPECIAIS:**
• **Idoso:** Máximo 6x, parcelas maiores
• **Desempregado:** Entrada menor, mais parcelas
• **Empresário:** Parcelas com vencimento dia 10
• **Assalariado:** Vencimento após salário (dia 5)

📞 **10. PÓS-ACORDO:**
• Envie comprovante por WhatsApp imediatamente
• Confirme recebimento das informações
• Agende lembrete no sistema
• Mantenha relacionamento pós-acordo amigável`
  }

  const getGeminiResponse = async (prompt) => {
    try {
      if (!API_KEY) throw new Error('API Key não configurada')
      
      const genAI = new GoogleGenerativeAI(API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      let enhancedPrompt
      
      if (adminMode) {
        // MODO ADM: Responde qualquer coisa
        enhancedPrompt = `🔓 MODO ADMINISTRADOR ATIVADO - Você é um assistente geral da Maklen.

INSTRUÇÕES PARA MODO ADM:
- Responda QUALQUER pergunta que o usuário fizer
- Seja completo, detalhado e profissional  
- Use pelo menos 200-300 palavras
- Organize com emojis e tópicos claros
- Forneça exemplos práticos quando possível
- Não há restrições de tema

PERGUNTA: ${prompt}

Responda de forma completa e detalhada sobre o que foi perguntado.`
      } else {
        // MODO RESTRITO: Apenas cobrança call center
        enhancedPrompt = `🎯 VOCÊ É UM ESPECIALISTA EM COBRANÇA CALL CENTER DA MAKLEN

REGRAS IMPORTANTES:
- Você DEVE focar APENAS em cobrança, negociação, call center e relacionamento com clientes
- Se a pergunta NÃO for sobre cobrança, responda: "Desculpe, só posso ajudar com questões de cobrança call center. Para perguntas gerais, ative o modo ADM."
- Forneça respostas COMPLETAS com pelo menos 300-400 palavras
- Use formatação clara com emojis apropriados
- Inclua scripts práticos que os atendentes podem usar
- Dê exemplos reais de situações de cobrança
- Organize em tópicos numerados
- Inclua técnicas de persuasão e negociação
- Seja específico e aplicável no dia a dia do call center
- Foque em soluções práticas para situações reais

CONTEXTO: Você está ajudando colaboradores da Maklen que trabalham com cobrança call center.

PERGUNTA DO COLABORADOR: ${prompt}

IMPORTANTE: Se a pergunta for sobre cobrança/call center/negociação/clientes, responda de forma SUPER COMPLETA e DETALHADA. Se NÃO for sobre cobrança, peça para ativar modo ADM.`
      }
      
      const result = await model.generateContent(enhancedPrompt)
      const response = await result.response
      let responseText = response.text()
      
      // Garantir que não está fugindo do tema quando não está em modo ADM
      if (!adminMode && responseText && !responseText.includes("só posso ajudar com questões de cobrança")) {
        const promptLower = prompt.toLowerCase()
        const cobrancaKeywords = ['cliente', 'cobrança', 'pagamento', 'acordo', 'desconto', 'parcelamento', 'negociar', 'call center', 'telefone', 'devedor', 'débito']
        const hasCobrancaContext = cobrancaKeywords.some(keyword => promptLower.includes(keyword))
        
        if (!hasCobrancaContext) {
          return `❌ **Desculpe, só posso ajudar com questões de cobrança call center.**

🔐 **Para perguntas gerais, digite:** "admin ativar"

🎯 **Posso ajudar com:**
• Técnicas de cobrança e negociação
• Como lidar com clientes difíceis
• Scripts para call center
• Estratégias de acordo e parcelamento
• Desescalação de conflitos
• Fechamento de vendas de cobrança

💼 **Reformule sua pergunta incluindo contexto de cobrança!**`
        }
      }
      
      return responseText
    } catch (error) {
      console.error('Erro Gemini:', error)
      
      // Fallback: Buscar resposta pré-definida mais adequada
      const promptLower = prompt.toLowerCase()
      for (const [key, response] of Object.entries(comprehensiveResponses)) {
        if (promptLower.includes(key)) {
          return response
        }
      }
      
      // Fallback genérico para erro de conexão
      return `🤖 **Conexão temporariamente indisponível com a IA.**

📞 **DICAS RÁPIDAS DE COBRANÇA:**

✅ **Tom profissional sempre:** "Bom dia, Sr. [Nome], como posso ajudar?"
✅ **Escute primeiro:** Deixe o cliente falar antes de argumentar
✅ **Ofereça soluções:** "Que tal resolvermos assim..."
✅ **Crie urgência:** "Esta condição é válida até hoje"
✅ **Confirme tudo:** "Então ficou acordado R$ X para hoje, correto?"

💡 **Script básico:**
"Olá [Nome], é [Seu nome] da Maklen. Estou ligando sobre sua conta em atraso. Podemos resolver isso hoje com uma condição especial?"

🔄 **Tente novamente em alguns minutos para resposta completa da IA.**`
    }
  }

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    // Verificar comandos de admin
    if (textToSend.toLowerCase().includes('admin ativar')) {
      setAdminMode(true)
      setMessages(prev => [...prev, 
        { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() },
        { id: Date.now() + 1, text: "🔓 **MODO ADMINISTRADOR ATIVADO!**\n\nAgora posso responder qualquer pergunta, não apenas sobre cobrança. Pode perguntar sobre qualquer assunto que eu respondo de forma completa e detalhada.\n\n✅ Modo ADM: **LIGADO**\n🔓 Perguntas liberadas: **TODAS**", sender: 'bot', timestamp: new Date() }
      ])
      setInput('')
      return
    }

    if (textToSend.toLowerCase().includes('admin desativar')) {
      setAdminMode(false)
      setMessages(prev => [...prev, 
        { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() },
        { id: Date.now() + 1, text: "🔒 **MODO ADMINISTRADOR DESATIVADO!**\n\nVoltei ao modo especialista em cobrança call center. Agora respondo apenas perguntas que começam com 'cliente' sobre técnicas de cobrança e negociação.\n\n❌ Modo ADM: **DESLIGADO**\n🎯 Foco: **Cobrança Call Center**", sender: 'bot', timestamp: new Date() }
      ])
      setInput('')
      return
    }

    // Se não estiver em modo admin, exigir contexto de cobrança
    if (!adminMode && !textToSend.toLowerCase().startsWith('cliente')) {
      // Verificar se tem palavras-chave de cobrança mesmo sem "cliente"
      const cobrancaKeywords = ['cobrança', 'cobrar', 'pagamento', 'acordo', 'desconto', 'parcelamento', 'negociar', 'devedor', 'débito', 'atraso', 'vencido']
      const hasCobrancaContext = cobrancaKeywords.some(keyword => textToSend.toLowerCase().includes(keyword))
      
      if (!hasCobrancaContext) {
        setMessages(prev => [...prev, 
          { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() },
          { id: Date.now() + 1, text: `❌ **Só posso ajudar com questões de COBRANÇA CALL CENTER.**

🔐 **Para perguntas gerais:** Digite "admin ativar" primeiro

💼 **Exemplos do que posso responder:**
• "como cobrar cliente inadimplente?"
• "estratégias de negociação para acordo"
• "cliente não quer pagar, o que fazer?"
• "técnicas para call center de cobrança"

🚫 **NÃO posso responder:**
• Perguntas gerais sobre outros assuntos
• Dúvidas não relacionadas à cobrança
• Temas fora do contexto call center

🎯 **Reformule sua pergunta sobre COBRANÇA ou ative o modo ADM!**`, sender: 'bot', timestamp: new Date() }
        ])
        setInput('')
        return
      }
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
      const errorMessage = { id: Date.now(), text: "❌ Erro ao processar sua mensagem. Tente novamente ou use 'admin ativar' para modo geral.", sender: 'bot', timestamp: new Date() }
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

  const mentalTriggers = [
    "🔥 **URGÊNCIA:** 'Esta condição especial vence hoje às 18h!'",
    "💎 **EXCLUSIVIDADE:** 'Consegui uma autorização especial só para você'",
    "🏆 **PROVA SOCIAL:** 'Mais de 1000 clientes já regularizaram assim'",
    "⚡ **ESCASSEZ:** 'Só tenho 3 condições como essa hoje'",
    "🎁 **RECIPROCIDADE:** 'Como você é cliente antigo, vou fazer um desconto'",
    "🛡️ **AUTORIDADE:** 'Meu supervisor autorizou essa condição especial'",
    "💰 **BENEFÍCIO:** 'Regularizando hoje, volta a ter crédito na praça'",
    "⏰ **AGORA OU NUNCA:** 'Amanhã volta ao valor normal'"
  ]

  const faqSuggestions = [
    "cliente não quer pagar, estratégias avançadas",
    "cliente pediu desconto, como maximizar acordo", 
    "cliente não atende telefone, estratégias multicanal",
    "cliente está nervoso, técnicas de desescalação",
    "cliente quer parcelar, como negociar melhor",
    "cliente fala que não tem dinheiro, contornos",
    "cliente quer falar com supervisor, como resolver",
    "cliente ameaça processar, como lidar"
  ]

  return (
    <>
      <Head>
        <title>Maklen Chat Bot I.A - Call Center</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[700px] flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">🏢 Maklen Chat Bot I.A</h1>
                <p className="text-blue-100 text-sm">Especialista em Cobrança Call Center</p>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  adminMode ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {adminMode ? '🔓 MODO ADM: ON' : '🔒 MODO ADM: OFF'}
                </div>
                <p className="text-xs text-blue-200 mt-1">
                  {adminMode ? 'Perguntas gerais liberadas' : 'Apenas cobrança/negociação'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</div>
                  <div className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm">Preparando resposta completa...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t space-y-3 bg-gray-50">
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setShowTips(!showTips)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
              >
                💡 Gatilhos Mentais
              </button>
              <button 
                onClick={() => setShowFAQ(!showFAQ)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors"
              >
                ❓ Perguntas Frequentes
              </button>
              <button 
                onClick={() => handleSendMessage(adminMode ? 'admin desativar' : 'admin ativar')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  adminMode 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {adminMode ? '🔒 Desativar ADM' : '🔓 Ativar ADM'}
              </button>
            </div>

            {/* Gatilhos Mentais */}
            {showTips && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3">🧠 Gatilhos Mentais para Cobrança:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mentalTriggers.map((tip, index) => (
                    <div key={index} className="text-sm text-green-700 bg-white p-2 rounded border">{tip}</div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */