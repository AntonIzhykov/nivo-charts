import * as _ from 'lodash';
import { formatDate, groupArrayByPeriod } from './timeHelpers';

/**
 * converts an array-like object to a flat array without nesting
 * @param {Object} data
 * @returns {Array}
 */
export const createFlatArray = data => {
  const flatArray = [];
  const dataKeys = Object.keys(data);
  dataKeys.forEach(objKey => flatArray.push(...data[objKey]));
  return flatArray;
};

/**
 * converts each element of the array and casts the dates to the desired format using the formatDate function
 * @param {Array} array
 * @returns {Array}
 */
export const formatDateInData = array =>
  array.map(item => ({ ...item, transactionDate: formatDate(item.transactionDate) }));

/**
 * transforms all values ​​of the "transactionAmount" key to the number
 * @param {Array} array
 * @returns {Array}
 */
export const parseAmountInData = array =>
  array.map(item => ({ ...item, transactionAmount: parseFloat(item.transactionAmount) }));

/**
 * brings the input data to the form necessary for work, sequentially passing the input data through the helpers functions
 * @param {Object} data
 * @returns {Array}
 */
export const reformatData = data => parseAmountInData(formatDateInData(createFlatArray(data)));

/**
 * filters an array of values ​​by key. returns an array in which the key values ​​are not empty
 * @param {Array} array
 * @param {*} key
 * @returns {Array}
 */
export const filterByKey = (array, key) => array.filter(item => !!item[key]);

/**
 * creates array-like object with nested children and names, which is needed for building bubble-chart
 * @param {Array} childrenArray
 * @param {Array} data
 * @param {String} name
 * @param {String} value
 * @returns {Object} result
 */
const createRoot = (childrenArray, data, name, value = 'transactionAmount') => {
  const firstLevel = childrenArray[0];
  const otherChildren = childrenArray.slice(1);
  const newData = filterByKey(data, firstLevel);
  const childrenNames = _.uniq(newData.map(item => item[firstLevel])).filter(item => !!item);

  const result = {
    name: name || firstLevel,
    children: []
  };

  childrenNames.forEach((childName, index) => {
    if (otherChildren.length > 0) {
      const data = newData.filter(item => item[firstLevel] === childName);
      result.children[index] = createRoot(otherChildren, data, childName);
    } else {
      const arr = newData.filter(item => item[firstLevel] === childName);
      let newValue = 0;
      arr.forEach(item => {
        newValue += item[value];
      });
      result.children[index] = {
        name: childName,
        value: newValue
      };
    }
  });

  return result;
};

/**
 * converts entry data to bar chart
 * @param {Array} data
 * @param {Object} settings
 * @returns {Object} data-array and settings for building
 */
export const dataToBarChart = (data, settings) => {
  const { yAxis = '', groupMode = '', keyName = '', period = '' } = settings;
  let { xAxis = '' } = settings;

  let chartData = filterByKey(data, keyName);

  chartData = filterByKey(chartData, xAxis);
  chartData = formatDateInData(chartData);

  const keys = _.uniq(chartData.map(item => item[keyName]));

  // If there is a “period” parameter and the data should be arranged by date, then the data array is built using groupArrayByPeriod function.
  // If one of these conditions is false, then the data array is built by sorting keys and adding new elements
  if (xAxis === 'transactionDate' && !!period) {
    chartData = groupArrayByPeriod(chartData, period, keyName, yAxis);
    xAxis = period;
  } else {
    chartData = chartData.map(item => ({
      [xAxis]: item[xAxis],
      [item[keyName]]: item[yAxis]
    }));
  }

  const groups = _.uniq(chartData.map(item => item[xAxis]));

  const newData = groups.map(item => {
    let result = {
      [xAxis]: item
    };

    chartData.forEach(chart => {
      if (chart[xAxis] === item) {
        const chartKeys = Object.keys(chart);
        chartKeys.forEach(key => {
          if (chart[key] !== item) {
            result[key] = chart[key];
          }
        });
      }
    });

    return result;
  });

  const chartSettings = {
    keys: keys,
    indexBy: xAxis,
    groupMode: groupMode
  };
  return {
    chartData: newData,
    chartSettings
  };
};

/**
 * converts entry data to bubble chart
 * @param {Array} data
 * @param {Object} settings
 * @returns {Object} root-data and settings for building
 */
export const dataToBubbleChart = (data, settings) => {
  const { value = '', name = '', childrenArray = [] } = settings;
  const filtered = childrenArray.filter(item => !!item);

  const root = createRoot(filtered, data, name, value);

  let chartSettings = {
    value: 'value',
    enableLabel: true
  };

  return {
    root,
    chartSettings
  };
};

/**
 * converts entry data to pie chart
 * @param {Array} data
 * @param {Object} settings
 * @returns {Object} chart-data and settings for building
 */
export const dataToPieChart = (data, settings) => {
  const { value = '', period = '', negative = false } = settings;
  let { keyName = '' } = settings;

  let chartData = [];
  let arr = data;

  // If there is a “period” parameter and the data should be arranged by date, then the data array is built using groupArrayByPeriod function.
  if (keyName === 'transactionDate' && !!period) {
    const tempArr = groupArrayByPeriod(data, period, keyName, value);
    keyName = period;
    arr = [];
    tempArr.forEach(item => {
      const keys = Object.keys(item);
      let tempValue = 0;
      keys.forEach(key => {
        if (key !== period) {
          tempValue += +item[key];
        }
      });
      arr.push({
        [keyName]: item[keyName],
        [value]: tempValue
      });
    });
  }

  //If there is a “negative” parameter, the data array is filtered by negative values ​​and makes the values ​​absolute
  if (negative) {
    arr = arr.filter(item => item[value] < 0).map(item => ({...item, [value]: Math.abs(item[value])}));
  } else {
    arr = arr.filter(item => item[value] > 0)
  }

  const labels = _.uniq(arr.map(item => item[keyName])).filter(item => !!item);

  labels.forEach(label => {
    const obj = {
      id: label,
      label: label,
      value: parseInt(arr.filter(item => item[keyName] === label)[0][value].toFixed(2))
    };
    chartData.push(obj);
  });

  const chartSettings = {
    ...settings,
    defs: [
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: 'rgba(201,14,18,0.76)',
        size: 4,
        padding: 1,
        stagger: true
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: 'rgba(153,255,0,0.81)',
        rotation: -45,
        lineWidth: 6,
        spacing: 10
      }
    ],
    fills: [
      {
        match: {
          id: 'cash'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'product'
        },
        id: 'squares'
      },
      {
        match: {
          id: 'revenue'
        },
        id: 'lines'
      }
    ],
    legends: `${chartData.length}` < 5 ? [
        {
          anchor: 'bottom',
          direction: 'row',
          translateY: 56,
          itemWidth: 80,
          itemHeight: 18,
          itemTextColor: '#000',
          itemTextSize: 5,
          symbolSize: 16,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000'
              }
            }
          ]
        }
      ] : []
  };
  return {
    chartData,
    chartSettings
  };
};
