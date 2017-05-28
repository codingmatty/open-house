import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './toast.css';


class App extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool
  }

  static defaultProps = {
    open: false
  }

  render() {
    const { message, open } = this.props || {};

    return (
      <div className={`toast ${open ? 'open' : ''}`}>{message}</div>
    );
  }
}

export default App;
