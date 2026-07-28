import { useState } from "react";
import "./alertas.css";
import Navbar from "./navbar.jsx";

const alertaAutomatico = {
  titulo: '"Empada" em queda',
  nivel: "Atenção",
  desc: "Vendas estão diminuindo. Considere mudar a estratégia ou trocar o foco.",
};

const alertasIA = [
  {
    titulo: "Precifique melhor seus produtos",
    nivel: "Atenção",
    desc: "O preço de venda da empada está muito baixo, considerando seu custo. Isso pode afetar seu lucro. Pense em um preço mais justo ou em melhorar sua receita.",
    acao: "Aumente o preço da empada ou considere substituir por um produto com maior margem.",
  },
  {
    titulo: "Reduza o desperdício com produtos em baixa",
    nivel: "Atenção",
    desc: "A empada está em declínio nas vendas. Você está perdendo dinheiro com isso. Analisar alternativas para diminuir os estoques.",
    acao: "Considere reduzir a produção da empada ou oferecer promoções para esvaziar o estoque.",
  },
  {
    titulo: "Atenção com a competição",
    nivel: "Atenção",
    desc: "Com o crescente interesse em sucos naturais e pastéis, verifique se a concorrência está oferecendo produtos semelhantes com qualidade ou preço e ajuste sua estratégia de marketing.",
    acao: "Reforce a divulgação dos seus produtos mais vendidos e avalie promoções para atrair novos clientes.",
  },
  {
    titulo: "Custo alto, lucro baixo",
    nivel: "Crítico",
    desc: "Seu custo mensal é muito próximo da receita. Isso significa que seu lucro é baixo e você tem pouco espaço para imprevistos. É risco.",
    acao: "Revise seus custos operacionais e procure maneiras de reduzir despesas ou aumentar receita, como novos produtos ou combos.",
  },
  {
    titulo: "Ainda não explorei as vendas online",
    nivel: "Atenção",
    desc: "Você pode estar perdendo muitos clientes que preferem comprar online, principalmente na região de Boa Viagem.",
    acao: "Considere implementar a venda online, seja com entrega própria ou parceria com aplicativos.",
  },
];

export default function Alertas({ onNavegar }) {
  const [negocioAtivo] = useState({ nome: "Lanchonete da Maria" });
  const [analisando, setAnalisando] = useState(false);
  const [alertasVisiveis, setAlertasVisiveis] = useState([]);

  function handleAnaliseIA() {
    if (analisando) return;
    setAnalisando(true);
    setAlertasVisiveis([]);

    // Simula o processamento da IA revelando os alertas em sequência
    alertasIA.forEach((alerta, i) => {
      setTimeout(() => {
        setAlertasVisiveis((prev) => [...prev, alerta]);
        if (i === alertasIA.length - 1) setAnalisando(false);
      }, (i + 1) * 500);
    });
  }

  return (
    <div className="al-page">
      <Navbar onNavegar={onNavegar} paginaAtiva="alertas" />

      <header className="al-header">
        <div className="al-header-left">
          <h1>Alertas Estratégicos</h1>
          <p>O que você precisa saber agora sobre seu negócio</p>
        </div>
        <div className="al-header-right">
          <div className="al-company-select">
            <span className="al-company-icon">🏢</span>
            {negocioAtivo.nome}
            <span className="al-company-caret">▾</span>
          </div>
          <button
            className="al-btn-ia"
            onClick={handleAnaliseIA}
            disabled={analisando}
          >
            {analisando ? (
              <>
                <span className="al-spinner" /> Analisando...
              </>
            ) : (
              <>⚠️ Análise IA</>
            )}
          </button>
        </div>
      </header>

      <div className="al-body">
        <div className="al-section-label">Alertas Automáticos</div>
        <div className="al-card">
          <div className="al-card-icon">📉</div>
          <div className="al-card-body">
            <div className="al-card-top">
              <span className="al-card-title">{alertaAutomatico.titulo}</span>
              <span className="al-badge">{alertaAutomatico.nivel}</span>
            </div>
            <div className="al-card-desc">{alertaAutomatico.desc}</div>
          </div>
        </div>

        <div className="al-section-label">Alertas da IA</div>

        {alertasVisiveis.length === 0 && !analisando && (
          <div className="al-empty">
            <span className="al-empty-icon"></span>
            <p>Clique em <strong>Análise IA</strong> para gerar um diagnóstico completo do seu negócio.</p>
          </div>
        )}

        {analisando && alertasVisiveis.length === 0 && (
          <div className="al-empty">
            <span className="al-spinner-lg" />
            <p>Analisando seus dados...</p>
          </div>
        )}

        {alertasVisiveis.map(({ titulo, nivel, desc, acao }) => (
          <div
            key={titulo}
            className={`al-card al-card-anim ${nivel === "Crítico" ? "critico" : ""}`}
          >
            <div className="al-card-icon">⚠️</div>
            <div className="al-card-body">
              <div className="al-card-top">
                <span className="al-card-title">{titulo}</span>
                <span className={`al-badge ${nivel === "Crítico" ? "critico" : ""}`}>{nivel}</span>
              </div>
              <div className="al-card-desc">{desc}</div>
              <div className="al-card-action"><span>👉</span>{acao}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}