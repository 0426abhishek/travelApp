import React from 'react';
import { Progress } from 'reactstrap';
import PropTypes from 'prop-types';

const ProgressBar = (props) => {
  return (
    <div>
      <Progress striped value={2 * 5} />
      <Progress striped color="success" value="25" />
      <Progress striped color="info" value={50} />
      <Progress striped color="warning" value={75} />
      <Progress striped color="danger" value="100" />
      <Progress multi>
        <Progress striped bar value="10" />
        <Progress striped bar color="success" value="30" />
        <Progress striped bar color="warning" value="20" />
        <Progress striped bar color="danger" value="20" />
      </Progress>
    </div>
  );
};

export default ProgressBar;

Progress.propTypes = {
    multi: PropTypes.bool,
    bar: PropTypes.bool, // used in combination with multi
    tag: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    max: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.number,
    ]),
    animated: PropTypes.bool,
    striped: PropTypes.bool,
    color: PropTypes.string,
    className: PropTypes.string,
    barClassName: PropTypes.string // used to add class to the inner progress-bar element
  };
  
  Progress.defaultProps = {
    tag: 'progress',
    value: 0,
    max: 100,
  };