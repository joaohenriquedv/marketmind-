const API_URL = "http://localhost:3000";

export async function cadastrarUsuario(dados) {
  try {
    const res = await fetch(`${API_URL}/usuarios/cadastrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        sucesso: false,
        erro: data.erro || "Erro ao cadastrar usuário."
      };
    }

    return {
      sucesso: true,
      mensagem: data.mensagem,
      usuario: data.usuario
    };
  } catch (error) {
    console.log("Erro cadastro:", error);

    return {
      sucesso: false,
      erro: "Erro ao conectar com o servidor."
    };
  }
}

export async function loginUsuario(dados) {
  try {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        sucesso: false,
        erro: data.erro || "Erro ao fazer login."
      };
    }

    return {
      sucesso: true,
      mensagem: data.mensagem,
      token: data.token,
      usuario: data.usuario
    };
  } catch (error) {
    console.log("Erro login:", error);

    return {
      sucesso: false,
      erro: "Erro ao conectar com o servidor."
    };
  }
}

export async function criarNegocio(dados) {
  try {
    const res = await fetch(`${API_URL}/negocios/criar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        sucesso: false,
        erro: data.erro || "Erro ao criar negócio."
      };
    }

    return {
      sucesso: true,
      negocio: data.negocio,
      mensagem: data.mensagem
    };
  } catch (error) {
    console.log("Erro negócio:", error);

    return {
      sucesso: false,
      erro: "Erro ao conectar com o servidor."
    };
  }
}

export async function listarNegocios(usuarioId) {
  try {
    const res = await fetch(`${API_URL}/negocios/${usuarioId}`);

    const data = await res.json();

    if (!res.ok) {
      return {
        sucesso: false,
        erro: data.erro || "Erro ao listar negócios."
      };
    }

    return {
      sucesso: true,
      negocios: data
    };
  } catch (error) {
    console.log("Erro listar negócios:", error);

    return {
      sucesso: false,
      erro: "Erro ao conectar com o servidor."
    };
  }
}