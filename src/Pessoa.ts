export class Pessoa {
  protected _nome: string;
  protected _endereco: string;
  protected _telefone: string;

  constructor(nome: string = "", endereco: string = "", telefone: string = "") {
    this._nome = nome;
    this._endereco = endereco;
    this._telefone = telefone;
  }

  get nome(): string {
    return this._nome;
  }
  set nome(n: string) {
    this._nome = n;
  }

  get endereco(): string {
    return this._endereco;
  }
  set endereco(e: string) {
    this._endereco = e;
  }

  get telefone(): string {
    return this._telefone;
  }
  set telefone(t: string) {
    this._telefone = t;
  }

  public apresentarDetalhes(): string {
    return `${this._nome.padEnd(28)} | ${this._endereco.padEnd(20)} | ${this._telefone.padEnd(12)}`;
  }
}
