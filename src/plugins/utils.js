import moment from 'moment';
import lodash from 'lodash';
import Moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(Moment);
typeof Moment.duration.fn.format === "function";
typeof Moment.duration.format === "function";

const Utils = {
  install(Vue) {
    const url = 'https://api.guildwars2.com/v2';

    Vue.prototype.$moment = moment;
    Vue.prototype.$Moment = Moment;
    Vue.prototype._ = lodash;

    Vue.prototype.$http = {

      get(path, options) {
        const cacheEnabled = options && options.enableCache;
        const storagedData = localStorage.getItem(path);
        const dataToPromise = new Promise((resolve, reject) => {
          if (storagedData && cacheEnabled) {
            resolve(JSON.parse(storagedData));
          }
          else {
            fetch(url + path, {cache: "no-store"})
              .then(resp => resp.json())
              .then(data => {
                resolve(data);
                if (cacheEnabled) {
                  localStorage.setItem(path, JSON.stringify(data));
                }
              })
              .catch(err => reject(err))
          }
        });
        return dataToPromise;
      }
    
    }
  
  }
};

export default Utils;