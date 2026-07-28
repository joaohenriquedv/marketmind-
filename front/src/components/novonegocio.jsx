import { useState } from "react";
import "./novonegocio.css";
import { criarNegocio } from "../api";

export default function NovoNegocio({ onClose, onSalvar }) {
  const [form, setForm] = useState({
    nome: "", segmento: "", localizacao: "",
    receita: "", custos: "", funcionarios: "",
    anos: "", publico: "", concorrentes: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSalvar = async () => {
    setErro("");

    if (!form.nome || !form.segmento) {
      setErro("Preencha Nome e Segmento.");
      return;
    }

    // Recupera o usuário logado de verdade (salvo no cadastro/login)
    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) {
      setErro("Não encontramos seu usuário. Faça login novamente.");
      return;
    }
    const usuario = JSON.parse(usuarioSalvo);

    setCarregando(true);
    const resultado = await criarNegocio({
      usuario_id: usuario.id,
      nome: form.nome,
      segmento: form.segmento,
      localizacao: form.localizacao,
      receita_mensal: parseFloat(form.receita) || 0,
      custos_mensais: parseFloat(form.custos) || 0,
      funcionarios: parseInt(form.funcionarios) || 0,
      anos_mercado: parseInt(form.anos) || 0,
      publico_alvo: form.publico,
      concorrentes: form.concorrentes,
    });
    setCarregando(false);

    if (resultado.sucesso) {
      onSalvar({ ...form, id: resultado.id });
      onClose();
    } else {
      setErro(resultado.erro || "Erro ao salvar. Tente novamente.");
    }
  };

  return (
    <div className="nn-overlay" onClick={onClose}>
      <div className="nn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nn-modal-header">
          <h2 className="nn-modal-title">Novo Negócio</h2>
          <button className="nn-close" onClick={onClose}>✕</button>
        </div>

        <div className="nn-body">
          {erro && <div className="nn-erro-box">{erro}</div>}

          <div className="nn-field-group">
            <label className="nn-label">Nome <span>*</span></label>
            <input className="nn-input" placeholder="Ex: Lanchonete da Maria"
              value={form.nome} onChange={set("nome")} />
          </div>

          <div className="nn-field-group">
            <label className="nn-label">Segmento <span>*</span></label>
            <input className="nn-input" placeholder="Ex: Alimentação"
              value={form.segmento} onChange={set("segmento")} />
          </div>

          <div className="nn-field-group">
            <label className="nn-label">Localização</label>
            <input className="nn-input" placeholder="Ex: Recife - Boa Viagem"
              value={form.localizacao} onChange={set("localizacao")} />
          </div>

          <div className="nn-row">
            <div className="nn-field-group">
              <label className="nn-label">Receita Mensal (R$)</label>
              <input className="nn-input" type="number" placeholder="0"
                value={form.receita} onChange={set("receita")} />
            </div>
            <div className="nn-field-group">
              <label className="nn-label">Custos Mensais (R$)</label>
              <input className="nn-input" type="number" placeholder="0"
                value={form.custos} onChange={set("custos")} />
            </div>
          </div>

          <div className="nn-row">
            <div className="nn-field-group">
              <label className="nn-label">Funcionários</label>
              <input className="nn-input" type="number" placeholder="0"
                value={form.funcionarios} onChange={set("funcionarios")} />
            </div>
            <div className="nn-field-group">
              <label className="nn-label">Anos de Mercado</label>
              <input className="nn-input" type="number" placeholder="0"
                value={form.anos} onChange={set("anos")} />
            </div>
          </div>

          <div className="nn-field-group">
            <label className="nn-label">Público-alvo</label>
            <input className="nn-input" placeholder="Ex: Jovens e universitários"
              value={form.publico} onChange={set("publico")} />
          </div>

          <div className="nn-field-group">
            <label className="nn-label">Concorrentes</label>
            <input className="nn-input" placeholder="Ex: Lanchonete do João, Fast Food X"
              value={form.concorrentes} onChange={set("concorrentes")} />
          </div>
        </div>

        <div className="nn-footer">
          <button className="nn-btn-salvar" onClick={handleSalvar} disabled={carregando}>
            {carregando ? "Salvando..." : "Cadastrar Negócio"}
          </button>
        </div>
      </div>
    </div>
  );
}