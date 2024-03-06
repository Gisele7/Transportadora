import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CreateEntregador(entregador){
    return await Api.post('Entregadores/Create', entregador)
}
export async function ListarEntregadores(){
    return await Api.get('Entregadores/ListarEntregadores');
}
export async function EditEntregador(entregador){
    return await Api.put('Entregadores/Edit', entregador)
}
export async function DeleteEntregador(codEntregador){
    return await Api.delete(`Entregadores/Delete?codEntregador=${codEntregador}`)
}
export async function GetUnidades(){
    return await Api.get('Unidades/GetUnidades')
}
