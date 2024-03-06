import axios from 'axios';

// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function GetUnidades(){
    return await Api.get('Unidades/GetUnidades')
}

export async function GetNumeroRastreio(){
    return await Api.get('Transporte/GetNumeroRastreio')
}

export async function CreateMovimentacao(movimentacao){
    return await Api.post(`Movimentacao/CreateMovimentacao`, movimentacao)
}

export async function GetEntregadoresPorUnidade(codUnidade){
    return await Api.get(`Entregadores/ListarEntregadoresPorUnidade?codUnidade=${codUnidade}`)
}

export async function GetMovimentacao(codRastreio){
    return await Api.get(`Movimentacao/BuscarMovimentacao?codRastreio=${codRastreio}`)
}

export async function BuscarUltimaRota(rastreio, codUnidade){
    return await Api.get(`Movimentacao/BuscarUltimaRota?rastreio=${rastreio}&codUnidade=${codUnidade}`)
}




