import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    const header = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
    const allHeaders = { ...header, ...headers };
    
    return axiosInstance({
        method,
        url,
        data: bodyData ? bodyData : null,
        headers: allHeaders,
        params: params ? params : null,
        withCredentials: true,
    })
}