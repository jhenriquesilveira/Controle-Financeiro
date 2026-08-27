import { Storage } from "./storage.js"
import { Conta } from "./conta.js"
import { Categoria } from "./categoria.js"
import { Lancamento } from "./lancamento.js"

//TELA CONTAS
const btnNovaConta = document.getElementById("btnNovaConta")
if (btnNovaConta) {
    document.getElementById("btnNovaConta").addEventListener("click", () => {
            document.getElementById("contaId").value = "";
            document.getElementById("contaSaldoInicial").value = "0";
            document.getElementById("formConta").reset()
            //código para abrir o modal via programação
            const modalElemento = document.getElementById("modalCadastrarConta")
            const modal = new bootstrap.Modal(modalElemento)
            modal.show()
        });

    document.getElementById("formConta").addEventListener("submit", (event) =>{
        event.preventDefault()
        const id = Number(document.getElementById("contaId").value)
        const nome= document.getElementById("contaNome").value
        const tipo= document.getElementById("contaTipo").value
        const saldoInicial= Number(document.getElementById("contaSaldoInicial").value)

        if (id){
            Conta.atualizarConta(id, nome, tipo, saldoInicial)
        }else{
            Conta.salvarConta(nome, tipo, saldoInicial)
        }
            
        listarContas()
        const modalElemento = document.getElementById("modalCadastrarConta");
        const modal = bootstrap.Modal.getInstance(modalElemento);
        modal.hide()
        document.getElementById("formConta").reset()
    })

    function listarContas(){
        const contas = Storage.recuperar("contas")  || []
        const divLista = document.getElementById("listaContas")

        divLista.innerHTML = ""
        contas.forEach(conta => {
            divLista.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div>
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <div class="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center ms-3"
                                        style="width: 55px; height: 55px;">
                                        <i class="bi ${obterIconeConta(conta.tipo)} fs-4"></i>
                                    </div>
                                    <div>
                                        <button class="btn btn-sm btn-outline-primary me-1" data-edit-conta="${conta.id}">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" data-delete-conta="${conta.id}">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="ms-3 flex-grow-1">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5 class="fw-bold mb-1">
                                            ${conta.nome}
                                        </h5>                                    
                                    </div>           
                                    <p class="text-secondary mb-4">
                                        ${conta.tipo}
                                    </p>                                
                                    <p class="text-secondary mb-1">Saldo atual:</p>
                                    <h4 class="fw-bold text-success mb-0">
                                        R$ ${conta.saldoInicial.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2
                                        })}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });

        configurarEventosContas()
    }

    function obterIconeConta(tipo) {
        const icones = {
            corrente: "bi-bank",
            poupanca: "bi-piggy-bank",
            carteira: "bi-wallet2",
            cartao: "bi-credit-card",
            outro: "bi-wallet"
        };
        return icones[tipo] || "bi-wallet";
    }

    function configurarEventosContas(){
        const bEditar = document.querySelectorAll("[data-edit-conta]")
        const bExcluir = document.querySelectorAll("[data-delete-conta]")

        bEditar.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.editConta)            
                editarConta(id)            
            })
        })

        bExcluir.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.deleteConta)
                const confirmar = confirm("Tem certeza de que deseja excluir esta conta?")
                if(!confirmar){
                    return} else{
                    Conta.excluirConta(id)
                    listarContas()
                }            
            })
        })
    }

    function editarConta(id){
        const conta = Conta.buscar(id)
        if (!conta){return}

        document.getElementById("contaId").value = conta.id
        document.getElementById("contaNome").value = conta.nome
        document.getElementById("contaTipo").value = conta.tipo
        document.getElementById("contaSaldoInicial").value = conta.saldoInicial  
        const modalElemento = document.getElementById("modalCadastrarConta")
        const modal = new bootstrap.Modal(modalElemento)
        modal.show()  
    }
    listarContas()
}

//TELA CATEGORIAS
const btnNovaCategoria = document.getElementById("btnNovaCategoria")

