// import * as axios from 'axios';
// import { defaultUrl } from './config';

const faker = require('faker');

export const getIncomingData = ({ token, username, query, start, end, num }) => {
  // return axios({
  //   method: 'get',
  //   //create query by parsing or something else
  //   url: `${defaultUrl}/data?${query}`,
  //   headers: {
  //     'authorization': token,
  //     'Content-Type': 'application/json'
  //   }

  const fakeSummaryStats = (start_date, end_date, query_group, num_entries) => {
    let summaryStats = {};
    const products = ['Tractor', 'Trailer', 'Truck', 'Seeder', 'Reeper', 'Plow', 'Mower', 'Pump', 'Maintenance'];
    const customerName = ['ABC Corp', 'Donkey Inc', 'Megacorp Trading Co', 'John Beer', 'Havilusk', 'Billy Bob Farms'];
    const expenses = ['COGS', 'SG&A', 'Payroll']

    const transactionTemplate =
      { transactionDate: '', transactionAmount: '', transactionCategory: '', customerName: '', productName: '' };
    query_group.forEach(item => {
      summaryStats[item] = [];
      for (let i = 0; i < num_entries; i++) {
        let transaction = {};
        transaction.transactionDate = faker.date.between(start_date, end_date);
        (item === 'expense') ? (transaction.transactionAmount = faker.finance.amount(-150000, 0, 2, '')) : (transaction.transactionAmount = faker.finance.amount(-25000, 150000, 2, ''));
        (item === 'revenue' || item === 'inventory' || item === 'product') ? (transaction.productName = faker.random.arrayElement(products)) : (transaction.productName = '');
        (item === 'revenue') ? (transaction.customerName = faker.random.arrayElement(customerName)) : (transaction.customerName = '');
        (item === 'expense') ? (transaction.transactionCategory = faker.random.arrayElement(expenses)) : (transaction.transactionCategory = item);
        summaryStats[item].push(transaction);
      }
    });
    return summaryStats;
  };

  const requestHandler = resolve => {
    setTimeout(() => {
      resolve(JSON.stringify(fakeSummaryStats(start, end, query, num), null, 2));
    }, 1);
  };

  return new Promise(requestHandler);
};
