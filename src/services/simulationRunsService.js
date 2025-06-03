import axiosInstance from "interceptor/AuthInterceptor"

const BASE_PATH = "/simulation"

export const getSimulationRuns = async (localityId) => {
    try{
        const response = await axiosInstance.get(`${BASE_PATH}/${localityId}/simulations-runs`)
        return response.data
    }catch(error){
        console.error("Error fetching simulation runs:", error)
        throw error
    }
}