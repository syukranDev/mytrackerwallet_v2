import { API_PATH } from './apiPaths'
import axiosInstance from './axiosInstance'

export const uploadImage = async (image) => {
    try {
        const formData = new FormData()
        formData.append('image', image)
        const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response.data
    } catch (error) {
        console.error('Error uploading image:', error)
        throw error
    }
}