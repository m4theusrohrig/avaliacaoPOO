import PromptSync from "prompt-sync";
import Livro from "./Livro";
import Membro from "./Membro";
import Biblioteca from "./Biblioteca";
import fs from "fs";
import { stringToDate, dateToString } from "./Util";

const teclado = PromptSync();

export default class Emprestimo {

  emprestarLivro(biblioteca: Biblioteca, membrosManager: Membro): void {
    console.log("\n=== Empréstimo de Livros ===\n");

    if (membrosManager.membros.length === 0) {
      console.log("❌ Nenhum membro cadastrado.");
      return;
    }
    if (biblioteca.livros.length === 0) {
      console.log("❌ Nenhum livro cadastrado.");
      return;
    }

    membrosManager.listarMembros();
    const matricula = Number(teclado("Digite a matrícula do membro: "));
    const membro = membrosManager.membros.find((m) => m.matricula === matricula);

    if (!membro) {
      console.log("❌ Membro não encontrado.");
      return;
    }

    biblioteca.listarLivros();
    const isbn = teclado("Digite o ISBN do livro para emprestar: ").trim();
    const livro = biblioteca.livros.find((l) => l.isbn === isbn);

    if (!livro) {
      console.log("❌ Livro não encontrado.");
      return;
    }
    if (!livro.disponivel) {
      console.log("❌ Livro indisponível.");
      return;
    }

    const dataLocStr = teclado("Digite a data de locação (dd/mm/yyyy) ou enter para hoje: ").trim();
    const dataLoc = dataLocStr ? stringToDate(dataLocStr) : new Date();
    if (dataLocStr && !dataLoc) {
      console.log("❌ Data inválida.");
      return;
    }

    livro.disponivel = false;
    const dataLocFormat = dateToString(dataLoc instanceof Date ? dataLoc : new Date());

    biblioteca.historico.push({
      membro,
      livro,
      dataLocacao: dataLocFormat,
      dataDevolucao: "PENDENTE"
    });

    biblioteca.emprestimos.push(livro);

    biblioteca.salvarLivros();
    this.salvarEmprestimos(biblioteca);

    membro.dividas = membro.dividas || [];
    membro.dividas.push(livro.titulo);
    membrosManager.salvarMembros();

    console.log(`\n✅ Empréstimo registrado. Membro: ${membro.nome} | Livro: ${livro.titulo} | Data: ${dataLocFormat}`);
  }

  devolverLivro(biblioteca: Biblioteca, membrosManager: Membro): void {
    console.log("\n=== Registro de Devolução ===\n");

    const emprestimosAtivos = biblioteca.historico.filter((h) => h.dataDevolucao === "PENDENTE");
    if (emprestimosAtivos.length === 0) {
      console.log("Nenhum empréstimo ativo.");
      return;
    }

    console.log("Empréstimos pendentes:");
    emprestimosAtivos.forEach((h, idx) => {
      console.log(`${idx + 1} - Membro: ${h.membro.nome} | Livro: ${h.livro.titulo} | Locação: ${h.dataLocacao}`);
    });

    const escolha = Number(teclado("Digite o número da locação que deseja devolver: ")) - 1;
    if (isNaN(escolha) || escolha < 0 || escolha >= emprestimosAtivos.length) {
      console.log("Escolha inválida.");
      return;
    }

    const registro = emprestimosAtivos[escolha];

    const dataDevStr = teclado("Digite a data de devolução (dd/mm/yyyy) ou enter para hoje: ").trim();
    const dataDev = dataDevStr ? stringToDate(dataDevStr) : new Date();
    if (dataDevStr && !dataDev) {
      console.log("❌ Data inválida.");
      return;
    }

    registro.dataDevolucao = dateToString(dataDev instanceof Date ? dataDev : new Date());
    registro.livro.disponivel = true;

    biblioteca.emprestimos = biblioteca.emprestimos.filter((l) => l.isbn !== registro.livro.isbn);

    registro.membro.dividas = (registro.membro.dividas || []).filter((t) => t !== registro.livro.titulo);
    membrosManager.salvarMembros();

    biblioteca.salvarLivros();
    this.salvarEmprestimos(biblioteca);

    console.log(`\n✅ Devolução registrada. Livro: ${registro.livro.titulo} | Data: ${registro.dataDevolucao}`);
  }

