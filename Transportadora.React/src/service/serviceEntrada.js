import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"

var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});
export async function GetClientes(){
    return await Api.get('Cliente/GetClientes');
}

export async function GetUnidades(){
    return await Api.get('Unidades/GetUnidades')
}

export async function GetPickUp(codCliente){
    return await Api.get(`PickUp/GetPickUp?codCliente=${codCliente}`)
}

export async function GetEnderecoCliente(codCliente){

    return await Api.get(`Cliente/SelecionaEndereco?codCliente=${codCliente}`)
}
export async function GetCliente(codCliente){

    return await Api.get(`Cliente/SelecionaCliente?codCliente=${codCliente}`)
}
export async function GetEnderecoUnidade(codUnidade){
    return await Api.get(`Unidades/SelecionaEndereco?codUnidade=${codUnidade}`)
}

export async function GetEntradas(){
    return await Api.get(`Entradas/GetEntradas`)
}
export async function CreateEntrada(entrada){
    return await Api.post('Entradas/Create', entrada )
}

export async function EditEntrada(entrada){
    return await Api.post('Entradas/Edit', entrada )
}


export async function PesquisarEntrada(codCliente = 0, codUnidade = 0){
    return await Api.get(`Entradas/Pesquisar?codCliente=${codCliente}&codUnidade=${codUnidade}`)
}

export async function SelecionarEntrada(codEntrada){
    return await Api.get(`Entradas/SelecionaEntrada?codEntrada=${codEntrada}`);
}


