import axios from 'axios';

// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CreateCliente(cliente){
    return await Api.post('Cliente/CreateCliente', cliente)
}


export async function EditCliente(cliente){
    return await Api.put('Cliente/EditCliente', cliente)
}

export async function GetClientes(){
    return await Api.get('Cliente/GetClientes')
}


export async function PesquisarCliente(nome, telefone, cpf){
    return await Api.get(`Cliente/Pesquisar?nome=${nome}&telefone=${telefone}&cpf=${cpf}`)
}

export async function SelecionaCliente(codCliente){
    return await Api.get(`Cliente/SelecionaCliente?codCliente=${codCliente}`)
}


