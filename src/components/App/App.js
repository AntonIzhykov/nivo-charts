import React from 'react';
import { ChartWrapper } from '../../containers';
import { connect } from 'react-redux';

import './App.scss';

const App = props => {
  const { incomingData } = props.stats;

  const barSettings = {
    type: 'bar',
    keyName: 'productName',
    xAxis: 'transactionDate',
    yAxis: 'transactionAmount',
    // period: 'month',
    groupMode: 'stacked'
  };

  const pieSettings = {
    type: 'pie',
    keyName: 'productName',
    // period: 'month',
    value: 'transactionAmount'
  };

  const bubbleSettings = {
    type: 'bubble',
    value: 'transactionAmount',
    name: 'bubble',
    childrenArray: ['', 'transactionCategory', '', 'productName', 'transactionDateу']
  };

  return (
    <div className="App">
      <ChartWrapper data={incomingData} settings={barSettings} />
      <ChartWrapper data={incomingData} settings={pieSettings} />
      <ChartWrapper data={incomingData} settings={bubbleSettings} />
    </div>
  );
};

const mapStateToProps = store => ({
  stats: store.stats
});
export default connect(mapStateToProps)(App);
