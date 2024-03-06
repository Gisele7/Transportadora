import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});
export async function GetEntradasNaoIniciadas(){
    return await Api.get('Rastreio/GetEntradasNaoIniciadas')
}

export async function GetRastreio(codEntrada){
    return await Api.get(`Rastreio/GetRastreio?codEntrada=${codEntrada}`)
}
    
export async function GetMapa(codEntrada){
    return await Api.get(`Rastreio/GetMapa?codEntrada=${codEntrada}`)
}

export async function GetEntradasPorCliente(cpfCnpj){
    return await Api.get(`Rastreio/GetEntradasPorCliente?CPFCNPJ=${cpfCnpj}`)
}





