import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '@/components/Panel';
import {
  Button,
  Layout,
  Breadcrumb,
  Divider,
  Table,
  Form
} from 'antd';
import {
  getAllOrders,
  updateOrderStatus
} from '@/actions/index';
import { dateFormat } from '@/utils/index';
import SelectorHeader from './SelectorHeader';
import StatusFilter from './StatusFilter';
import DetailItem from './DetailItem';
import orderService from '../../services/orderService';
import { ORDER_DISPATCHING, ORDER_FINISH, ORDER_WAIT } from '../../constants';

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token,
    orders: state.orders.orders,
    isFetching: state.orders.isFetchingOrders
  }),
  dispatch => ({
    loadOrders: (adminId, token, params) => {
      dispatch(getAllOrders(adminId, token, params))
    },
    updateOrderStatus: (adminId, token, orderId, status) => {
      dispatch(updateOrderStatus(adminId, token, orderId, status))
    }
  })
)
export default class Orders extends React.Component {
  static propTypes = {
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    orders: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    loadOrders: PropTypes.func.isRequired
  }

  state = {
    filteredInfo: null,
    sortedInfo: null,
    status: ORDER_WAIT
  }

  componentDidMount() {
    const status = 0

    this.loadOrders()
  }

  loadOrders = (params = {}) => {
    const {
      adminId,
      token
    } = this.props

    const status = this.state.status
    const paramsData = Object.assign({}, { status }, params)

    this.props.loadOrders(adminId, token, paramsData)
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  handleConfirmDispatch = async (orderId) => {
    const {
      adminId,
      token
    } = this.props

    await orderService.update(adminId, token, orderId, ORDER_FINISH)

    this.loadOrders()
  }

  handleDispatch = async (orderId) => {
    const {
      adminId,
      token
    } = this.props

    await orderService.update(adminId, token, orderId, ORDER_DISPATCHING)

    this.loadOrders()
  }

  handleStatusChange = (value) => {
    this.setState({
      status: value
    })

    this.loadOrders({ status: value })
  }

  onSelectorChange = (value) => {
    const start = value.createTime ? value.createTime[0].format('YYYY-MM-DD') : null
    const end = value.createTime ? value.createTime[1].format('YYYY-MM-DD') : null
    const userName = value.userName && value.userName !== '' ? value.userName : null
    const orderId = value.orderId ? parseInt(value.orderId) : null

    const params = {
      start,
      end,
      userName,
      orderId
    }

    this.loadOrders(params)
  }

  renderExpanded = (record) => {
    const address = record.address.city + record.address.address + record.address.streetNumber
    const addressContent = address + `   ${record.address.consignee}   ${record.address.phone}`
    return (
      <div>
        <p>
          User receiving address： {addressContent}
        </p>
          <h4>Product：</h4>
        {
          record.orderDetails.length > 0 ? (
            record.orderDetails.map((item) => {
              return (
                <DetailItem
                  key={item.goodId}
                  detail={item}
                />
              )
            })
          ) : null
        }
      </div>
    )
  }

  render() {
    const {
      isFetching
    } = this.props

    let orders = this.props.orders
    let {
      filteredInfo,
      sortedInfo
    } = this.state

    filteredInfo = filteredInfo || {}
    sortedInfo = sortedInfo || {}

    const columns =[{
      title: 'id',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId - b.orderId,
      sortOrder: sortedInfo.columnKey === 'orderId' && sortedInfo.order
    }, {
      title: 'User id',
      dataIndex: 'userId',
      key: 'userId'
    }, {
      title: 'Total price',
      dataIndex: 'amount',
      key: 'amount'
    }, {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          <StatusFilter
            status={text}
          />
        )
      },
      filters: [
        { text: 'Not shipped', value: '0' },
        { text: 'In distribution', value: '1' }
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, recored) => {
        return recored.status === parseInt(value, 10)
      }
    }, {
      title: 'order time',
      dataIndex: 'createTime',
      render: (text, record) => {
        return (
          <span>
            {
              dateFormat(new Date(text), 'yyyy-MM-dd hh:ss')
            }
          </span>
        )
      }
      // key: 'createTime',
    }, {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks'
    }, {
      title: 'operating',
      key: 'action',
      render: (text, record) => {
        if (record.status === ORDER_DISPATCHING) {
          return (
            <Button
              type="primary"
              onClick={() => this.handleConfirmDispatch(record.orderId)}
            >
              Confirmed delivery
            </Button>
          )
        } else {
          return (
            <Button
              type="primary"
              onClick={() => this.handleDispatch(record.orderId)}
            >
              Ship
            </Button>
          )
        }
      }
    }]

    return (
      <Layout.Content>
        <Panel minus>
          <SelectorHeader
            handleSelectorChange={this.onSelectorChange}
            status={this.state.status}
            handleStatusChange={this.handleStatusChange}
          />
          <Panel.Body type="light">
            <Table
              rowKey={record => record.orderId}
              dataSource={orders}
              expandedRowRender={this.renderExpanded}
              columns={columns}
              loading={isFetching}
              bordered
              onChange={this.handleTableChange}
            />
          </Panel.Body>
        </Panel>
      </Layout.Content>
    )
  }
}