  listarEmprestimos(biblioteca: Biblioteca): void {
    console.log(`\n=== Empréstimos Ativos (${biblioteca.emprestimos.length}) ===`);
    if (biblioteca.emprestimos.length === 0) {
      console.log("Nenhum livro emprestado.");
      return;
    }

    biblioteca.emprestimos.forEach((livro) => {
      let registroEncontrado = null;

      // 🔄 substituindo findLast()
      for (let i = biblioteca.historico.length - 1; i >= 0; i--) {
        const h = biblioteca.historico[i];
        if (h.livro.isbn === livro.isbn && h.dataDevolucao === "PENDENTE") {
          registroEncontrado = h;
          break;
        }
      }

      const nome = registroEncontrado ? registroEncontrado.membro.nome : "Desconhecido";
      console.log(`${livro.isbn.padEnd(9)} | ${livro.apresentarDetalhes()} | ${nome}`);
    });
  }

  listarHistorico(biblioteca: Biblioteca): void {
    console.log(`\n=== Histórico (${biblioteca.historico.length}) ===`);
    if (biblioteca.historico.length === 0) {
      console.log("Nenhum registro.");
      return;
    }

    biblioteca.historico.forEach((h, idx) => {
      console.log(`${idx + 1} - ${h.dataLocacao} -> ${h.dataDevolucao} | ${h.livro.titulo} | ${h.membro.nome}`);
    });
  }

  salvarEmprestimos(biblioteca: Biblioteca): void {
    try {
      const data = biblioteca.historico.map((h) => ({
        membro: {
          matricula: h.membro.matricula,
          nome: h.membro.nome,
          endereco: h.membro.endereco,
          telefone: h.membro.telefone,
          dividas: h.membro.dividas || []
        },
        livro: {
          titulo: h.livro.titulo,
          autor: h.livro.autor,
          isbn: h.livro.isbn,
          anoPublicacao: h.livro.anoPublicacao,
          disponivel: h.livro.disponivel
        },
        dataLocacao: h.dataLocacao,
        dataDevolucao: h.dataDevolucao
      }));

      fs.writeFileSync("locacoes.txt", JSON.stringify(data, null, 2), "utf-8");

    } catch (err) {
      console.error("Erro ao salvar empréstimos:", err);
    }
  }

  carregarEmprestimos(biblioteca: Biblioteca, membrosManager: Membro): void {
    try {
      if (!fs.existsSync("locacoes.txt")) return;

      const dados = JSON.parse(fs.readFileSync("locacoes.txt", "utf-8"));

      biblioteca.historico = dados.map((it: any) => {
        let membro = membrosManager.membros.find((m) => m.matricula === it.membro.matricula);

        if (!membro) {
          membro = new Membro(it.membro.nome || "", it.membro.matricula || 0);
          membro.endereco = it.membro.endereco || "";
          membro.telefone = it.membro.telefone || "";
          membro.dividas = it.membro.dividas || [];
          membrosManager.membros.push(membro);
        }

        const livro = new Livro();
        livro.titulo = it.livro.titulo || "";
        livro.autor = it.livro.autor || "";
        livro.isbn = it.livro.isbn || "";
        livro.anoPublicacao = it.livro.anoPublicacao || "";
        livro.disponivel = it.livro.disponivel ?? true;

        return {
          membro,
          livro,
          dataLocacao: it.dataLocacao,
          dataDevolucao: it.dataDevolucao
        };
      });

      biblioteca.emprestimos = biblioteca.historico
        .filter((h) => h.dataDevolucao === "PENDENTE")
        .map((h) => {
          const lRef = biblioteca.livros.find((l) => l.isbn === h.livro.isbn);
          return lRef ? lRef : h.livro;
        });

    } catch (err) {
      console.error("Erro ao carregar empréstimos:", err);
    }
  }
}
