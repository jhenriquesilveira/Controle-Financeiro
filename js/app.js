import "./seed.js"
import { Storage } from "./storage.js"
import { Conta } from "./conta.js"
import { Categoria } from "./categoria.js"
import { Lancamento } from "./lancamento.js"

configurarTema()

function carregarContas(idElemento) {

    const contas = Storage.recuperar("contas")
    const selectConta = document.getElementById(idElemento)
    selectConta.innerHTML = `<option value="">Selecione</option>`

    contas.forEach(conta => {
        selectConta.innerHTML += `<option value="${conta.id}">${conta.nome}</option>`
    })
}  

function carregarCategoriasPorTipo(idTipo, idCategoria) {

    const tipo = document.getElementById(idTipo).value
    const categorias = Storage.recuperar("categorias")
    const selectCategoria = document.getElementById(idCategoria)
    selectCategoria.innerHTML = `<option value="">Selecione</option>`

    const categoriasFiltradas = tipo !== "Todos"
        ? categorias.filter(categoria => categoria.tipo === tipo)
        : categorias

    categoriasFiltradas.forEach(categoria => {
        selectCategoria.innerHTML += `<option value="${categoria.id}">${categoria.nome}</option>`
    })
}

function formatarData(data) {
    const [ano, mes, dia] = data.split("-")
    return `${dia}/${mes}/${ano}`
}

function carregarTotaisMes(compMes, receita, despesa, total) {

    const selectMes = document.getElementById(compMes)
    let valorMes = selectMes.value
    
    // Converte para xxxx-xx se vier da tela de relatórios
    if (valorMes.includes("/")) {
        const [mes, ano] = valorMes.split("/")
        valorMes = `${ano}-${mes}`        
    }
    
    const [ano, mes] = valorMes.split("-")
        
    document.getElementById(receita).textContent = Lancamento.totalReceitas(Number(mes), Number(ano)).toFixed(2)
    document.getElementById(despesa).textContent = Lancamento.totalDespesas(Number(mes), Number(ano)).toFixed(2)
    document.getElementById(total).textContent = Lancamento.saldo(Number(mes), Number(ano)).toFixed(2)
}

//Tema claro e escuro
function configurarTema() {

    const btnTema = document.getElementById("btnTema")

    if (!btnTema) return

    const temaSalvo = Storage.recuperar("tema", "light")

    document.documentElement.setAttribute("data-bs-theme", temaSalvo)

    atualizarBotaoTema(btnTema, temaSalvo)

    btnTema.addEventListener("click", () => {

        const temaAtual = document.documentElement.getAttribute("data-bs-theme")

        const novoTema = temaAtual === "dark" ? "light" : "dark"

        document.documentElement.setAttribute("data-bs-theme", novoTema)

        Storage.salvar("tema", novoTema)

        atualizarBotaoTema(btnTema, novoTema)
    })
}

function atualizarBotaoTema(botao, tema) {

    if (tema === "dark") {
        botao.classList.add("dark")
        botao.title = "Mudar para tema claro"
    } else {
        botao.classList.remove("dark")
        botao.title = "Mudar para tema escuro"
    }
}

