export async function getResponse(userInput, isAdmin) {
  try {
    if (!isAdmin && !userInput.toLowerCase().startsWith("cliente")) {
      return "⚠️ Perguntas devem começar com 'cliente'.";
    }
    return `🤖 Resposta do Maklen I.A para: ${userInput}`;
  } catch {
    return fallbackResponse(userInput);
  }
}
function fallbackResponse(userInput) {
  if (userInput.includes("doente")) return "⚕️ Cliente doente: seja empático, sugira prazo.";
  if (userInput.includes("não pode pagar agora") || userInput.includes("nao pode pagar agora")) return "💡 Sugira parcelamento ou nova data.";
  if (userInput.includes("não pode falar agora") || userInput.includes("nao pode falar agora")) return "📞 Combine um horário adequado para retorno.";
  return "ℹ️ Seja empático e conduza o cliente a um compromisso.";
}