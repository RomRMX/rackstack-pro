import { supabase } from '../lib/supabaseClient'

/**
 * Uploads an image file to the 'rack-images' bucket
 * @param {File} file - The image file to upload
 * @returns {Promise<{ url: string, error: object }>} - The public URL of the uploaded image or an error
 */
export async function uploadRackImage(file) {
    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('rack-images')
            .upload(filePath, file)

        if (uploadError) {
            throw uploadError
        }

        const { data } = supabase.storage
            .from('rack-images')
            .getPublicUrl(filePath)

        return { url: data.publicUrl, error: null }
    } catch (error) {
        console.error('Error uploading image:', error)
        return { url: null, error }
    }
}
