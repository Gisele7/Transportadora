import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function CreateUsuario(usuario){
    return await Api.post('Usuario/CreateUsuario', usuario)
}
export async function ListarGrupos(){
    return await Api.get('Grupo/Getgrupo');
}
export async function EditUsuario(usuario){
    return await Api.post('Usuario/EditUsuario', usuario)
}

export async function CarregaUsuarios(){
    return await Api.get('Usuario/ListarUsuarios')
}

export async function GetUnidades(){
    return await Api.get('Unidades/GetUnidades')
}