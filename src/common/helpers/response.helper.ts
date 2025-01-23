// =========[format kết quả trả về cho đẹp]=========

export const responseSuccess = (
  metaData = null,
  message = "OK",
  code = 200
) => {
  return {
    status: "success",
    code,
    message,
    metaData,
    doc: "api.example.com",
  };
};
// EOF =====[format kết quả trả về cho đẹp]=====

export const responseError = (
  message = "Internal Server Error",
  code = 500,
  stack = null
) => {
  return {
    status: `error`,
    code: code,
    message: message,
    stack: stack, //log ra những dòng báo lỗi trên terminal
  };
};
