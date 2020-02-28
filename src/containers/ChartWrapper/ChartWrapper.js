import React from 'react';
import { buildChart } from '../../components/builders';
import { reformatData } from '../../helpers/builderHelpers';
import './ChartWrapper.scss';

const ChartWrapper = props => {
  const mobile = 480;
  const screen = 1023;
  const numberOfCharts = window.innerWidth < mobile ? 1 : window.innerWidth > screen ? 3 : 2;
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
