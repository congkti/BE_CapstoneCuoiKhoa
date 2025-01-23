export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

// cloudinary
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

// err code/message MulterError
// có error code
export const LIMITED_FILE_SIZE =
  'Upload file size exceeds limit. Maximum size allowed is 2MB.';

// lỗi do số file vượt giới hạn set ở thuộc tính limits:{files: maxCount} của multer
export const LIMIT_FILE_COUNT =
  'Number of files exceeded limit. Maximum is 5 files';

// lỗi do số file vượt giới hạn set ở Phương thức .array(("fieldName" , maxCount) HOẶC .fields([{name:'name1',maxCount: num1} , {name:'name2',maxCount: num2} , ...]) của multer
export const LIMIT_UNEXPECTED_FILE =
  'Unexpected file field. Please check your form data.';

// ko có error code
export const INVALID_FILE_FORMAT =
  'Invalid file format. Only JPEG, PNG, GIF and WEBP are allowed.'; // trả lỗi ở cb
export const DEFAULT = 'Multer error occurred.';

// lỗi chung
export const USER_IS_BANNED =
  'User is banned or pending deletion. Please contact site administrator';
export const USER_NOT_EXIST =
  '<User> does not exist. Please login with another user or register a new user';
export const INVALID_USER = 'Invalid email or password';
export const USER_NAME_NOT_AVAILABLE =
  'Username is not available. Please choose another name.';
export const UNIQUE_FIELD_DUPLICATED =
  'The request data sent to server has unique field(s), which duplicated the field stored in the database. Please check your form-data again.';
