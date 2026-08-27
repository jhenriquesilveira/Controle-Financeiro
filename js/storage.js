export class Storage{
    static salvar(chave, dados){
        localStorage.setItem(chave, JSON.stringify(dados))
    }

    static recuperar (chave, padrao = []){
        const dados = localStorage.getItem(chave)

        if (!dados){
            return padrao
        }

        try{
            return JSON.parse(dados)
        }catch{
            return padrao
        }
    }

    static remover(chave){
        localStorage.removeItem(chave)
    }
}