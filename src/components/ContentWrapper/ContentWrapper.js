import React, { Component } from 'react';
import App from '../App';
import { connect } from 'react-redux';

import { getIncomingDataRequest } from '../../store/Stats/States.action';

import './ContentWrapper.scss';

class ContentWrapper extends Component {
  componentDidMount() {
    const token = '11111token11111';
    const username = 'Test';
    const start = new Date('1/1/2019');
    const end = new Date('1/1/2020');
    const query = ['revenue', 'expense', 'inventory', 'product', 'cash'];
    const num = 2;
    this.props.handleIncomingDataGetting(token, username, query, start, end, num);
  }

  render() {
    const { loading } = this.props;
    return loading ? <div className="loader">Loading...</div> : <App />;
  }
}

const mapStateToProps = store => ({
  loading: store.stats.loading
});

const mapDispatchToProps = dispatch => ({
  handleIncomingDataGetting: (token, username, query, start, end, num) =>
    dispatch(getIncomingDataRequest({ token, username, query, start, end, num }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentWrapper);
