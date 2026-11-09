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
}class PessoaFisica extends Pessoa {
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