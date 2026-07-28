import "./navbar.css";

export default function Navbar({ onNavegar, paginaAtiva }) {
  function navegar(pagina) {
    if (typeof onNavegar === "function") {
      onNavegar(pagina);
    } else {
      window.location.href = `/${pagina}`;
    }
  }

  return (
    <nav className="mm-nav">
      <a
        className="mm-nav-logo"
        href="/principal"
        onClick={(e) => {
          e.preventDefault();
          navegar("principal");
        }}
      >
        <span className="mm-nav-logo-icon"></span>
        Market<span>Mind</span>
      </a>

      <ul className="mm-nav-links">
        <li>
          <a
            href="/principal"
            className={paginaAtiva === "principal" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navegar("principal");
            }}
          >
            Início
          </a>
        </li>

        <li>
          <a
            href="/produto"
            className={paginaAtiva === "produto" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navegar("produto");
            }}
          >
            Produto
          </a>
        </li>

        <li>
          <a
            href="/dashboard"
            className={paginaAtiva === "dashboard" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navegar("dashboard");
            }}
          >
            Dashboard
          </a>
        </li>

        <li>
          <a
            href="/contato"
            className={paginaAtiva === "contato" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navegar("contato");
            }}
          >
            Contato
          </a>
        </li>
      </ul>

      <div className="mm-nav-avatar-wrap">
        <div className="mm-nav-avatar">A</div>
        <span className="mm-nav-caret">▾</span>
      </div>
    </nav>
  );
}