// Popula o localStorage com dados de exemplo na primeira vez que a aplicação é aberta.
// Objetivo: na apresentação do trabalho, ao abrir a página já existem contas,
// categorias e lançamentos prontos para demonstração.
//
// Só roda quando NÃO há nenhum dado salvo — nunca sobrescreve o que o usuário criar.
// Para recarregar os exemplos do zero, rode no console do navegador:  localStorage.clear()

import { Storage } from "./storage.js"
import { Conta } from "./conta.js"

function jaExistemDados() {
    return Boolean(
        localStorage.getItem("contas") ||
        localStorage.getItem("categorias") ||
        localStorage.getItem("lancamentos")
    )
}

// --- Datas relativas ao mês atual, para os exemplos aparecerem sempre "recentes" ---
const hoje = new Date()

function mesReferencia(mesesAtras) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - mesesAtras, 1)
    return { ano: data.getFullYear(), mes: data.getMonth() + 1 }
}

function dataISO({ ano, mes }, dia) {
    const mesFmt = String(mes).padStart(2, "0")
    const diaFmt = String(dia).padStart(2, "0")
    return `${ano}-${mesFmt}-${diaFmt}`
}

const mesAtual = mesReferencia(0)
const mesAnterior = mesReferencia(1)
const doisMesesAtras = mesReferencia(2)

// --- Contas (tipo: corrente | poupanca | carteira | cartao | outro) ---
const CONTAS = [
    { id: 1, nome: "Nubank",         tipo: "corrente", saldo: 0 },
    { id: 2, nome: "Poupança Caixa", tipo: "poupanca", saldo: 0 },
    { id: 3, nome: "Carteira",       tipo: "carteira", saldo: 0 },
    { id: 4, nome: "Tesouro Direto", tipo: "cartao",   saldo: 0 },
]

// --- Categorias (tipo: receita | despesa) ---
const CATEGORIAS = [
    { id: 101, nome: "Salário",     tipo: "receita" },
    { id: 102, nome: "Freelance",   tipo: "receita" },
    { id: 103, nome: "Rendimentos", tipo: "receita" },
    { id: 201, nome: "Moradia",     tipo: "despesa" },
    { id: 202, nome: "Alimentação", tipo: "despesa" },
    { id: 203, nome: "Transporte",  tipo: "despesa" },
    { id: 204, nome: "Lazer",       tipo: "despesa" },
    { id: 205, nome: "Saúde",       tipo: "despesa" },
    { id: 206, nome: "Educação",    tipo: "despesa" },
]

// --- Lançamentos ---
let proximoId = 1001
function lancamento(descricao, valor, tipo, mesRef, dia, categoriaId, contaId, observacao = "") {
    return {
        id: proximoId++,
        descricao,
        valor,
        tipo,
        data: dataISO(mesRef, dia),
        categoriaId,
        contaId,
        observacao,
    }
}

const LANCAMENTOS = [
    // ---------- Mês atual ----------
    lancamento("Salário", 4200.00, "receita", mesAtual, 5, 101, 1),
    lancamento("Projeto freelance - site", 850.00, "receita", mesAtual, 12, 102, 1, "Cliente da faculdade"),
    lancamento("Rendimento poupança", 47.30, "receita", mesAtual, 1, 103, 2),
    lancamento("Aluguel", 1350.00, "despesa", mesAtual, 6, 201, 1),
    lancamento("Supermercado", 620.45, "despesa", mesAtual, 8, 202, 1),
    lancamento("Feira", 90.00, "despesa", mesAtual, 15, 202, 3),
    lancamento("Combustível", 280.00, "despesa", mesAtual, 10, 203, 1),
    lancamento("Uber", 63.90, "despesa", mesAtual, 18, 203, 3),
    lancamento("Cinema", 96.00, "despesa", mesAtual, 20, 204, 3),
    lancamento("Farmácia", 134.70, "despesa", mesAtual, 14, 205, 1),
    lancamento("Curso de JavaScript", 49.90, "despesa", mesAtual, 3, 206, 1),

    // ---------- Mês anterior ----------
    lancamento("Salário", 4200.00, "receita", mesAnterior, 5, 101, 1),
    lancamento("Projeto freelance - logo", 500.00, "receita", mesAnterior, 22, 102, 1),
    lancamento("Rendimento poupança", 45.10, "receita", mesAnterior, 1, 103, 2),
    lancamento("Aluguel", 1350.00, "despesa", mesAnterior, 6, 201, 1),
    lancamento("Conta de luz", 189.32, "despesa", mesAnterior, 10, 201, 1),
    lancamento("Supermercado", 710.20, "despesa", mesAnterior, 9, 202, 1),
    lancamento("Restaurante", 178.00, "despesa", mesAnterior, 17, 202, 3),
    lancamento("Combustível", 310.00, "despesa", mesAnterior, 11, 203, 1),
    lancamento("Show", 220.00, "despesa", mesAnterior, 25, 204, 1),
    lancamento("Consulta médica", 250.00, "despesa", mesAnterior, 19, 205, 1),

    // ---------- Dois meses atrás ----------
    lancamento("Salário", 4000.00, "receita", doisMesesAtras, 5, 101, 1),
    lancamento("Rendimento poupança", 42.80, "receita", doisMesesAtras, 1, 103, 2),
    lancamento("Aluguel", 1350.00, "despesa", doisMesesAtras, 6, 201, 1),
    lancamento("Supermercado", 655.90, "despesa", doisMesesAtras, 8, 202, 1),
    lancamento("Combustível", 265.00, "despesa", doisMesesAtras, 12, 203, 1),
    lancamento("Academia", 120.00, "despesa", doisMesesAtras, 15, 205, 1),
    lancamento("Livros", 143.60, "despesa", doisMesesAtras, 21, 206, 1),
    lancamento("Projeto freelance - CRUD", 74.30, "despesa", doisMesesAtras, 23, 204, 3),
    lancamento("Lanchonete", 550.00, "receita", doisMesesAtras, 1, 102, 3),
]

function popularDadosExemplo() {
    if (jaExistemDados()) return

    Storage.salvar("contas", CONTAS)
    Storage.salvar("categorias", CATEGORIAS)
    Storage.salvar("lancamentos", LANCAMENTOS)

    // Recalcula o saldo de cada conta a partir dos lançamentos gravados
    CONTAS.forEach(conta => Conta.atualizarSaldo(conta.id))

    console.info("Controle Financeiro: dados de exemplo carregados no localStorage.")
}

popularDadosExemplo()
