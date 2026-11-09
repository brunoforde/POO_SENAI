class Endereco {
    #logradouro;
    #numero;
    #cidade;
    #uf;

    constructor(logradouro, numero, cidade, uf) {
        this.#logradouro = logradouro;
        this.#numero = numero;
        this.#cidade = cidade;
        this.#uf = uf;
    }

    get logradouro() { return this.#logradouro; }
    get numero() { return this.#numero; }
    get cidade() { return this.#cidade; }
    get uf() { return this.#uf; }
}

class Pessoa {
    #nome;
    #endereco;

    constructor(nome, endereco) {
        this.nome = nome; // Invoca o setter para aplicar a validação
        this.endereco = endereco;
    }

    get nome() { return this.#nome; }
    
    set nome(valor) {
        if (!valor || valor.trim().length < 3) {
            throw new Error("O nome deve ter ao menos 3 caracteres.");
        }
        this.#nome = valor;
    }

    get endereco() { return this.#endereco; }
    
    set endereco(valor) {
        if (!(valor instanceof Endereco)) {
            throw new Error("Endereço inválido.");
        }
        this.#endereco = valor;
    }
}

class PessoaFisica extends Pessoa {
    #cpf;
    #dataNascimento;

    constructor(nome, endereco, cpf, dataNascimento) {
        super(nome, endereco);
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }

    get cpf() { return this.#cpf; }
    
    set cpf(valor) {
        const cpfLimpo = valor.replace(/[.\-\/]/g, '');
        if (cpfLimpo.length !== 11) {
            throw new Error("CPF deve conter exatamente 11 dígitos válidos.");
        }
        this.#cpf = cpfLimpo;
    }

    get dataNascimento() { return this.#dataNascimento; }
    
    set dataNascimento(valor) {
        const data = new Date(valor);
        if (isNaN(data.getTime())) {
            throw new Error("Data de nascimento inválida.");
        }
        if (data > new Date()) {
            throw new Error("A data de nascimento não pode estar no futuro.");
        }
        this.#dataNascimento = data;
    }
}

class PessoaJuridica extends Pessoa {
    #cnpj;
    #razaoSocial;

    constructor(nome, endereco, cnpj, razaoSocial) {
        super(nome, endereco);
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
    }

    get cnpj() { return this.#cnpj; }
    
    set cnpj(valor) {
        const cnpjLimpo = valor.replace(/[.\-\/]/g, '');
        if (cnpjLimpo.length !== 14) {
            throw new Error("CNPJ deve conter exatamente 14 dígitos válidos.");
        }
        this.#cnpj = cnpjLimpo;
    }

    get razaoSocial() { return this.#razaoSocial; }
    
    set razaoSocial(valor) {
        if (!valor || valor.trim() === '') {
            throw new Error("A Razão Social é obrigatória.");
        }
        this.#razaoSocial = valor;
    }
}

// EXECUÇÃO E TESTES

const clientesValidos = [];

function registrarCliente(tipo, dados) {
    try {
        let cliente;
        const end = new Endereco(dados.logradouro, dados.numero, dados.cidade, dados.uf);

        if (tipo === 'PF') {
            cliente = new PessoaFisica(dados.nome, end, dados.cpf, dados.dataNascimento);
        } else if (tipo === 'PJ') {
            cliente = new PessoaJuridica(dados.nome, end, dados.cnpj, dados.razaoSocial);
        }

        clientesValidos.push(cliente);
        console.log(`[SUCESSO] Cliente '${dados.nome}' cadastrado com sucesso.`);
    } catch (erro) {
        console.error(`[ERRO] Falha ao cadastrar '${dados.nome || 'Desconhecido'}': ${erro.message}`);
    }
}

console.log("=== INICIANDO CADASTRO DE CLIENTES ===\n");

// Caso: Pessoa Física Válida (Com formatação que deve ser ignorada)
registrarCliente('PF', {
    nome: "Carlos Silva",
    cpf: "123.456.789-00",
    dataNascimento: "1995-10-25",
    logradouro: "Rua do Comércio", numero: "100", cidade: "Piracicaba", uf: "SP"
});

// Caso: Pessoa Jurídica Válida
registrarCliente('PJ', {
    nome: "Tech Inovações",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "Tech Inovações LTDA",
    logradouro: "Av. Paulista", numero: "1000", cidade: "São Paulo", uf: "SP"
});

// Caso: Pessoa Física Inválida (Data no futuro e erro no tamanho do nome)
registrarCliente('PF', {
    nome: "Zé", 
    cpf: "11122233344",
    dataNascimento: "2050-01-01",
    logradouro: "Rua do Erro", numero: "99", cidade: "Campinas", uf: "SP"
});

// Caso: Pessoa Jurídica Inválida (CNPJ incompleto faltando 1 dígito)
registrarCliente('PJ', {
    nome: "Loja Fictícia",
    cnpj: "12.345.678/0001-9", 
    razaoSocial: "Loja Fictícia ME",
    logradouro: "Rua Central", numero: "10", cidade: "Sorocaba", uf: "SP"
});

// Caso: Pessoa Jurídica Inválida (Sem razão social)
registrarCliente('PJ', {
    nome: "Comércio Alpha",
    cnpj: "98765432000199",
    razaoSocial: "", 
    logradouro: "Rua Direita", numero: "5", cidade: "Bauru", uf: "SP"
});
