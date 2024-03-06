import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CreateGrupo(grupo){
    return await Api.post('Grupo/CreateGrupo', grupo)
}
export async function ListarGrupos(){
    return await Api.get('Grupo/GetGrupo');
}
export async function EditGrupo(grupo){
    return await Api.put('Grupo/EditGrupo', grupo)
}
export async function DeleteGrupo(codGrupo){
    return await Api.delete(`Grupo/Delete?codGrupo=${codGrupo}`)
}
