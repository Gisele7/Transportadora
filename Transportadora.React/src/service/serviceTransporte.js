import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CarregarEntradas(codUnidade, termo){
    return await Api.get(`Entradas/GetEntradas?codUnidade=${codUnidade}&termo=${termo}`)
}

export async function IniciarTransporte(codEntrada){
    return await Api.get(`Transporte/IniciarTransporte?codEntrada=${codEntrada}`)
}




