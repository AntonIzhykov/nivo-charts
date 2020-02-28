import React from 'react';

import { BarBuilder, BubbleBuilder, PieBuilder } from './index';
import { dataToBarChart, dataToBubbleChart, dataToPieChart } from '../../helpers';

/**
 * depending on the value of the "type" parameter in the settings object converts the data and builds the desired schedule
 * @param {Object} data
 * @param {Object} settings
 * @returns {*}
 */
const buildChart = (data, settings) => {
  const { type } = settings;
  switch (type) {
    case 'bar':
    case 'stack': {
      const { chartData, chartSettings } = dataToBarChart(data, settings);
      const chartProps = {
        data: chartData,
        ...chartSettings
      };
      return <BarBuilder {...chartProps} />;
    }

    case 'bubble': {
      const { root, chartSettings } = dataToBubbleChart(data, settings);
      const chartProps = {
        root,
        ...chartSettings
      };
      return <BubbleBuilder {...chartProps} />;
    }

    case 'pie': {
      const { chartData, chartSettings } = dataToPieChart(data, settings);
      const chartProps = {
        data: chartData,
        ...chartSettings
      };
      return <PieBuilder {...chartProps} />;
    }

    default:
      return <div className="error">What exactly do you want to see here?</div>;
  }
};

export default buildChart;
