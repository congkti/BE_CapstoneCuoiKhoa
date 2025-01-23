import { removeVietnameseTones } from './vietnamese-tones.util';

// best trim() to clean string
export const cleanString = (str: string) => {
  return str ? str.replace(/\s+/g, ' ').trim() : null;
};

// create url from post title
export const createUrlPart = (name: string) => {
  const urlName = removeVietnameseTones(name)
    ?.trim()
    ?.toLowerCase()
    ?.split(' ')
    .join('-');
  // ?.replaceAll(" ", "-"); // replaceAll = split+join. Used in ES 2021+, not support with IE

  return urlName ? urlName : '';
};

// get Now Date string dd/mm/yyyy/hh/mn/ss
export const getDateNowString = (todayNow: any) => {
  //   const todayNow = new Date();
  const yy = todayNow.getFullYear(); //.toString().substring(2);
  const mm = todayNow.getMonth() + 1;
  const dd = todayNow.getDate();
  const hh = todayNow.getHours();
  const mn = todayNow.getMinutes();
  const ss = todayNow.getSeconds();

  return `${dd < 10 ? '0' + dd : dd}${mm < 10 ? '0' + mm : mm}${yy}${
    hh < 10 ? '0' + hh : hh
  }${mn < 10 ? '0' + mn : mn}${ss < 10 ? '0' + ss : ss}`;
};
