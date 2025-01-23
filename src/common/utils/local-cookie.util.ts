export const setLocalStorage = (key: any, value: any) => {
  const localString = JSON.stringify(value);
  localStorage.setItem(key, localString);
};

export const getLocalStorage = (key: any) => {
  const dataLocal = localStorage.getItem(key);
  return dataLocal ? JSON.parse(dataLocal) : null;
};

export const removeItemLocalStorage = (key: any) => {
  const dataLocal = localStorage.getItem(key);
  return dataLocal ? localStorage.removeItem(key) : false;
};
