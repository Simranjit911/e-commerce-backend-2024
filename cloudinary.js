import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();
cloudinary.config({
  cloud_name: 'di5nmtbi1',
  api_key: '238376317584896',
  api_secret: '-_mH_lhK1vex4BIf93UXE80T1TE',
  secure: true,
});


const uploadFile = async (file) => {
  const image = await cloudinary.v2.uploader.upload(file, { folder: 'avatars' })
  return image;
};

export { uploadFile, cloudinary };
