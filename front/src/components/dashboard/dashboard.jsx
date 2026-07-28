import { useState, useMemo } from "react";
import "./dashboard.css";
import SeletorNegocio from "../seletorneg";
import NovoNegocio from "../novonegocio";
import Navbar from "../navbar.jsx";

const negociosInicial = [
  { id: 1, nome: "Lanchonete da Maria", segmento: "Alimentação" },
];

// Dados-base de produtos (mesma estrutura do produto.jsx) para alimentar os gráficos.
// Quando os produtos forem centralizados em estado global, troque por esses dados reais.
const produtosBase = [
  { nome: "Coxinha",          preco: 5.0, custo: 1.5, vendas: 800, tendencia: "Crescendo" },
  { nome: "Pastel de Carne",  preco: 6.0, custo: 2.0, vendas: 500, tendencia: "Crescendo" },
  { nome: "Suco Natural",     preco: 6.0, custo: 2.25, vendas: 300, tendencia: "Crescendo" },
  { nome: "Refrigerante Lata", preco: 5.0, custo: 2.8, vendas: 400, tendencia: "Estavel" },
  { nome: "Empada",           preco: 4.0, custo: 2.5, vendas: 200, tendencia: "EmQueda" },
];

const custosFixos = 14500; // custo mensal fixo do negócio, usado no cálculo de lucro

function formatBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Dashboard({ onNavegar }) {
  const [negocios, setNegocios]       = useState(negociosInicial);
  const [ativoId, setAtivoId]         = useState(1);
  const [showSeletor, setShowSeletor] = useState(false);
  const [showModal, setShowModal]     = useState(false);

  const negocioAtivo = negocios.find((n) => n.id === ativoId) || negocios[0];

  const handleSalvarNegocio = (form) => {
    const novo = { id: Date.now(), nome: form.nome, segmento: form.segmento };
    setNegocios((prev) => [...prev, novo]);
    setAtivoId(novo.id);
  };

  // ── Cálculos dinâmicos derivados dos produtos ──
  const stats = useMemo(() => {
    const receita = produtosBase.reduce((acc, p) => acc + p.preco * p.vendas, 0);
    const custoTotal = produtosBase.reduce((acc, p) => acc + p.custo * p.vendas, 0) + custosFixos;
    const lucro = receita - custoTotal;
    const margemMedia = receita > 0 ? (lucro / receita) * 100 : 0;

    const crescendo = produtosBase.filter((p) => p.tendencia === "Crescendo").length;
    const estavel   = produtosBase.filter((p) => p.tendencia === "Estavel").length;
    const emQueda   = produtosBase.filter((p) => p.tendencia === "EmQueda").length;
    const total     = produtosBase.length;

    // Score de competitividade: pondera margem saudável + tendência geral de crescimento
    const margemScore = Math.min(margemMedia / 60, 1) * 60; // até 60 pts por margem
    const tendenciaScore = total > 0 ? (crescendo / total) * 40 : 0; // até 40 pts por tendência
    const competitividade = Math.round(margemScore + tendenciaScore);

    const topProdutos = [...produtosBase]
      .map((p) => ({ ...p, receita: p.preco * p.vendas }))
      .sort((a, b) => b.receita - a.receita);

    const maxReceita = topProdutos[0]?.receita || 1;

    return {
      receita, lucro, margemMedia, custoTotal,
      crescendo, estavel, emQueda, total,
      competitividade, topProdutos, maxReceita,
    };
  }, []);

  const produtosEmQueda = produtosBase.filter((p) => p.tendencia === "EmQueda");

  // ── Geometria do gauge de competitividade ──
  const gaugeRadius = 42;
  const gaugeCirc = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCirc * (1 - stats.competitividade / 100);
  const gaugeColor = stats.competitividade >= 60 ? "#22c55e" : stats.competitividade >= 35 ? "#f47421" : "#ef4444";

  // ── Geometria do donut de tendência ──
  const donutRadius = 35;
  const donutCirc = 2 * Math.PI * donutRadius;
  const pctCrescendo = stats.total ? stats.crescendo / stats.total : 0;
  const pctEstavel   = stats.total ? stats.estavel / stats.total : 0;
  const pctQueda     = stats.total ? stats.emQueda / stats.total : 0;

  const arcCrescendo = donutCirc * pctCrescendo;
  const arcEstavel   = donutCirc * pctEstavel;
  const arcQueda     = donutCirc * pctQueda;

  const kpis = [
    { label: "Receita Estimada", value: formatBRL(stats.receita), delta: "↑ 5.2% vs mês anterior", deltaClass: "green", icon: "$" },
    { label: "Lucro Estimado",   value: formatBRL(stats.lucro),  delta: "↑ 3.1% vs mês anterior",  deltaClass: stats.lucro >= 0 ? "green" : "red", icon: "📈" },
    { label: "Margem Média",     value: `${stats.margemMedia.toFixed(1)}%`, delta: stats.margemMedia >= 30 ? "✓ Saudável" : "⚠ Atenção", deltaClass: stats.margemMedia >= 30 ? "green" : "blue", icon: "👥" },
    { label: "Produtos Ativos",  value: String(stats.total), delta: `${stats.crescendo} em crescimento`, deltaClass: "blue", icon: "📦" },
  ];

  return (
    <div className="db-page">
      <Navbar onNavegar={onNavegar} paginaAtiva="dashboard" />

      <header className="db-header">
        <div className="db-header-left">
          <h1>Dashboard</h1>
          <p>Visão geral do seu negócio</p>
        </div>

        {/* Seletor de empresa — posição relativa para o dropdown */}
        <div style={{ position: "relative" }}>
          <div className="db-company-select" onClick={() => setShowSeletor((v) => !v)}>
            <span className="db-company-icon">🏢</span>
            {negocioAtivo.nome}
            <span className="db-company-caret">{showSeletor ? "▴" : "▾"}</span>
          </div>

          {showSeletor && (
            <SeletorNegocio
              negocios={negocios}
              ativo={ativoId}
              onSelecionar={setAtivoId}
              onNovo={() => setShowModal(true)}
              onClose={() => setShowSeletor(false)}
            />
          )}
        </div>
      </header>

      <div className="db-body">

        {/* ALERTA — dinâmico conforme produtos em queda */}
        {produtosEmQueda.length > 0 && (
          <div className="db-alert">
            <div className="db-alert-left">
              <div className="db-alert-icon">⚠️</div>
              <div>
                <div className="db-alert-title">Produtos em queda</div>
                <div className="db-alert-sub">
                  {produtosEmQueda.length} produto(s) com tendência de queda nas vendas.
                </div>
              </div>
            </div>
            <span className="db-alert-link" onClick={() => onNavegar("alertas")}>
              Ver todos ({produtosEmQueda.length}) →
            </span>
          </div>
        )}

        {/* KPIs */}
        <div className="db-kpis">
          {kpis.map(({ label, value, delta, deltaClass, icon }) => (
            <div key={label} className="db-kpi">
              <div className="db-kpi-left">
                <span className="db-kpi-label">{label}</span>
                <span className="db-kpi-value">{value}</span>
                <span className={`db-kpi-delta ${deltaClass}`}>{delta}</span>
              </div>
              <div className="db-kpi-icon">{icon}</div>
            </div>
          ))}
        </div>

        {/* GRÁFICOS */}
        <div className="db-charts">

          {/* Competitividade — calculada a partir de margem + tendência */}
          <div className="db-chart-card">
            <div className="db-chart-title">Competitividade</div>
            <div className="db-gauge-wrap">
              <div className="db-gauge">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={gaugeRadius} fill="none" stroke="#e8e6e3" strokeWidth="10"/>
                  <circle
                    cx="50" cy="50" r={gaugeRadius} fill="none"
                    stroke={gaugeColor} strokeWidth="10"
                    strokeDasharray={gaugeCirc}
                    strokeDashoffset={gaugeOffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease" }}
                  />
                </svg>
                <div className="db-gauge-label">
                  <span className="db-gauge-num">{stats.competitividade}</span>
                  <span className="db-gauge-den">/100</span>
                </div>
              </div>
              <div className="db-gauge-sub">
                {stats.competitividade >= 60
                  ? <>Seu negócio está bem<br/>posicionado!</>
                  : stats.competitividade >= 35
                    ? <>Há espaço para<br/>melhorar</>
                    : <>Atenção: posição<br/>de risco</>}
              </div>
              <button className="db-gauge-btn" onClick={() => onNavegar("alertas")}>Ver sugestões →</button>
            </div>
          </div>

          {/* Tendência dos Produtos — proporcional aos dados reais */}
          <div className="db-chart-card">
            <div className="db-chart-title">Tendência dos Produtos</div>
            <div className="db-donut-wrap">
              <svg width="130" height="130" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={donutRadius} fill="none" stroke="#22c55e" strokeWidth="22"
                  strokeDasharray={`${arcCrescendo} ${donutCirc - arcCrescendo}`}
                  strokeDashoffset="0" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r={donutRadius} fill="none" stroke="#f47421" strokeWidth="22"
                  strokeDasharray={`${arcEstavel} ${donutCirc - arcEstavel}`}
                  strokeDashoffset={-arcCrescendo} transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r={donutRadius} fill="none" stroke="#ef4444" strokeWidth="22"
                  strokeDasharray={`${arcQueda} ${donutCirc - arcQueda}`}
                  strokeDashoffset={-(arcCrescendo + arcEstavel)} transform="rotate(-90 50 50)"/>
              </svg>
              <div className="db-donut-legend">
                <div className="db-legend-item">
                  <div className="db-legend-dot" style={{ background: "#22c55e" }}/> Crescendo ({stats.crescendo})
                </div>
                <div className="db-legend-item">
                  <div className="db-legend-dot" style={{ background: "#f47421" }}/> Estável ({stats.estavel})
                </div>
                <div className="db-legend-item">
                  <div className="db-legend-dot" style={{ background: "#ef4444" }}/> Em queda ({stats.emQueda})
                </div>
              </div>
            </div>
          </div>

          {/* Top Produtos — ordenado por receita real */}
          <div className="db-chart-card">
            <div className="db-chart-title">Top Produtos (Receita)</div>
            <div className="db-bars">
              {stats.topProdutos.map(({ nome, receita }) => (
                <div key={nome} className="db-bar-row">
                  <span className="db-bar-label">{nome}</span>
                  <div className="db-bar-track">
                    <div
                      className="db-bar-fill"
                      style={{ width: `${(receita / stats.maxReceita) * 100}%` }}
                    />
                  </div>
                  <span className="db-bar-val">{receita.toLocaleString("pt-BR")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODO SIMPLES — texto dinâmico conforme situação */}
        <div className="db-simple-banner">
          <div className="db-simple-icon">⚡</div>
          <div>
            <div className="db-simple-title">Modo Simples</div>
            <div className="db-simple-text">
              ⚠️ <span>
                {produtosEmQueda.length > 0
                  ? `"${produtosEmQueda.map((p) => p.nome).join(", ")} estão vendendo menos. Pode ser hora de mudar de estratégia."`
                  : `"Seus produtos estão indo bem. Continue assim!"`}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL NOVO NEGÓCIO */}
      {showModal && (
        <NovoNegocio
          onClose={() => setShowModal(false)}
          onSalvar={handleSalvarNegocio}
        />
      )}
    </div>
  );
}