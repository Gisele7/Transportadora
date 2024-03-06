import axios from 'axios';
// var baseURL = "https://177-190-80-61.adsnet-telecom.net.br/transportadora"
var baseURL = "https://localhost:63605/"
var url = window.location.href;


const Api = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

export async function PostLogin(usuario){
    return await Api.post('Login/PostLogin', usuario)
    // return await axios.post("https://177.190.80.61/transportadora/Login/PostLogin", usuario)

}

