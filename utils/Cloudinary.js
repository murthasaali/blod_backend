import cloudinary from 'cloudinary';

function configCloudinary(){
    cloudinary.v2.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });      
}

export const uploadToCloudinary = async (filePath, folderName) => {
  try {
    
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: folderName,
      resource_type: "auto",
    });
    console.log("result",result);
 
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export default configCloudinary;