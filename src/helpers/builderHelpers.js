import * as _ from 'lodash';
import { formatDate, groupArrayByPeriod } from './timeHelpers';

export const createFlatArray = data => {
  const flatArray = [];
  const dataKeys = Object.keys(data);
  dataKeys.forEach(objKey => flatArray.push(...data[objKey]));
  return flatArray;
};
export const formatDateInData = array =>
  array.map(item => ({ ...item, transactionDate: formatDate(item.transactionDate) }));

export const parseAmountInData = array =>
  array.map(item => ({ ...item, transactionAmount: parseFloat(item.transactionAmount) }));

export const reformatData = data => parseAmountInData(formatDateInData(createFlatArray(data)));

export const filterByKey = (array, key) => array.filter(item => !!item[key]);

const createRoot = (childrenArray, data, name, value = 'transactionAmount') => {
  const firstLevel = childrenArray[0];
  const otherChildren = childrenArray.slice(1);
  const result = {
    name: name || firstLevel,
    children: []
  };
  const newData = filterByKey(data, firstLevel);
  const childrenNames = _.uniq(newData.map(item => item[firstLevel])).filter(item => !!item);
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

/*
 * convert entry data to bar chart
 */
export const dataToBarChart = (data, settings) => {
  const { yAxis, groupMode, keyName, period } = settings;
  let { xAxis } = settings;

  let chartData = filterByKey(data, keyName);
  chartData = filterByKey(chartData, xAxis);
  chartData = formatDateInData(chartData);

  const keys = _.uniq(chartData.map(item => item[keyName]));

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

/*
 * convert entry data to bubble chart
 */
export const dataToBubbleChart = (data, settings) => {
  const { value, name, childrenArray } = settings;
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

/*
 * convert entry data to pie chart
 */
export const dataToPieChart = (data, settings) => {
  const { value, period, negative  } = settings;
  let { keyName } = settings;

  let chartData = [];
  let arr = data;

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
    legends: chartData.length < 5
  };
  return {
    chartData,
    chartSettings
  };
};
