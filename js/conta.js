import { Storage } from "./storage.js"

export class Conta{
    constructor({id, nome, tipo, saldoInicial = 0}){
        this.id = id
        this.nome = String(nome).trim()
        this.tipo = tipo
        this.saldoInicial = Number(saldoInicial)
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

    static salvarConta(nome, tipo, saldoInicial){
        const contas = Storage.recuperar("contas")
        const conta = {
            id: Date.now(),
            nome: nome,
            tipo: tipo,
            saldoInicial: saldoInicial
        }
        contas.push(conta)
        Storage.salvar("contas", contas)
        alert("Conta salva com sucesso!")
    }

    static atualizarConta(id, nome, tipo, saldoInicial){
        const contas = Storage.recuperar("contas")
        const conta = contas.find(conta => conta.id === id)

        conta.nome = nome
        conta.tipo = tipo
        conta.saldoInicial = saldoInicial

        Storage.salvar("contas", contas)
    }
}