if (btnNovaCategoria) {
    document.getElementById("btnNovaCategoria").addEventListener("click", () => {
        document.getElementById("formCategorias").reset()
        const modalElemento = document.getElementById("modalCategoria")
        const modal = new bootstrap.Modal(modalElemento)
        modal.show()
    })
    
    document.getElementById("formCategorias").addEventListener("submit", (event) =>{
        event.preventDefault()
        const id = Number(document.getElementById("categoriaId").value)
        const nome= document.getElementById("categoriaNome").value
        const tipo= document.getElementById("categoriaTipo").value
        
        if (id){
            Categoria.atualizarCategorias(id, nome, tipo)
        }else{
            Categoria.salvarCategoria(nome, tipo)
        }
            
        listarCategorias()
        const modalElemento = document.getElementById("modalCategoria");
        const modal = bootstrap.Modal.getInstance(modalElemento);
        modal.hide()
        document.getElementById("formCategorias").reset()
    })

    function listarCategorias(){
        const categorias = Storage.recuperar("categorias") || []
        const listaReceitas = document.getElementById("listaCategoriasReceitas")
        const listaDespesas = document.getElementById("listaCategoriasDespesas")

        listaReceitas.innerHTML = ""
        listaDespesas.innerHTML = ""

        categorias.forEach(categoria =>{
            const categoriaHTML = `
                <div class="d-flex align-items-center justify-content-between border-bottom py-3">
                    <div class="d-flex align-items-center">                        
                        <div>
                            <span><i class="bi bi-tag me-2 text-secondary"></i>${categoria.nome}</span>                                                        
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-1" data-edit-categoria="${categoria.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" data-delete-categoria="${categoria.id}"><i class="bi bi-trash"></i></button>
                    </div>
                 </div>
            `
            if (categoria.tipo === "receita"){
                listaReceitas.innerHTML += categoriaHTML
            }else if (categoria.tipo === "despesa"){
                listaDespesas.innerHTML += categoriaHTML
            }
        })
        
        configurarEventosCategorias()
    }

    function configurarEventosCategorias(){
        const bEditar = document.querySelectorAll("[data-edit-categoria]")
        const bExcluir = document.querySelectorAll("[data-delete-categoria]")

        bEditar.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.editCategoria)            
                editCategoria(id)            
            })
        })

        bExcluir.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.deleteCategoria)
                const confirmar = confirm("Tem certeza de que deseja excluir esta categoria?")
                if(!confirmar){
                    return} else{
                    Categoria.excluirCategoria(id)
                    listarCategorias()
                }            
            })
        })
    }

    function editCategoria(id){
        const categoria = Categoria.buscar(id)
        if (!categoria){return}

        document.getElementById("categoriaId").value =  categoria.id
        document.getElementById("categoriaNome").value = categoria.nome
        document.getElementById("categoriaTipo").value = categoria.tipo         
        const modalElemento = document.getElementById("modalCategoria")
        const modal = new bootstrap.Modal(modalElemento)
        modal.show()  
    }
    listarCategorias()
}

