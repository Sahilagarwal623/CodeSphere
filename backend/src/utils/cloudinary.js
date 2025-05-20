import {v2 as cloudinary} from 'cloudinary';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(filepath) {


    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(filepath, {
            folder: 'users'
        })
        .catch((error) => {
            console.log(error);
        });

    return {
        secure_url: uploadResult.secure_url,
        image_id: uploadResult.public_id,
    }
}

async function deleteFile(public_id) {
    await cloudinary.uploader
        .destroy(public_id)
        .then(result => console.log(result));
}

export { uploadImage, deleteFile };