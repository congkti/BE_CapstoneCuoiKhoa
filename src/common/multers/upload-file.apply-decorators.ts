import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageLocal } from './upload-local.multer';
import { storageCloud } from './upload-cloud.multer';
import { fileFilter, MAX_FILE_SIZE } from './config.multer';

// decorators Upload File Local
export const DecorUploadLocal = (fieldName: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: storageLocal,
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: fileFilter,
      }),
    ),
  );
};

// decorators Upload File Cloud
export const DecorUploadCloud = (fieldName: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: storageCloud,
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: fileFilter,
      }),
    ),
  );
};
