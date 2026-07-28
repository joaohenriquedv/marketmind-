import { useState } from "react";
import axios from "axios";
import "./chatbot.css";

export default function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([]);

  async function enviarMensagem() {
    if (!mensagem.trim()) return;

    const perguntaUsuario = mensagem;

    setConversas((prev) => [
      ...prev,
      { tipo: "usuario", texto: perguntaUsuario }
    ]);

    setMensagem("");

    try {
      const response = await axios.post("http://localhost:3002/chat", {
        mensagem: perguntaUsuario,
        usuario_id: "usuario_1"
      });

      setConversas((prev) => [
        ...prev,
        { tipo: "bot", texto: response.data.resposta }
      ]);
    } catch (error) {
      console.log(error);

      setConversas((prev) => [
        ...prev,
        { tipo: "bot", texto: "Erro ao conectar com o servidor." }
      ]);
    }
  }

  return (
    <>
      <img
        src="/chatbot.png"
        alt="Abrir chat"
        className="chat-image"
        onClick={() => setAberto(!aberto)}
      />

      {aberto && (
        <div className="chat-box">
          <div className="chat-header">
            <strong>MarketMind Bot</strong>
            <button onClick={() => setAberto(false)}>X</button>
          </div>

          <div className="chat-body">
            {conversas.map((msg, index) => (
              <div key={index} className={`msg ${msg.tipo}`}>
                {msg.texto}
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
            />

            <button onClick={enviarMensagem}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}