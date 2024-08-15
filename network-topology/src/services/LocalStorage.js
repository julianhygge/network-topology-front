import {PROJECT_PREFIX} from 'services/Config'

export const setToken = (token) => {
    localStorage.setItem(PROJECT_PREFIX+'token', token);
}

export const getToken = () => {
    let item = localStorage.getItem(PROJECT_PREFIX + 'token') || "";
    if (item == "" || item == "undefined") { return "" }
    return item;
}

export const setUser = (user) => {
    localStorage.setItem(PROJECT_PREFIX+'hygge_user', user);
}

export const getUser = () => {
    let item = localStorage.getItem(PROJECT_PREFIX + 'hygge_user') || "";
    if (item == "" || item == "undefined") { return "" }
    return item;
}

export const setRole = (role) => {
    localStorage.setItem(PROJECT_PREFIX+'role', role)
}

export const getRole = () => {
    let item = localStorage.getItem(PROJECT_PREFIX + 'role') || ''
    if (item == "" || item == "undefined") { return "" }
    return item;
}

export const setPhoneNumber = (phone_number) => {
    localStorage.setItem(PROJECT_PREFIX+ 'phone_number', phone_number);
}

export const getPhoneNumber = () => {
    let item = localStorage.getItem(PROJECT_PREFIX + 'phone_number') || ''
    if (item == "" || item == "undefined") { return "" }
    return item;
}

export const clear = () => {
    localStorage.clear()
}
 