import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@/components/Panel';
import {
  Breadcrumb,
  Form,
  Row,
  Col,
  Button,
  Select,
  Divider,
  Input
} from 'antd';
import CategorySelector from '@/components/CategorySelector';

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class SelectorHeader extends React.Component {
  static propTypes = {
    handleSelectorChange: PropTypes.func.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)

      if (err) {
        return ;
      }

      if (values.categoryId === 'all') {
        values.categoryId = null
      }

      if (values.status === 'all') {
        values.status = null
      }

      this.props.handleSelectorChange(values)
    })
  }

  handleReset = () => {
    this.props.form.setFieldsValue({
      goodId: undefined,
      goodName: '',
      categoryId: 'all',
      status: 'all'
    })
  }

  handleStatusChange = (value) => {
    this.props.form.setFieldsValue({
      status: value
    })
  }

  render() {
    const {
      form
    } = this.props

    const { getFieldDecorator } = form

    return (
      <Panel.Header type="light">
        <Breadcrumb>
          <Breadcrumb.Item>Homepage</Breadcrumb.Item>
          <Breadcrumb.Item>user list</Breadcrumb.Item>
        </Breadcrumb>
        <h2>user list</h2>
        <p>User information display, you can modify the user's personal information, modify the user password operation</p>
        <Divider style={{marginTop: '10px', marginBottom: '30px'}} />
        <Form className="form-search" onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={4}>
              <FormItem label="id">
                {getFieldDecorator('goodId')(
                  <Input type="number" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                className="form-flex-wrapper"
                label="product name"
              >
                {getFieldDecorator('goodName', {
                  initialValue: ""
                })(
                  <Input type="text" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="classification:">
                {getFieldDecorator('categoryId', {
                  initialValue: 'all'
                })(
                  <CategorySelector
                    allItem
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="Commodity status:">
                {getFieldDecorator('status', {
                  initialValue: 'all'
                })(
                  <Select
                    onChange={this.handleStatusChange}
                  >
                    <Option value="all">All</Option>
                    <Option value="1">in stock</Option>
                    <Option value="0">Obtained</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5} style={{textAlign: 'right'}}>
              <Button
                type="primary"
                htmlType="submit"
              >
                search for
              </Button>
              <Divider type="vertical"/>
              <Button type="dashed" onClick={this.handleReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Panel.Header>
    )
  }
}
