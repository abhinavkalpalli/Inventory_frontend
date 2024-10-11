import axios from "axios";
import toast from "react-hot-toast";

export const uploadImageToCloudinary = async (imageFile) => {
    if (!imageFile) {
        throw new Error("No file provided.");
    }
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validImageTypes.includes(imageFile.type)) {
        toast.error('Add files in image format')
        throw new Error("Invalid file type. Only common image formats are allowed.");
    }

    const maxSizeInMB = 10;
    if (imageFile.size > maxSizeInMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeInMB}MB.`);
    }

    const cloud_name = process.env.REACT_APP_CLOUD_NAME;
    
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    
    try {
        const formDataWithImage = new FormData();
        formDataWithImage.append("file", imageFile);
        formDataWithImage.append("upload_preset", "mzydeesi");

        const response = await axios.post(url, formDataWithImage, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
        const imageUrl = response.data.secure_url;
        return imageUrl;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
}
