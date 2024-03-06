import axios from 'axios';

const DataAccess = axios.create({
    baseURL: "http://localhost:7113"
})