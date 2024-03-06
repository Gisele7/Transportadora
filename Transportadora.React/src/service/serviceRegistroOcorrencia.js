import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});
export async function GetTipoOcorrencia(){
    return await Api.get('Ocorrencia/GetTipoOcorrencia');
}

export async function GetResultadoOcorrencia(){
    return await Api.get('Ocorrencia/GetResultadoOcorrencia');
}

export async function GetOcorrencias(){
    return await Api.get('Ocorrencia/GetOcorrencias');
}

export async function GetEntradas(){
    return await Api.get(`Entradas/GetEntradas`)
}

export async function CreateOcorrencia(ocorrencia){
    return await Api.post('Ocorrencia/CreateOcorrencia', ocorrencia)
}
