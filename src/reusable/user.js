

export const getToken = () => {
    return localStorage.getItem("admin_token");
}

export const getAdminDetails = () => {
    return localStorage.getItem("admin_data");
}

export const removeAdminDetails = () => {
    return localStorage.removeItem("admin_data");
}

export const removeToken = () => {
    return localStorage.removeItem("admin_token");
}
