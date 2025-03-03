import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('kkk', process.env.CLOUDINARY_CLOUD_NAME);
export const uploadOnCloudinary = async (localField) => {
  try {
    if (!localField) return null;

    const response = await cloudinary.uploader.upload(localField, {
      resource_type: 'auto',
    });
    // console.log('res ', response);
    fs.unlinkSync(localField);
    return response;
  } catch (error) {
    fs.unlinkSync(localField);
    console.log(error.message);
    return null;
  }
};

export const deleteOnCloudinary = async (img) => {
  try {
    if (!img) return null;
    await cloudinary.uploader.destroy(img.split('/').pop().split('.')[0]);
    console.log('img deleted successfully');
    // return true;
  } catch (error) {
    console.log(error.message);
    // return false;
  }
};
