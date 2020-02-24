import React from 'react';
import { buildChart } from '../../components/builders';
import './ChartWrapper.scss';
import { reformatData } from '../../helpers/builderHelpers';

const ChartWrapper = props => {
  const numberOfCharts = window.innerWidth < 479 ? 1 : window.innerWidth > 1023 ? 3 : 2;
  const width = 100 / numberOfCharts;
  const { data, settings } = props;
  const newData = reformatData(data);
  return (
    <div className="chart-wrapper" style={{ width: width + '%' }}>
      {buildChart(newData, settings)}
    </div>
  );
};

export default ChartWrapper;
