import { BadRequestException } from '@nestjs/common';
import { INVALID_FILE_FORMAT } from '../constant/global.constant';

export const UPLOAD_DIR_LOCAL = 'upload';
export const KEY_LOCAL_FILE = '@local';
export const UPLOAD_DIR_CLOUD = 'bai-tap';
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // // thay đổi fileSize (MB) => chỉnh lại message trong global.constant (LIMITED_FILE_SIZE)
// export const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const ALLOWED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
export const fileFilter = (req: any, file: any, cb: any) => {
  if (ALLOWED_FORMATS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(INVALID_FILE_FORMAT), false);
  }
};
