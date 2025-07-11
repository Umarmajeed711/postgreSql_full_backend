
import { v2 as cloudinary } from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';

cloudinary.config({ 
        cloud_name: process.env.Cloud_name, 
        api_key:  process.env.Api_key, 
        api_secret: process.env.Api_secret
    });


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'test-images',
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    format: async (req, file) => 'png', // supports promises as well

  },
});

export{
    cloudinary,
    storage
}