import Vue from 'vue';
import jwt_decode from 'jwt-decode';

const utils = {
  isExist: (obj: any) => (id: string | number) => Vue.$_(obj).has(id),
  hasItems: (obj: any) => (id: string | null) => Vue.$_(obj).get([id || ''], []).length > 0,
  timeToString: (datetime: number) => {
    const date = new Date(datetime);
    const addZero = (i: number) => i < 10 ? `0${i}` : i;
    const time: string = `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
    return `${date.getDate()}/${date.getMonth() + 1} ${time}`;
  },
  fixTimestamp: (time: any) => time.toString().length > 10 ? Number(time) : Number(time) * 1000,
  fixTime: (obj: any) => {
    const temp: any = obj;
    temp.time = utils.fixTimestamp(temp.time);
    return temp;
  },
  fixTimeInArray: (obj: any) => {
    const temp: any = obj;
    temp[0] = utils.fixTimestamp(temp[0]);
    temp[0] -= (new Date().getTimezoneOffset() * 60 * 1000);
    return temp;
  },
  fixNumber: (num: number) => Math.round(num * 10000) / 10000,
  fixPrice: (obj: any) => {
    const temp: any = obj;
    temp.price = utils.fixNumber(temp.price);
    return temp;
  },
  parseJwt: (token: string) => {
    return jwt_decode(token);
  },
};

const utilsPlugin = {
  install(vueObj: any) {
    vueObj.$utils = utils;
    Object.defineProperty(Vue.prototype, '$utils', { value: utils });
  },
};

Vue.use(utilsPlugin);
declare module 'vue/types/vue' {
  export interface VueConstructor {
    $utils: typeof utils;
  }
  export interface Vue {
    $utils: typeof utils;
  }
}
