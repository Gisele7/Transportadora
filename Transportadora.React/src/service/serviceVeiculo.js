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

export async function EditVeiculo(veiculo){
    return await Api.put('Veiculo/Edit', veiculo)
}

export async function CreateVeiculo(veiculo){
    return await Api.post('Veiculo/Create', veiculo)
}

export async function GetVeiculos(){
    return await Api.get('Veiculo/GetVeiculos')
}




