import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLOUD_NAME,
} from '../constant/global.constant';
import { users } from '@prisma/client';
import { createUrlPart, getDateNowString } from '../utils/handle-string.util';
import { UPLOAD_DIR_CLOUD } from './config.multer';
import { InternalServerErrorException } from '@nestjs/common';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
  secure: true,
});

export const storageCloud = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // console.log(">>>>", req.body);
    const user = req.user as users; // Force type users to fix unknow type of req.user
    const uprefix = !req.body.userName
      ? 'uid' + user.user_id
      : req.body.userName;

    const titleAlias =
      req.body.postTitle || req.body.homeName || req.body.locationName
        ? createUrlPart(req.body.postTitle) ||
          createUrlPart(req.body.homeName) ||
          createUrlPart(req.body.locationName)
        : req.originalUrl.includes('-avatar-')
          ? 'avatar-' + uprefix
          : 'file-upload';

    const dateString = getDateNowString(new Date());
    // Tạo tên file theo tiêu đề bài viết
    const uniqueSuffix = !titleAlias
      ? dateString + '-' + Math.round(Math.random() * 1e9)
      : dateString;
    // const fileExtention = path.extname(file.originalname);
    // const fileName = titleAlias + "_@" + uniqueSuffix + fileExtention;
    const fileName = titleAlias + '_' + uniqueSuffix; // cloudinary ko cần extention

    if (req.originalUrl.includes('-avatar-')) {
      return {
        folder: `${UPLOAD_DIR_CLOUD}/avatar`,
        public_id: fileName,
      };
    } else if (req.originalUrl.includes('-home-')) {
      return {
        folder: `${UPLOAD_DIR_CLOUD}/post-homes`,
        public_id: fileName,
      };
    } else if (req.originalUrl.includes('-location-')) {
      return {
        folder: `${UPLOAD_DIR_CLOUD}/post-locations`,
        public_id: fileName,
      };
    } else {
      return {
        folder: UPLOAD_DIR_CLOUD,
        public_id: fileName,
      };
    }
  },
});

// Hàm xóa ảnh cloud
export const deleteCloudImage = async (publicId: any) => {
  console.log({ publicId });
  if (!publicId) {
    console.log({ publicId });
    return true;
  }

  const data = await cloudinary.uploader.destroy(publicId);
  console.log({ data });

  if (data?.result === `ok`) {
    console.log({ deleted: publicId });
    return true;
  } else {
    console.log(
      `Can not delete file ${publicId} on Cloudinary: ${data?.error.message}`,
    );
    throw new InternalServerErrorException(
      `Can not delete file ${publicId} on Cloudinary: ${data?.error.message}`,
    );
  }
};

// export default storageCloud;

// file: {
//     fieldname: 'homeImage',
//     originalname: 'metro_hcm.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     path: 'https://res.cloudinary.com/congkti/image/upload/v1737648313/bai-tap/post-homes/file-upload_23012025230459.jpg',
//     size: 2074154,
//     filename: 'bai-tap/post-homes/file-upload_23012025230459'
//   }
