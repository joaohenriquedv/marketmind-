CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha) 
VALUES ();

select * from usuarios;

CREATE TABLE negocios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    segmento VARCHAR(100),
    localizacao VARCHAR(150),
    receita_mensal DECIMAL(10,2) DEFAULT 0,
    custos_mensais DECIMAL(10,2) DEFAULT 0,
    funcionarios INT DEFAULT 0,
    anos_mercado INT DEFAULT 0,
    publico_alvo VARCHAR(255),
    concorrentes VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

select * from negocios;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    negocio_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100),
    preco_custo DECIMAL(10,2) DEFAULT 0,
    preco_venda DECIMAL(10,2) DEFAULT 0,
    vendas_mes INT DEFAULT 0,
    tendencia ENUM('Estavel', 'Crescendo', 'EmQueda') DEFAULT 'Estavel',
    estrategico BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE
);

select * from produtos	;

CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    negocio_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    nivel ENUM('Atenção', 'Crítico') DEFAULT 'Atenção',
    descricao TEXT,
    acao_sugerida TEXT,
    origem ENUM('Automatico', 'IA') DEFAULT 'Automatico',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE
);

