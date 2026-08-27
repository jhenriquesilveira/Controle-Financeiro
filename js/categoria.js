import { Storage } from "./storage.js"

export class Categoria{
    constructor({id, nome, tipo}){
        this.id = id
        this.nome = String(nome).trim()
        this.tipo = tipo
    }

    static buscar(id){
        const categorias = Storage.recuperar("categorias")
        return categorias.find(categorias => categorias.id === id)
    }

   static excluirCategoria(id){        
        const categorias = Storage.recuperar("categorias")
        const categorias_atualizadas = categorias.filter(categorias => categorias.id !== id)
        Storage.salvar("categorias", categorias_atualizadas)    
    }

    static salvarCategoria(nome, tipo){
        const categorias = Storage.recuperar("categorias")
        const categoria = {
            id: Date.now(),
            nome: nome,
            tipo: tipo            
        }
        categorias.push(categoria)
        Storage.salvar("categorias", categorias)
        alert("Categoria salva com sucesso!")
    }

    static atualizarCategorias(id, nome, tipo){
        const categorias = Storage.recuperar("categorias")
        const categoria = categorias.find(categorias => categorias.id === id)

        categoria.nome = nome
        categoria.tipo = tipo        

        Storage.salvar("categorias", categorias)
    }
}