//TELA CONTAS
const btnNovaConta = document.getElementById("btnNovaConta")
if (btnNovaConta) {
    document.getElementById("btnNovaConta").addEventListener("click", () => {
            document.getElementById("contaId").value = "";            
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
        const saldoInicial= 0

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
                    <div class="card border-0 shadow-sm card-conta">
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
                                    <h4 class="fw-bold text-primary mb-0">
                                        R$ ${conta.saldo.toLocaleString("pt-BR", {
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
        //document.getElementById("contaSaldoInicial").value = conta.saldo  (REMOVIDO)
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
    
    carregarCategoriasPorTipo("dashTipo", "dashCategoria")    

    document.getElementById("dashTipo").addEventListener("change", () => {        
        carregarCategoriasPorTipo("dashTipo", "dashCategoria")
    })

    formDashboardLancamento.addEventListener("submit", (event) => {
        event.preventDefault()

        const id = Number(document.getElementById("lancamentoId").value)
        const data = document.getElementById("dashData").value
        const descricao = document.getElementById("dashDescricao").value
        const valor = Number(document.getElementById("dashValor").value)
        const tipo = document.getElementById("dashTipo").value
        const categoriaId = Number(document.getElementById("dashCategoria").value)
        const contaId = Number(document.getElementById("dashConta").value)
        
        if (id) {
            Lancamento.atualizarLancamento(id, descricao, valor, tipo, data, categoriaId, contaId)
        }else{
            Lancamento.salvarLancamento(descricao, valor, tipo, data, categoriaId, contaId)
        }
        formDashboardLancamento.reset()
        document.getElementById("dashData").valueAsDate = new Date()
        carregarUltimosLancamentos()
        carregarTotaisMes("formDashboardmes", "Receita_total", "Despesa_total", "Saldo_total")
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
            const badgeTipo = lancamento.tipo === "receita" 
                ? `<span class="badge bg-success-subtle text-success fw-normal rounded-2 d-inline-flex align-items-center justify-content-center" style="width: 65px; height: 27px;">Receita</span>`
                : `<span class="badge bg-danger-subtle text-danger fw-normal rounded-2 d-inline-flex align-items-center justify-content-center" style="width: 65px; height: 27px;">Despesa</span>`

            tabela.innerHTML += `
                <tr>
                    <td>${data}</td>
                    <td>${lancamento.descricao}</td>
                    <td>${categoria ? categoria.nome : "Sem categoria"}</td>
                    <td>${conta ? conta.nome : "Sem conta"}</td>
                    <td>${badgeTipo}</td>
                    <td class="text-end fw-bold ${classeValor}">${sinal} R$ ${lancamento.valor.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary" data-edit-index="${lancamento.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" data-delete-index="${lancamento.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr> `            
        })
        carregarTotaisMes("formDashboardmes", "Receita_total", "Despesa_total", "Saldo_total")
        configurarEventosIndex()
    }

    document.getElementById("formDashboardmes").addEventListener("change", () => {
        carregarUltimosLancamentos()
        carregarTotaisMes("formDashboardmes", "Receita_total", "Despesa_total", "Saldo_total")
    })    

    function configurarEventosIndex(){
        const bEditar = document.querySelectorAll("[data-edit-index]")
        const bExcluir = document.querySelectorAll("[data-delete-index]")

        bEditar.forEach(botao =>{
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.editIndex)            
                editarLancamento(id)            
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

    function editarLancamento(id) {

        const lancamento = Lancamento.buscar(id)
        if (!lancamento) {return}
        document.getElementById("lancamentoId").value = lancamento.id
        document.getElementById("dashDescricao").value = lancamento.descricao
        document.getElementById("dashValor").value = lancamento.valor
        document.getElementById("dashTipo").value = lancamento.tipo
        document.getElementById("dashData").value = lancamento.data

        carregarCategoriasPorTipo("dashTipo", "dashCategoria")

        document.getElementById("dashCategoria").value = lancamento.categoriaId
        document.getElementById("dashConta").value = lancamento.contaId
    }

    carregarMeses()
    carregarContas("dashConta")
    carregarUltimosLancamentos()    
    configurarEventosIndex()
    carregarTotaisMes("formDashboardmes", "Receita_total", "Despesa_total", "Saldo_total")
}

//TELA LANÇAMENTOS
const modalLancamento = document.getElementById("modalLancamento")
if (modalLancamento) {   

    //carrega os dados na tela lançamentos
    carregarCategoriasPorTipo("filtroTipo", "filtroCategoria")
    document.getElementById("filtroTipo").addEventListener("change", () => {        
        carregarCategoriasPorTipo("filtroTipo", "filtroCategoria")
    })
    
    carregarContas("filtroConta")
    filtrarLancamentos()

    //Carrega os dados no modal
    document.getElementById("btnNovoLancamento").addEventListener("click", () => {
        document.getElementById("formLancamento").reset()   
        document.getElementById("data").valueAsDate = new Date()    
        carregarContas("conta")
        carregarCategoriasPorTipo("tipo", "categoria")            
        const modal = new bootstrap.Modal(
            document.getElementById("modalLancamento")
        )
        modal.show()
    })

    //Altera as categorias sempre que eu mudar o tipo (Receita/Despesa)
    document.getElementById("tipo").addEventListener("change", () => {
        carregarCategoriasPorTipo("tipo", "categoria")
    })

    document.getElementById("formLancamento").addEventListener("submit", (event) => {            
        event.preventDefault()
        const id = Number(document.getElementById("id").value)
        const descricao = document.getElementById("descricao").value
        const valor = Number(document.getElementById("valor").value)
        const tipo = document.getElementById("tipo").value
        const data = document.getElementById("data").value
        const categoriaId = Number(document.getElementById("categoria").value)
        const contaId = Number(document.getElementById("conta").value)

        if (id) {
            Lancamento.atualizarLancamento(id, descricao, valor, tipo, data, categoriaId, contaId)
        }else{
            Lancamento.salvarLancamento(descricao, valor, tipo, data, categoriaId, contaId)
        }
        
        filtrarLancamentos()   
        event.target.reset()          
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalLancamento"))
        modal.hide()
    })

    document.getElementById("filtroMes").addEventListener("input", (event) => {

        let valor = event.target.value.replace(/\D/g, "")
        // Limita a 6 números
        valor = valor.substring(0, 6)
        // Valida o mês
        if (valor.length >= 2) {
            let mes = Number(valor.substring(0, 2))
            if (mes < 1 || mes > 12) {
                valor = valor.substring(0, 1)
            }
        }
        // Adiciona a barra automaticamente
        if (valor.length > 2) {
            valor = valor.substring(0, 2) + "/" + valor.substring(2)
        }
        event.target.value = valor
    })

    document.getElementById("btnLimparFiltros").addEventListener("click", () =>{
        document.getElementById("filtroBusca").value = ""
        document.getElementById("filtroTipo").value = "Todos"
        document.getElementById("filtroCategoria").value = ""
        document.getElementById("filtroConta").value = ""
        document.getElementById("filtroMes").value = ""

        filtrarLancamentos()
    })

    function filtrarLancamentos() { //monta os filtros

        const busca = document.getElementById("filtroBusca").value.trim().toLowerCase()
        const tipo = document.getElementById("filtroTipo").value
        const categoriaId = document.getElementById("filtroCategoria").value
        const contaId = document.getElementById("filtroConta").value
        const mesAno = document.getElementById("filtroMes").value

        const lancamentos = Storage.recuperar("lancamentos")

        const lancamentosFiltrados = lancamentos.filter(lancamento => {

            // Filtro por descrição
            const correspondeBusca = String(lancamento.descricao ?? "").toLowerCase().includes(busca) ||
            String(lancamento.observacao ?? "").toLowerCase().includes(busca)

            // Filtro por tipo
            const correspondeTipo = tipo === "Todos" || lancamento.tipo === tipo

            // Filtro por categoria
            const correspondeCategoria = categoriaId === "" || lancamento.categoriaId === Number(categoriaId)

            // Filtro por conta
            const correspondeConta = contaId === "" || lancamento.contaId === Number(contaId)

            // Filtro por mês/ano
            let correspondeMes = true
            if (mesAno !== "") {
                const [mes, ano] = mesAno.split("/")
                const dataLancamento = new Date(lancamento.data + "T00:00:00")

                correspondeMes = dataLancamento.getMonth() + 1 === Number(mes) && dataLancamento.getFullYear() === Number(ano)
            }

            return (correspondeBusca && correspondeTipo && correspondeCategoria && correspondeConta && correspondeMes)
        })

        carregarTabelaLancamentos(lancamentosFiltrados)
    }

    function carregarTabelaLancamentos(lancamentos) {

        const tbody = document.getElementById("tabelaLancamentos")
        const categorias = Storage.recuperar("categorias")
        const contas = Storage.recuperar("contas")

        tbody.innerHTML = ""

        lancamentos.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(lancamento => {

            const categoria = categorias.find(categoria => categoria.id === lancamento.categoriaId)

            const conta = contas.find(conta => conta.id === lancamento.contaId)

            const badgeTipo = lancamento.tipo === "receita"
                ? `<span class="badge badge-tipo bg-success-subtle text-success-emphasis rounded-3 py-2 fw-normal">
                    Receita</span>`
                : `<span class="badge badge-tipo bg-danger-subtle text-danger-emphasis rounded-3 py-2 fw-normal">
                    Despesa</span>`

            const valor = lancamento.valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})

            tbody.innerHTML += `
                <tr>
                    <td>${formatarData(lancamento.data)}</td>
                    <td class="fw-semibold">${lancamento.descricao}</td>
                    <td>
                        <span class="badge badge-categoria fw-normal">
                            ${categoria ? categoria.nome : ""}
                        </span>
                    </td>
                    <td>${conta ? conta.nome : ""}</td>
                    <td>${badgeTipo}</td>
                    <td class="text-end ${lancamento.tipo === "receita" ? "text-success" : "text-danger"}">
                        ${lancamento.tipo === "receita" ? "+" : "-"} ${valor}
                    </td>
                    <td class="text-end">
                        <button class="btn btn-outline-primary btn-sm btn-editar-lancamento" data-id="${lancamento.id}">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="btn btn-outline-danger btn-sm btn-excluir-lancamento" data-id="${lancamento.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        configurarBotoesLancamento()
    }

    //captura alterações nos filtros disponíveis
    document.getElementById("filtroBusca").addEventListener("input", filtrarLancamentos)
    document.getElementById("filtroTipo").addEventListener("change", filtrarLancamentos)
    document.getElementById("filtroCategoria").addEventListener("change", filtrarLancamentos)
    document.getElementById("filtroConta").addEventListener("change", filtrarLancamentos)
    document.getElementById("filtroMes").addEventListener("input", filtrarLancamentos)

    function configurarBotoesLancamento() {
        const botoesExcluir = document.querySelectorAll(".btn-excluir-lancamento")
        botoesExcluir.forEach(botao => {
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.id)
                if (confirm("Tem certeza que deseja excluir este lançamento?")) {
                    Lancamento.excluirLancamento(id)
                    filtrarLancamentos()
                }
            })
        })

        document.querySelectorAll(".btn-editar-lancamento").forEach(botao => {
            botao.addEventListener("click", () => {
                const id = Number(botao.dataset.id)
                const lancamento = Lancamento.buscar(id)
                document.getElementById("id").value = lancamento.id
                document.getElementById("descricao").value = lancamento.descricao
                document.getElementById("valor").value = lancamento.valor
                document.getElementById("tipo").value = lancamento.tipo
                document.getElementById("data").value = lancamento.data

                carregarCategoriasPorTipo("tipo", "categoria")
                carregarContas("conta")

                document.getElementById("categoria").value = lancamento.categoriaId
                document.getElementById("conta").value = lancamento.contaId

                const modal = new bootstrap.Modal(document.getElementById("modalLancamento"))
                modal.show()
            })            
        })
    }
}

//TELA RELATÓRIOS
const relMes = document.getElementById("RelatorioFiltroMes")
 
if (relMes) {

        const hoje = new Date()
        const anoAtual = hoje.getFullYear()
        const mesAtual = String(hoje.getMonth() + 1).padStart(2,"0")
        relMes.value = mesAtual + "/" + anoAtual

     relMes.addEventListener("input", (event) => {
        let valor = event.target.value.replace(/\D/g, "")
        // Limita a 6 números
        valor = valor.substring(0, 6)
        // Valida o mês
        if (valor.length >= 2) {
            let mes = Number(valor.substring(0, 2))
            if (mes < 1 || mes > 12) {
                valor = valor.substring(0, 1)
            }
        }
        // Adiciona a barra automaticamente
        if (valor.length > 2) {
            valor = valor.substring(0, 2) + "/" + valor.substring(2)
        }
        event.target.value = valor

        if (valor.length === 7) {
            carregarTotaisMes("RelatorioFiltroMes", "Receita_total_rel", "Despesa_total_rel", "Saldo_total_rel")
            carregarReceitasPorCategoria("RelatorioFiltroMes")
            carregarDespesasPorCategoria("RelatorioFiltroMes")
        }
    })

    
    function carregarDespesasPorCategoria() {

        let valorMes = relMes.value        
        const [mes, ano] = valorMes.split("/")               

        // Busca lançamentos do mês
        const lancamentos = Lancamento.buscarLancamentosPorMes(Number(mes), Number(ano))

        // carrega categorias
        const categorias = Storage.recuperar("categorias")

        // filtra somente as despesas
        const despesas = lancamentos.filter(lancamento => lancamento.tipo === "despesa")

        // Total geral das despesas
        const totalDespesas = despesas.reduce((total, lancamento) => total + Number(lancamento.valor), 0)

        // Cria uma lista com o total de cada categoria
        const despesasPorCategoria = categorias.map(categoria => {
            const despesasCategoria = despesas.filter(lancamento => lancamento.categoriaId === categoria.id)
            const totalCategoria = despesasCategoria.reduce((total, lancamento) => total + Number(lancamento.valor),0)
            return {categoria: categoria, total: totalCategoria}
        }).filter(item => item.total > 0)

        // Ordena as despesas da maior para menor
        despesasPorCategoria.sort((a, b) => b.total - a.total)

        const container = document.getElementById("relCategorias")

        container.innerHTML = ""

        // Se não houver despesas
        if (despesasPorCategoria.length === 0) {
            container.innerHTML = `<p class="text-muted mb-0">Nenhuma despesa neste período.</p>`
            return
        }

        // Percorre as categorias
        despesasPorCategoria.forEach(item => {
            // Calcula o percentual por categoria
            const percentual = totalDespesas > 0
                ? (item.total / totalDespesas) * 100
                : 0

            const percentualAjustado = percentual.toFixed(2)

            container.innerHTML += `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-medium">${item.categoria.nome} ( ${percentualAjustado}% )</span>
                        <span class="fw-bold">R$ ${item.total.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${percentual}%" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            `
        })
    }

    function carregarReceitasPorCategoria() {

        let valorMes = relMes.value        
        const [mes, ano] = valorMes.split("/")               

        // Busca lançamentos do mês
        const lancamentos = Lancamento.buscarLancamentosPorMes(Number(mes), Number(ano))

        // carrega categorias
        const categorias = Storage.recuperar("categorias")

        // filtra somente as despesas
        const receitas = lancamentos.filter(lancamento => lancamento.tipo === "receita")

        // Total geral das despesas
        const totalReceitas = receitas.reduce((total, lancamento) => total + Number(lancamento.valor), 0)

        // Cria uma lista com o total de cada categoria
        const receitasPorCategoria = categorias.map(categoria => {
            const receitasCategoria = receitas.filter(lancamento => lancamento.categoriaId === categoria.id)
            const totalCategoria = receitasCategoria.reduce((total, lancamento) => total + Number(lancamento.valor),0)
            return {categoria: categoria, total: totalCategoria}
        }).filter(item => item.total > 0)

        // Ordena as despesas da maior para menor
        receitasPorCategoria.sort((a, b) => b.total - a.total)

        const container = document.getElementById("relContas")

        container.innerHTML = ""

        // Se não houver despesas
        if (receitasPorCategoria.length === 0) {
            container.innerHTML = `<p class="text-muted mb-0">Nenhuma receita neste período.</p>`
            return
        }

        // Percorre as categorias
        receitasPorCategoria.forEach(item => {
            // Calcula o percentual por categoria
            const percentual = totalReceitas > 0
                ? (item.total / totalReceitas) * 100
                : 0

            const percentualAjustado = percentual.toFixed(2)

            container.innerHTML += `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-medium">${item.categoria.nome} ( ${percentualAjustado}% )</span>
                        <span class="fw-bold">R$ ${item.total.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${percentual}%" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            `
        })
    }

    carregarTotaisMes("RelatorioFiltroMes", "Receita_total_rel", "Despesa_total_rel", "Saldo_total_rel")
    carregarDespesasPorCategoria()
    carregarReceitasPorCategoria()
}
