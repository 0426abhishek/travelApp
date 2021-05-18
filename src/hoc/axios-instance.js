import axios from 'axios';

//Production Url
const axiosinstance = axios.create({
   baseURL: 'http://188.166.83.201:8080/'
});

// Development Url
// const axiosinstance = axios.create({
//    baseURL: 'http://localhost:8080/'
// });
export default axiosinstance;