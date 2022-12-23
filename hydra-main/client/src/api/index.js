import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const insertUser = payload => api.post(`/user`, payload)
export const getAllUsers = () => api.get(`/users`)
export const updateUserById = (id, payload) => api.put(`/user/${id}`, payload)
export const updateNotifSwitch = (id, payload) => api.put(`/user/notif/${id}`, payload)
export const deleteUserById = id => api.delete(`/user/${id}`)
export const getUserById = id => api.get(`/user/${id}`)

export const insertPlant = payload => api.post(`/plant`, payload)
export const getAllPlants = () => api.get(`/plants`)
export const updatePlantById = payload => api.put(`/plant`, payload)
export const deletePlantById = id => api.delete(`/plant/${id}`)
export const getPlantById = (id, payload) => api.get(`/plant/${id}`, payload)

export const userLogin = payload => api.post(`/login`, payload)
export const searchUsers = payload => api.post(`/search-users`, payload)
export const forgotPassword = payload => api.post(`/password-reset/forgot`, payload)
export const validateToken = (id, token, payload) => api.post(`/password-reset/${id}/${token}`, payload)
export const resetPassword = (id, payload) => api.put(`/password-reset/${id}`, payload)

export const insertCrop = payload => api.post(`/crop`, payload)
export const getAllCrops = () => api.get(`/crops`)
export const getCropById = id => api.get(`/crop/${id}`)
export const harvestCrop = (id, payload) => api.put(`/crop/harvest/${id}`, payload)

export const insertNotif = payload => api.post(`/notif`, payload)
export const getAllNotifs = () => api.get(`/notifs`)
export const clearActiveNotifs = () => api.get(`/notifs/clear`)

export const getAllDepartments = () => api.get(`/departments`)


export const getNutrientsAvg = cropId => api.get(`/crop/nutrients/${cropId}`)


export const generatePdf = (cropId, email, fileName) => api.get(`/crop/download/pdf/${cropId}`, {
    headers: {
        'Response-Type': 'blob',
        'Content-Type': 'application/json'
    },
    params : {
        email: email,
        fileName: fileName
    }
})

const apis = {
    insertUser,
    getAllUsers,
    updateUserById,
    updateNotifSwitch,
    deleteUserById,
    getUserById,

    insertPlant,
    getAllPlants,
    updatePlantById,
    deletePlantById,
    getPlantById,

    userLogin,
    searchUsers,
    forgotPassword,
    validateToken,
    resetPassword,

    insertCrop,
    getAllCrops,
    getCropById,
    harvestCrop,

    insertNotif,
    getAllNotifs,
    clearActiveNotifs,

    getAllDepartments,
    getNutrientsAvg,
    generatePdf
}

export default apis