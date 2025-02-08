import { SetMetadata } from '@nestjs/common';

export const RESPONSE_METADATA = 'responseMetadata'; // export is required

export const ResponseMetaData = (message: string, code: number = 200) => {
  return SetMetadata(RESPONSE_METADATA, { message, code });
};
