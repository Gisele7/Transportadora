import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"

var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CreateUnidade(unidade){
    return await Api.post('Unidades/Create', unidade)
}

export async function GetUnidades(){
    return await Api.get('Unidades/GetUnidades')
}

export async function EditUnidade(unidade){
    return await Api.put('Unidades/EditUnidade', unidade)
}



