import axios from 'axios';

// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CreatePickUp(pickup){
     return await Api.post('PickUp/CreatePickUp', pickup)
}

export async function GetClientes(){
    return await Api.get('Cliente/GetClientes')
}

export async function GetEntregadores(){
    return await Api.get('Entregadores/GetEntregadores')
}
export async function GetUnidades(){
    return await Api.get('Unidades/GetUnidades')
}

export async function SelecionaEndereco(codCliente){
    return await Api.get(`Pickup/SelecionaEndereco?codCliente=${codCliente}`)
}

export async function SelecionaEnderecoUnidade(codUnidade){
    return await Api.get(`Unidades/SelecionaEndereco?codUnidade=${codUnidade}`)
}
