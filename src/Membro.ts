import PromptSync from "prompt-sync";
import { Pessoa } from "./Pessoa";
import fs from "fs";

const teclado = PromptSync();

export default class Membro extends Pessoa {
  private _matricula: number;
  private _membros: Membro[] = [];
  public dividas: string[] = [];

  constructor(nome: string = "", matricula: number = 0) {
    super(nome, "", "");
    this._matricula = matricula;
  }

  get matricula(): number {
    return this._matricula;
  }
  set matricula(m: number) {
    this._matricula = m;
  }

  get membros(): Membro[] {
    return this._membros;
  }
  set membros(m: Membro[]) {
    this._membros = m;
  }

  cadastrarMembro(): void {
    console.log("\n=== Cadastro de Membros ===\n");

    const nome = teclado("Nome: ").trim();
    const endereco = teclado("Endereço: ").trim();
    const telefone = teclado("Telefone: ").trim();

    if (!nome) {
      console.log("❌ Nome obrigatório.");
      return;
    }

    const matricula = Math.floor(Math.random() * 100000) + 1;
    const novo = new Membro(nome, matricula);
    novo.endereco = endereco;
    novo.telefone = telefone;
    novo.dividas = [];

    this._membros.push(novo);
    this.salvarMembros();

    console.log(`\n🎉 Membro "${nome}" cadastrado. Matrícula: ${matricula}`);
  }

  editarMembros(): void {
    console.log("\n=== Edição de Membros ===\n");
    if (this._membros.length === 0) {
      console.log("❌ Nenhum membro cadastrado.");
      return;
    }

    this.listarMembros();
    const matriculaParaEditar = Number(teclado("Digite a matrícula do membro para editar: "));

    const m = this._membros.find((mm) => mm.matricula === matriculaParaEditar);
    if (!m) {
      console.log("❌ Membro não encontrado.");
      return;
    }

    console.log(`\nMembro: ${m.nome} | Endereço: ${m.endereco} | Telefone: ${m.telefone}\n`);
    console.log("1 - Nome\n2 - Endereço\n3 - Telefone\n4 - Cancelar");
    const opcao = Number(teclado("Selecione: "));

    switch (opcao) {
      case 1:
        m.nome = teclado("Novo Nome: ");
        break;
      case 2:
        m.endereco = teclado("Novo Endereço: ");
        break;
      case 3:
        m.telefone = teclado("Novo Telefone: ");
        break;
      case 4:
        console.log("Edição cancelada.");
        return;
      default:
        console.log("Opção inválida.");
        return;
    }

    this.salvarMembros();
    console.log("✅ Membro atualizado.");
  }

  excluirMembros(): void {
    console.log("\n=== Exclusão de Membros ===\n");
    if (this._membros.length === 0) {
      console.log("❌ Nenhum membro cadastrado.");
      return;
    }

    this.listarMembros();
    const matriculaParaExcluir = Number(teclado("Digite a matrícula do membro para excluir: "));

    const idx = this._membros.findIndex((m) => m.matricula === matriculaParaExcluir);
    if (idx === -1) {
      console.log("❌ Membro não encontrado.");
      return;
    }

    const nome = this._membros[idx].nome;
    this._membros.splice(idx, 1);
    this.salvarMembros();
    console.log(`🗑️ Membro ${nome} excluído.`);
  }

  listarMembros(): void {
    console.log(`\n=== Lista de Membros (${this._membros.length}) ===`);
    console.log("==========================================================================");
    console.log(`Matrícula | Nome                       | Endereço              | Telefone   `);
    console.log("==========================================================================");

    if (this._membros.length === 0) {
      console.log("Nenhum membro cadastrado.");
      return;
    }

    this._membros.forEach((m) => {
      console.log(`${String(m.matricula).padEnd(9)} | ${m.apresentarDetalhes()}`);
    });

    console.log("==========================================================================");
  }

  salvarMembros(): void {
    try {
      const data = this._membros.map((m) => ({
        matricula: m.matricula,
        nome: m.nome,
        endereco: m.endereco,
        telefone: m.telefone,
        dividas: m.dividas || []
      }));
      fs.writeFileSync("membros.txt", JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Erro ao salvar membros:", err);
    }
  }

  carregarMembros(): void {
    try {
      if (!fs.existsSync("membros.txt")) return;

      const dados = JSON.parse(fs.readFileSync("membros.txt", "utf-8"));
      this._membros = dados.map((it: any) => {
        const m = new Membro(it.nome || "", it.matricula || 0);
        m.endereco = it.endereco || "";
        m.telefone = it.telefone || "";
        m.dividas = it.dividas || [];
        return m;
      });
    } catch (err) {
      console.error("Erro ao carregar membros:", err);
    }
  }
}
