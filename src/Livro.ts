export default class Livro {
  private _titulo: string;
  private _autor: string;
  private _isbn: string;
  private _anoPublicacao: string;
  private _disponivel: boolean;

  constructor(
    titulo: string = "",
    autor: string = "",
    isbn: string = "",
    anoPublicacao: string = "",
    disponivel: boolean = true
  ) {
    this._titulo = titulo;
    this._autor = autor;
    this._isbn = isbn;
    this._anoPublicacao = anoPublicacao;
    this._disponivel = disponivel;
  }

  get titulo(): string {
    return this._titulo;
  }
  set titulo(t: string) {
    this._titulo = t;
  }

  get autor(): string {
    return this._autor;
  }
  set autor(a: string) {
    this._autor = a;
  }

  get isbn(): string {
    return this._isbn;
  }
  set isbn(i: string) {
    this._isbn = i;
  }

  get anoPublicacao(): string {
    return this._anoPublicacao;
  }
  set anoPublicacao(a: string) {
    this._anoPublicacao = a;
  }

  get disponivel(): boolean {
    return this._disponivel;
  }
  set disponivel(d: boolean) {
    this._disponivel = d;
  }

  public apresentarDetalhes(): string {
    const status = this._disponivel ? "Disponível" : "Emprestado";
    return `${this._titulo.padEnd(28)} | ${this._autor.padEnd(25)} | ${this._anoPublicacao.padEnd(9)} | ${status.padEnd(10)}`;
  }
}
