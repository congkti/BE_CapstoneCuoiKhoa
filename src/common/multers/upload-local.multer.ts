import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { createUrlPart, getDateNowString } from '../utils/handle-string.util';
import { users } from '@prisma/client';
import { KEY_LOCAL_FILE, UPLOAD_DIR_LOCAL } from './config.multer';

fs.mkdirSync(`${UPLOAD_DIR_LOCAL}/avatar/`, { recursive: true });
fs.mkdirSync(`${UPLOAD_DIR_LOCAL}/post-homes/`, { recursive: true });

export const storageLocal = diskStorage({
  destination: function (req, file, cb) {
    // check để phân loại thư mục upload file
    if (req.originalUrl.includes('-avatar-')) {
      cb(null, `${UPLOAD_DIR_LOCAL}/avatar/`); // Lưu vào thư mục upload/avatar
    } else if (req.originalUrl.includes('-home-')) {
      cb(null, `${UPLOAD_DIR_LOCAL}/post-homes/`); // Lưu vào thư mục upload/post-homes (cho các ảnh bài đăng)
    } else {
      cb(null, UPLOAD_DIR_LOCAL); // Lưu vào thư mục upload (cho các ảnh còn lại)
    }
  },

  filename: function (req, file, cb) {
    // console.log("req.body >>1", req.body);
    // console.log("req >>2", req.baseUrl);
    // console.log("req >>3", req.originalUrl);
    // console.log("req.user >>", req.user);
    // console.log("file >>", file);
    // console.log(">>>>", req.body);
    const user: users = req.user as users; // Force type users to fix unknow type of req.user
    const uprefix = !req.body.userName
      ? 'uid' + user.user_id
      : req.body.userName;

    const titleAlias = req.body.postTitle
      ? createUrlPart(req.body.postTitle)
      : req.originalUrl.includes('-avatar-')
        ? 'avatar-' + uprefix
        : 'file-upload';
    const dateString = getDateNowString(new Date());

    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Tạo tên file theo tiêu đề bài viết
    const uniqueSuffix = !titleAlias
      ? dateString + '-' + Math.round(Math.random() * 1e9)
      : dateString;
    const fileExtention = path.extname(file.originalname);
    const fileName =
      titleAlias + `_${KEY_LOCAL_FILE}-` + uniqueSuffix + fileExtention;
    cb(null, fileName);
    // console.log(fileName);
  },
});

// Hàm xóa ảnh local
// export const deleteLocalImage = (filename: string) => {
//   const filePath = path.join(UPLOAD_DIR_LOCAL, filename);
export const deleteLocalImage = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Can not delete file ${filePath}: ${err?.message}`);
    } else {
      console.log({ deleted: filePath });
    }
  });
};
// export default storageLocal;

//  file: {
//     fieldname: 'homeImage',
//     originalname: 'metro_hcm.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: 'upload/post-homes/',
//     filename: 'file-upload_@local-23012025230128.jpg',
//     path: 'upload\\post-homes\\file-upload_@local-23012025230128.jpg',
//     size: 2074154
//   }
