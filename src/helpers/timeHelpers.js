import * as moment from 'moment';
import { filterByKey } from './builderHelpers';

export const formatDate = date => moment(new Date(date)).format('MM-DD-YYYY');

export const sortArrayByTime = (array, key) =>
  array.sort(
    (a, b) =>
      moment(new Date(a[key])).format('MM-DD-YYYY') - moment(new Date(b[key])).format('MM-DD-YYYY')
  );

export const groupArrayByPeriod = (data, period, keyName, value) => {
  if (!period) return data;
  const sorted = sortArrayByTime(data, 'transactionDate');
  const filtered = filterByKey(sorted, keyName);
  const periods = [];
  filtered.forEach(item => {
    const duration = moment(new Date(item.transactionDate)).format(
      `${period === 'month' ? 'MMMM' : 'w'}`
    );
    periods[duration] ? periods[duration].push(item) : (periods[duration] = [item]);
  });

  const result = [];
  const keys = Object.keys(periods);
  keys.forEach(key => {
    const obj = {};
    periods[key].forEach(item => {
      obj[item[keyName]] = obj[item[keyName]] ? obj[item[keyName]] + item[value] : item[value];
    });

    result.push({
      [period]: key,
      ...obj
    });
  });
  return result;
};
