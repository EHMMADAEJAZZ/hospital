const url = `https://api.cloudinary.com/v1_1/ddb0djymc/image/upload`;
import axios from 'axios';
const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', 'ecom_product');
  try {
    const response = await axios.post(url, formData, {
      withcredentials: false,
    });
    const data = response?.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export default uploadImage;
