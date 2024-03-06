import axios from 'axios';

// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});
export async function GetTransportesNaoIniciados(ano, mes){
    return await Api.get(`Home/ListarTransportesNaoIniciados?ano=${ano}&mes=${mes}`)
}

export async function GetEntradasAgendadas(ano, mes){
    return await Api.get(`Entradas/GetEntradasAgendadas?ano=${ano}&mes=${mes}`)
}

export async function GetEntradasIniciadas(ano, mes){
    return await Api.get(`Entradas/GetEntradasIniciadas?ano=${ano}&mes=${mes}`)
}

export async function GetDevolvidos(dados){
    return await Api.post(`Movimentacao/ListarDevolvidos`, dados)
}

export async function GetUtilizacao(dados){
    return await Api.post(`Entradas/ListarClientesMaisUtilizaram`, dados)
}

export async function GetEntradasAnuais(dados){
    return await Api.post(`Entradas/ListarEntradasAnuais`, dados)
}




