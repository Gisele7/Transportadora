import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function GetNumeroRastreio(){
    return await Api.get('Transporte/GetNumeroRastreio')
}

export async function RegistrarEntrega(registro){
    console.log('service', registro)
    return await Api.post('Movimentacao/RegistrarEntrega', registro)
}