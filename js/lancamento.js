import { Storage } from "./storage.js"

export class Lancamento{
    constructor(id, descricao, valor, tipo, data, categoriaId, contaId) {
        this.id = id
        this.descricao = descricao
        this.valor = valor
        this.tipo = tipo
        this.data = data
        this.categoriaId = categoriaId
        this.contaId = contaId
    }

    static buscar(id) {
        const lancamentos = Storage.recuperar("lancamentos")
        return lancamentos.find(lancamento => lancamento.id === id)
    }

    static salvarLancamento(descricao, valor, tipo, data, categoriaId, contaId) {

        const lancamentos = Storage.recuperar("lancamentos")
        const lancamento = {
            id: Date.now(),
            descricao: descricao,
            valor: valor,
            tipo: tipo,
            data: data,
            categoriaId: categoriaId,
            contaId: contaId
        }
        lancamentos.push(lancamento)
        Storage.salvar("lancamentos", lancamentos)
        alert("Lançamento salvo com sucesso!")
    }

    static atualizarLancamento(id, descricao, valor, tipo, data, categoriaId, contaId) {
        
        const lancamentos = Storage.recuperar("lancamentos")
        const lancamento = lancamentos.find(lancamento => lancamento.id === id)

        if (!lancamento) {return}

        lancamento.descricao = descricao
        lancamento.valor = valor
        lancamento.tipo = tipo
        lancamento.data = data
        lancamento.categoriaId = categoriaId
        lancamento.contaId = contaId

        Storage.salvar("lancamentos", lancamentos)
    }

    static excluirLancamento(id) {
        const lancamentos = Storage.recuperar("lancamentos")
        const lancamentos_atualizados = lancamentos.filter(lancamento => lancamento.id !== id)
        Storage.salvar("lancamentos", lancamentos_atualizados)
    }

    static buscarLancamentosPorMes(mes, ano) {

        const lancamentos = Storage.recuperar("lancamentos")
        return lancamentos.filter(lancamento => {
            const [anoLancamento, mesLancamento] = lancamento.data.split("-")
            return Number(mesLancamento) === mes && Number(anoLancamento) === ano
         })
    }

    static totalReceitas(mes, ano) {

        const lancamentos = this.buscarLancamentosPorMes(mes, ano)
        return lancamentos
            .filter(lancamento => lancamento.tipo === "receita")
            .reduce((total, lancamento) => total + lancamento.valor,0)
    }

    static totalDespesas(mes, ano) {

        const lancamentos = this.buscarLancamentosPorMes(mes, ano)
        return lancamentos
            .filter(lancamento => lancamento.tipo === "despesa")
            .reduce((total, lancamento) => total + lancamento.valor, 0)
    }

    static saldo(mes, ano) {

        const receitas = this.totalReceitas(mes, ano)
        const despesas = this.totalDespesas(mes, ano)
        return receitas - despesas
    }
}