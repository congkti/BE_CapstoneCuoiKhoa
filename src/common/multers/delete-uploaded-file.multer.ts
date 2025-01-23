import { KEY_LOCAL_FILE, UPLOAD_DIR_CLOUD } from './config.multer';
import { deleteCloudImage } from './upload-cloud.multer';
import { deleteLocalImage } from './upload-local.multer';

const deleteUploadedFile = async (filePath: string) => {
  const isImgLocal = filePath?.includes(KEY_LOCAL_FILE); // check upload local or cloud
  // console.log('image local>>', isImgLocal);
  if (isImgLocal) {
    deleteLocalImage(filePath);
  } else {
    const publicId =
      UPLOAD_DIR_CLOUD + filePath?.split(UPLOAD_DIR_CLOUD)[1]?.split('.')[0];
    deleteCloudImage(publicId);
  }
};

export default deleteUploadedFile;

// https://res.cloudinary.com/congkti/image/upload/v1737648313/bai-tap/post-homes/file-upload_23012025230459.jpg

//       /post-homes/file-upload_23012025230459
