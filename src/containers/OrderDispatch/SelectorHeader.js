import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '@/components/Panel';
import {
  Breadcrumb,
  Form,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Divider,
  Radio,
  Badge,
  Input
} from 'antd';
import { ORDER_WAIT, ORDER_DISPATCHING, ORDER_FINISH, ORDER_REFUNDING } from '../../constants';

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

@connect(
  state => ({
    wait: state.orders.wait,
    dispatching: state.orders.dispatching
  })
)
@Form.create()
export default class SelectorHeader extends React.Component {
  static propTypes = {
    handleSelectorChange: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    status: PropTypes.number.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return ;
      }

      if (values.categoryId === 'all') {
        values.categoryId = null
      }

      this.props.handleSelectorChange(values)
    })
  }

  handleReset = () => {
    this.props.form.setFieldsValue({
      orderId: undefined,
      userName: '',
      createTime: undefined
    })
  }

  onDateChange = (date, dateString) => {
    console.log(date, dateString);
  }

  handleStatusChange = (e) => {
    this.props.handleStatusChange(e.target.value)
  }

  render() {
    const {
      form,
      status,
      dispatching,
      wait
    } = this.props

    const { getFieldDecorator } = form

    return (
      <Panel.Header type="light">
        <Breadcrumb>
          <Breadcrumb.Item>主页</Breadcrumb.Item>
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单配送</Breadcrumb.Item>
        </Breadcrumb>
        <h2>
          Order delivery

          <RadioGroup onChange={this.handleStatusChange} defaultValue={status} style={{float: 'right'}}>
            <Badge dot={wait > 0}>
              <RadioButton value={ORDER_WAIT}>to be delivered</RadioButton>
            </Badge>
            <Badge dot={dispatching > 0}>
              <RadioButton value={ORDER_DISPATCHING}>In distribution</RadioButton>
            </Badge>
          </RadioGroup>
        </h2>
        <p>Manage the order delivery, view the orders to be shipped and delivered, and process the delivery and confirm the delivery of the order.</p>
        <Divider style={{marginTop: '10px', marginBottom: '30px'}} />
        <Form className="form-search" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={4}>
              <FormItem label="id">
                {getFieldDecorator('orderId')(
                  <Input type="number" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                className="form-flex-wrapper"
                label="user name"
              >
                {getFieldDecorator('userName', {
                  initialValue: ""
                })(
                  <Input type="text" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label="time:">
                {getFieldDecorator('createTime', {
                  initialValue: ''
                })(
                  <DatePicker.RangePicker style={{marginLeft: '10px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{textAlign: 'right'}}>
              <Button
                type="primary"
                htmlType="submit"
              >
                搜索
              </Button>
              <Divider type="vertical"/>
              <Button type="dashed" onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Panel.Header>
    )
  }
}
