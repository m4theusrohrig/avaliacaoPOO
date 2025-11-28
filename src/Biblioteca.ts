import PromptSync from "prompt-sync";
import Livro from "./Livro";
import Membro from "./Membro";
import fs from "fs";

const teclado = PromptSync();

export default class Biblioteca {
  private _livros: Livro[] = [];
  private _historico: { membro: Membro; livro: Livro; dataLocacao: string; dataDevolucao: string }[] = [];
  private _emprestimos: Livro[] = [];

  constructor() {
    this._livros = [];
    this._historico = [];
    this._emprestimos = [];
    this.carregarLivros();
  }

  get livros(): Livro[] { return this._livros; }
  set livros(livros: Livro[]) { this._livros = livros; }

  get historico() { return this._historico; }
  set historico(h) { this._historico = h; }

  get emprestimos(): Livro[] { return this._emprestimos; }
  set emprestimos(e) { this._emprestimos = e; }

  // Cadastra Livros no sistema
  cadastrarLivro(): void {
    console.log();
    console.log(`=== Cadastro de Livros ===`);
    const titulo = teclado(`Título: `).trim();
    const autor = teclado(`Autor: `).trim();
    const isbn = teclado(`ISBN: `).trim();
    const ano = teclado(`Ano de Publicação: `).trim();

    if (!titulo || !autor || !isbn || !ano) { console.log("❌ Todos os campos são obrigatórios."); return; }
    if (this.livros.some((l) => l.isbn === isbn)) { console.log(`❌ ISBN já cadastrado.`); return; }

    const novoLivro = new Livro(titulo, autor, isbn, ano, true);
    this.livros.push(novoLivro);
    this.salvarLivros();
    console.log(`\n🎉 Livro "${titulo}" cadastrado com sucesso!`);
  }

  // Puxa os livros cadastrados
  listarLivros(): void {
    console.log();
    console.log(`=== Lista de Livros Cadastrados (${this.livros.length}) ===`);
    console.log("==========================================================================================================");
    console.log(`ISBN              | Título                           | Autor                     | Ano Publ. | Status`);
    console.log("==========================================================================================================");
    if (this.livros.length === 0) { console.log("Nenhum livro cadastrado."); }
    else { this.livros.forEach((livro) => { console.log(`${livro.isbn.padEnd(9)} | ${livro.apresentarDetalhes()}`); }); }
    console.log("==========================================================================================================");
  }

  // Exclui livros 
  excluirLivro(): void {
    console.log();
    console.log(`=== Exclusão de Livros ===`);
    if (this.livros.length === 0) { console.log(`❌ Nenhum livro cadastrado.`); return; }
    this.listarLivros();
    const isbn = teclado("Digite o ISBN do livro para excluir: ").trim();
    const indice = this.livros.findIndex((l) => l.isbn === isbn);
    if (indice === -1) { console.log(`❌ Livro não encontrado.`); return; }
    if (!this.livros[indice].disponivel) { console.log(`❌ Erro: O livro está emprestado e não pode ser excluído.`); return; }
    const titulo = this.livros[indice].titulo;
    this.livros.splice(indice, 1);
    this.salvarLivros();
    console.log(`\n🗑️ Livro "${titulo}" excluído com sucesso.`);
  }


  // Edita livros
  editarLivro(): void {
    console.log();
    if (this.livros.length === 0) { console.log(`❌ Nenhum livro cadastrado.`); return; }
    this.listarLivros();
    const isbn = teclado("Digite o ISBN do livro para editar: ").trim();
    const livro = this.livros.find((L) => L.isbn === isbn);
    if (!livro) { console.log(`❌ Livro não encontrado.`); return; }
    console.log(`\nLivro encontrado:\nTítulo: ${livro.titulo}\nAutor: ${livro.autor}\nAno: ${livro.anoPublicacao}\n`);
    console.log("1 - Título\n2 - Autor\n3 - Ano de Publicação\n4 - Cancelar");
    const opcao = Number(teclado("Selecione uma opção: "));
    switch (opcao) {
      case 1: livro.titulo = teclado("Novo Título: ").trim(); break;
      case 2: livro.autor = teclado("Novo Autor: ").trim(); break;
      case 3: livro.anoPublicacao = teclado("Novo Ano: ").trim(); break;
      case 4: console.log("Edição cancelada."); return;
      default: console.log("Opção inválida."); return;
    }
    this.salvarLivros();
    console.log(`\n✅ Livro atualizado com sucesso!`);
  }


  // Salva os livros em txt
  salvarLivros(): void {
    try {
      const data = this.livros.map((l) => ({ titulo: l.titulo, autor: l.autor, isbn: l.isbn, anoPublicacao: l.anoPublicacao, disponivel: l.disponivel }));
      fs.writeFileSync("livros.txt", JSON.stringify(data, null, 2), "utf-8");
    } catch (err) { console.error("Erro ao salvar os livros:", err); }
  }

  // Carrega os livros que estão salvos no txt
  carregarLivros(): void {
    try {
      if (!fs.existsSync("livros.txt")) return;
      const dados = JSON.parse(fs.readFileSync("livros.txt", "utf-8"));
      this.livros = dados.map((info: any) => {
        const livro = new Livro();
        livro.titulo = info.titulo; livro.autor = info.autor; livro.isbn = info.isbn; livro.anoPublicacao = info.anoPublicacao; livro.disponivel = info.disponivel;
        return livro;
      });
    } catch (err) { console.error("Erro ao carregar os livros:", err); }
  }
}
