import { useRef, useEffect } from "react";
import "./seletorneg.css";

export default function SeletorNegocio({ negocios, ativo, onSelecionar, onNovo, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="sn-dropdown" ref={ref}>
      <div className="sn-header">Meus Negócios</div>

      <div className="sn-list">
        {negocios.map((n) => (
          <div
            key={n.id}
            className={`sn-item ${n.id === ativo ? "active" : ""}`}
            onClick={() => { onSelecionar(n.id); onClose(); }}
          >
            <div className="sn-item-icon">🏢</div>
            <div className="sn-item-info">
              <span className="sn-item-nome">{n.nome}</span>
              <span className="sn-item-seg">{n.segmento}</span>
            </div>
            {n.id === ativo && <span className="sn-check">✓</span>}
          </div>
        ))}
      </div>

      <div className="sn-divider" />

      <button className="sn-btn-novo" onClick={() => { onNovo(); onClose(); }}>
        + Adicionar novo negócio
      </button>
    </div>
  );
}