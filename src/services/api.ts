import axios from 'axios';

const api = axios.create({
    baseURL: 'https://proffyserver-nlw2.herokuapp.com/',
});

export default api;