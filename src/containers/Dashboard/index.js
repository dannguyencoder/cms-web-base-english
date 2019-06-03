import React from 'react';
import { connect } from 'react-redux';
import {
  Layout,
  Tabs,
  Row,
  Col,
  Icon,
  Tooltip,
  Card
} from 'antd';
import MetaBox from '@/components/MetaBox';
import Panel from '@/components/Panel';
import OrderCharts from './OrderCharts';
import ConversionCharts from './ConversionCharts';
import {
  statisticsOrder
} from '../../actions';

@connect(
  state => ({
    success: state.orders.success, // Transaction order
    successToday: state.orders.successToday, // Today's deal
    wait: state.orders.wait,  // to be delivered
    waitToday: state.orders.waitToday, // New pending delivery today
    totalSale: state.orders.totalSale, // Total sales
    todaySale: state.orders.todaySale, // Sales today
    userCount: state.orders.userCount, // amount of users
    refunding: state.orders.refunding, // Refunding
    dispatching: state.orders.dispatching, // In distribution
    collection: state.orders.collection, // Number of collections
    adminId: state.auth.admin.adminId, // Administrator id
    token: state.auth.admin.token, // token
  }),
  dispatch => ({
    fetchOrderStatus: (adminId, token) => dispatch(statisticsOrder(adminId, token))
  })
)
export default class Dashboard extends React.Component {
  componentDidMount() {
    this.fetchOrderStatus()
  }

  fetchOrderStatus = async () => {
    const {
      adminId,
      token
    } = this.props

    await this.props.fetchOrderStatus(adminId, token)
  }

  render() {
    const {
      wait,
      waitToday,
      refunding,
      dispatching,
      success,
      successToday,
      totalSale,
      todaySale,
      collection,
      userCount
    } = this.props

    return (
      <Layout.Content style={{backgroundColor: '#f0f2f5'}}>
         <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title="Total sales"
              icon={<Icon type="info-circle-o" />}
              info={'￥ ' + toThousands(totalSale)}
              desc={"Sales today： ￥ " + toThousands(todaySale)}
            >
            </MetaBox>
          </Col>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title="to be delivered"
              info={wait}
              desc={"Added today： " + waitToday}
            >
            </MetaBox>
          </Col>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title="Shopping cart collection"
              info={toThousands(collection)}
              desc={"amount of users： " + userCount}
            >
            </MetaBox>
          </Col>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title="Number of transactions"
              info={success}
              desc={"Added today： " + successToday}
            >
            </MetaBox>
          </Col>
        </Row>
        {/* <Panel style={{marginTop: '30px'}}>
          <Panel.Body type="light">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Order summary" key="1">
                <OrderCharts />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Favorite conversion rate" key="2">
                <ConversionCharts />
              </Tabs.TabPane>
            </Tabs>
          </Panel.Body>
        </Panel> */}
        <Row gutter={24} style={{marginTop: '30px'}}>
          <Col span={12} style={{bakcground: '#fff'}}>
            <OrderCharts
              wait={wait}
              success={success}
              refunding={refunding}
              dispatching={dispatching}
            />
          </Col>
          <Col span={12}>
            <ConversionCharts collection={collection} success={success} />
          </Col>
        </Row>
      </Layout.Content>
    )
  }
}

function toThousands (str) {
  if (!str) {
    return ''
  }

  return str.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}