//TELA PRINCIPAL
const formDashboardLancamento = document.getElementById("formDashboardLancamento")
if (formDashboardLancamento) {    
    function carregarCategoriasPorTipo() {

        const tipo = document.getElementById("dashTipo").value
        const categorias = Storage.recuperar("categorias")
        const selectCategoria = document.getElementById("dashCategoria")
        selectCategoria.innerHTML = `<option value="">Selecione</option>`

        categorias
            .filter(categoria => categoria.tipo === tipo)
            .forEach(categoria => {
                selectCategoria.innerHTML += `<option value="${categoria.id}">${categoria.nome}</option>`
            })
    }

    document.getElementById("dashTipo").addEventListener("change", () => {        
        carregarCategoriasPorTipo()
    })

    function carregarContas() {

        const contas = Storage.recuperar("contas")
        const selectConta = document.getElementById("dashConta")
        selectConta.innerHTML = `<option value="">Selecione</option>`

        contas.forEach(conta => {
            selectConta.innerHTML += `<option value="${conta.id}">${conta.nome}</option>`
        })
    }

    

    formDashboardLancamento.addEventListener("submit", (event) => {
        event.preventDefault()

        const data = document.getElementById("dashData").value
        const descricao = document.getElementById("dashDescricao").value
        const valor = Number(document.getElementById("dashValor").value)
        const tipo = document.getElementById("dashTipo").value
        const categoriaId = Number(document.getElementById("dashCategoria").value)
        const contaId = Number(document.getElementById("dashConta").value)
        
        Lancamento.salvarLancamento(descricao, valor, tipo, data, categoriaId, contaId)
        formDashboardLancamento.reset()
        document.getElementById("dashData").valueAsDate = new Date()
        carregarUltimosLancamentos()
        carregarTotaisMes()
    })

    function carregarMeses(){

        const selectMes = document.getElementById("formDashboardmes")
        
        if (!selectMes) return
        
        const hoje = new Date()
        const anoAtual = hoje.getFullYear()
        const mesAtual = hoje.getMonth()

        const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

        selectMes.innerHTML = ""
        nomesMeses.forEach((nomeMes, indice) => {
            const numeroMes = String(indice + 1).padStart(2, "0")
            const option = document.createElement("option")
            option.value = `${anoAtual}-${numeroMes}`
            option.textContent = `${nomeMes}/${anoAtual}`
            selectMes.appendChild(option)
        })

        const numeroMesAtual = String(mesAtual + 1).padStart(2, "0")
        selectMes.value = `${anoAtual}-${numeroMesAtual}`
    }

    function carregarUltimosLancamentos() {
            
        const lancamentos = Storage.recuperar("lancamentos")
        const tabela = document.getElementById("dashboardTabela")
        const mesSelecionado = document.getElementById("formDashboardmes").value

        if (!tabela) return        

        tabela.innerHTML = ""

        const ultimosLancamentos = lancamentos
            .filter(lancamento => lancamento.data.substring(0, 7) === mesSelecionado)
            .sort((a, b) => b.data.localeCompare(a.data))
            .slice(0, 10)

        if (ultimosLancamentos.length === 0) {
            tabela.innerHTML = `
                <tr class = "linha-vazia">
                    <td colspan="7" class="text-center">
                        Nenhum lançamento neste período.
                    </td>
                </tr>`
            return
        }

        ultimosLancamentos.forEach(lancamento => {
            const categoria = Categoria.buscar(lancamento.categoriaId)
            const conta = Conta.buscar(lancamento.contaId)
            const data = new Date(lancamento.data + "T00:00:00")
                .toLocaleDateString("pt-BR")
            const classeValor = lancamento.tipo === "receita" ? "text-success" : "text-danger"
            const sinal = lancamento.tipo === "receita" ? "+" : "-"

            tabela.innerHTML += `
                <tr>
                    <td>${data}</td>
                    <td>${lancamento.descricao}</td>
                    <td>${categoria ? categoria.nome : "Sem categoria"}</td>
                    <td>${conta ? conta.nome : "Sem conta"}</td>
                    <td>${lancamento.tipo}</td>
                    <td class="text-end fw-bold ${classeValor}">${sinal} R$ ${lancamento.valor.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary" data-edit-index="${lancamento.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" data-delete-index="${lancamento.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr> `            
        })
        carregarTotaisMes()
    }

    document.getElementById("formDashboardmes").addEventListener("change", () => {
        carregarUltimosLancamentos()
        carregarTotaisMes()
    })

    function carregarTotaisMes() {

        const selectMes = document.getElementById("formDashboardmes")
        const [ano, mes] = selectMes.value.split("-")
         
        document.getElementById("Receita_total").textContent = Lancamento.totalReceitas(Number(mes), Number(ano)).toFixed(2)
        document.getElementById("Despesa_total").textContent = Lancamento.totalDespesas(Number(mes), Number(ano)).toFixed(2)
        document.getElementById("Saldo_total").textContent = Lancamento.saldo(Number(mes), Number(ano)).toFixed(2)
    }

    function configurarEventosIndex(){
        const bEditar = document.querySelectorAll("[data-edit-index]")
        const bExcluir = document.querySelectorAll("[data-delete-index]")

        bEditar.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.editIndex)            
                editarEvento(id)            
            })
        })

        bExcluir.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.deleteIndex)
                const confirmar = confirm("Tem certeza de que deseja excluir este lançamento?")
                if(!confirmar){
                    return} else{
                    Lancamento.excluirLancamento(id)
                    carregarUltimosLancamentos()
                }            
            })
        })
    }

    function editarConta(id){
        const conta = Conta.buscar(id)
        if (!conta){return}

        document.getElementById("contaId").value = conta.id
        document.getElementById("contaNome").value = conta.nome
        document.getElementById("contaTipo").value = conta.tipo
        document.getElementById("contaSaldoInicial").value = conta.saldoInicial  
        const modalElemento = document.getElementById("modalCadastrarConta")
        const modal = new bootstrap.Modal(modalElemento)
        modal.show()  
    }

    carregarMeses()
    carregarContas()
    carregarUltimosLancamentos()    
    configurarEventosIndex()
}


