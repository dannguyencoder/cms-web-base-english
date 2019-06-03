import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function StatusFilter(props) {
  const {
    status,
    prefixCls,
    className
  } = props

  let content = ''
  if (status === 0) {
    content = 'Not shipped'
  } else if (status === 1) {
    content = 'In distribution'
  } else if (status === 2) {
    content = 'completed'
  } else if (status === 3) {
    content = 'Refunding'
  } else if (status === -1) {
    content = 'Refund successfully'
  } else {
    content = 'Refund failed'
  }

  const classes = classNames(
    className,
    {
      [`${prefixCls}-success`]: status === 2,
      [`${prefixCls}-error`]: status === 3,
      [`${prefixCls}-warning`]: status === 0,
      [`${prefixCls}`]: status === 1
    }
  )

  return (
    <span className={classes}>
      {content}
    </span>
  )
}

StatusFilter.propTypes = {
  status: PropTypes.number.isRequired
}

StatusFilter.defaultProps = {
  prefixCls: 'status'
}

export default StatusFilter
