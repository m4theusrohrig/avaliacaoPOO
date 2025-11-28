// Main.ts
import PromptSync from "prompt-sync";
import Biblioteca from "./Biblioteca";
import Membro from "./Membro";
import Emprestimo from "./Emprestimo";

const teclado = PromptSync();

function submenuLivros(biblioteca: Biblioteca) {
  while (true) {
    console.log("\n=== MENU LIVROS ===");
    console.log("1 - Cadastrar Livro");
    console.log("2 - Listar Livros");
    console.log("3 - Editar Livro");
    console.log("4 - Excluir Livro");
    console.log("0 - Voltar");

    const opt = Number(teclado("Escolha uma opção: "));

    switch (opt) {
      case 1: biblioteca.cadastrarLivro(); break;
      case 2: biblioteca.listarLivros(); break;
      case 3: biblioteca.editarLivro(); break;
      case 4: biblioteca.excluirLivro(); break;
      case 0: return;
      default: console.log("Opção inválida.");
    }
  }
}

function submenuMembros(membrosManager: Membro) {
  while (true) {
    console.log("\n=== MENU MEMBROS ===");
    console.log("1 - Cadastrar Membro");
    console.log("2 - Listar Membros");
    console.log("3 - Editar Membro");
    console.log("4 - Excluir Membro");
    console.log("0 - Voltar");

    const opt = Number(teclado("Escolha uma opção: "));

    switch (opt) {
      case 1: membrosManager.cadastrarMembro(); break;
      case 2: membrosManager.listarMembros(); break;
      case 3: membrosManager.editarMembros(); break;
      case 4: membrosManager.excluirMembros(); break;
      case 0: return;
      default: console.log("Opção inválida.");
    }
  }
}

function submenuEmprestimos(
  emprestimoService: Emprestimo,
  biblioteca: Biblioteca,
  membrosManager: Membro
) {
  while (true) {
    console.log("\n=== MENU EMPRÉSTIMOS ===");
    console.log("1 - Registrar Empréstimo");
    console.log("2 - Registrar Devolução");
    console.log("3 - Listar Empréstimos Ativos");
    console.log("4 - Listar Histórico Completo");
    console.log("0 - Voltar");

    const opt = Number(teclado("Escolha uma opção: "));

    switch (opt) {
      case 1: emprestimoService.emprestarLivro(biblioteca, membrosManager); break;
      case 2: emprestimoService.devolverLivro(biblioteca, membrosManager); break;
      case 3: emprestimoService.listarEmprestimos(biblioteca); break;
      case 4: emprestimoService.listarHistorico(biblioteca); break;
      case 0: return;
      default: console.log("Opção inválida.");
    }
  }
}

function main() {
  const biblioteca = new Biblioteca();
  const membrosManager = new Membro();
  const emprestimoService = new Emprestimo();

  membrosManager.carregarMembros();
  emprestimoService.carregarEmprestimos(biblioteca, membrosManager);

  while (true) {
    console.log("\n=== SISTEMA DE BIBLIOTECA ===");
    console.log("1 - Menu Livros");
    console.log("2 - Menu Membros");
    console.log("3 - Menu Empréstimos");
    console.log("0 - Sair");

    const opt = Number(teclado("Escolha uma opção: "));

    switch (opt) {
      case 1: submenuLivros(biblioteca); break;
      case 2: submenuMembros(membrosManager); break;
      case 3: submenuEmprestimos(emprestimoService, biblioteca, membrosManager); break;
      case 0:
        console.log("\nSalvando dados e saindo...");
        biblioteca.salvarLivros();
        membrosManager.salvarMembros();
        emprestimoService.salvarEmprestimos(biblioteca);
        return;
      default:
        console.log("Opção inválida.");
    }
  }
}

main();
