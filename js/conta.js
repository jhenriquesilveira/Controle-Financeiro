import { Storage } from "./storage.js"

export class Conta{
    constructor({id, nome, tipo, saldo = 0}){
        this.id = id
        this.nome = String(nome).trim()
        this.tipo = tipo
        this.saldo = Number(saldo)
    }

    static buscar(id){
        const contas = Storage.recuperar("contas")
        return contas.find(contas => contas.id === id)
    }

   static excluirConta(id){        
        const contas = Storage.recuperar("contas")
        const contas_atualizadas = contas.filter(conta => conta.id !== id)
        Storage.salvar("contas", contas_atualizadas)    
    }

    static salvarConta(nome, tipo){
        const contas = Storage.recuperar("contas")
        const conta = {
            id: Date.now(),
            nome: nome,
            tipo: tipo,
            saldo: 0
        }
        contas.push(conta)
        Storage.salvar("contas", contas)
        alert("Conta salva com sucesso!")
    }

    static atualizarConta(id, nome, tipo){
        const contas = Storage.recuperar("contas")
        const conta = contas.find(conta => conta.id === id)

        conta.nome = nome
        conta.tipo = tipo
        Storage.salvar("contas", contas)
    }

    //Atualiza o saldo das contas sempre que ocorre modificação
    static atualizarSaldo(contaId) {
        const contas = Storage.recuperar("contas")
        const lancamentos = Storage.recuperar("lancamentos")
        const conta = contas.find(conta => conta.id === contaId)
        if (!conta) return

        const saldo = lancamentos
            .filter(lancamento => lancamento.contaId === contaId)
            .reduce((total, lancamento) => {
                if (lancamento.tipo === "receita") {
                    return total + lancamento.valor
                }else{
                    return total - lancamento.valor
                }
            }, 0)

        conta.saldo = saldo
        Storage.salvar("contas", contas)
    }
}