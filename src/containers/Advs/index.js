import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Panel from '@/components/Panel';
import {
  Button,
  Layout,
  Breadcrumb,
  Divider,
  Table,
  Form
} from 'antd';
import AddAdvModal from './AddAdvModal';
import UpdateAdvModal from './UpdateAdvModal';
import DeleteAdvModal from './DeleteAdvModal';
import {
  getAllAdvs
} from '../../actions';

@connect(
  state => ({
    advs: state.advs.advs,
    isFetching: state.advs.isFetching
  }),
  dispatch => ({
    fetchAdvs: () => dispatch(getAllAdvs())
  })
)
export default class Adv extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    addModalVisible: false,
    updateModalVisible: false,
    updateValue: {},
    deleteModalVisible: false,
    deleteValue: {}
  }

  componentDidMount() {
    this.props.fetchAdvs()
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  handleOpenAddModal = () => {
    this.setState({
      addModalVisible: true
    })
  }

  handleAddModalClose = () => {
    this.setState({
      addModalVisible: false
    })
  }

  handleAddSuccess = () => {
    this.setState({
      addModalVisible: false
    })
  }

  handleOpenUpdateModal = (value) => {
    this.setState({
      updateModalVisible: true,
      updateValue: value
    })
  }

  handleUpdateCancel = () => {
    this.setState({
      updateModalVisible: false
    })
  }

  handleUpdateSuccess = () => {
    this.setState({
      updateModalVisible: false
    })
  }

  handleDeleteModalOpen = (record) => {
    this.setState({
      deleteModalVisible: true,
      deleteValue: record
    })
  }

  handleDeleteSuccess = () => {
    this.setState({
      deleteModalVisible: false
    })
  }

  handleDeleteCancel = () => {
    this.setState({
      deleteModalVisible: false
    })
  }

  render() {
    const {
      advs,
      isFetching
    } = this.props

    let {
      filteredInfo,
      sortedInfo
    } = this.state

    filteredInfo = filteredInfo || {}
    sortedInfo = sortedInfo || {}

    const columns =[{
      title: 'id',
      dataIndex: 'advSwiperId',
      key: 'advSwiperId',
      sorter: (a, b) => a.advSwiperId - b.advSwiperId,
      sortOrder: sortedInfo.columnKey === 'advSwiperId' && sortedInfo.order
    }, {
      title: 'Ad name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'category',
      dataIndex: 'categoryName',
      key: 'categoryName'
    }, {
      title: 'image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img className="advs-table-img" alt=".." src={text} />
      )
    }, {
      title: 'operating',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => this.handleOpenUpdateModal(record)}
          >
            modify
          </Button>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => this.handleDeleteModalOpen(record)}
          >
            delete
          </Button>
        </span>
      )
    }]

    return (
      <Layout.Content>
        <Panel minus>
          <Panel.Header type="light">
            <Breadcrumb>
              <Breadcrumb.Item>Homepage</Breadcrumb.Item>
              <Breadcrumb.Item>Advertising management</Breadcrumb.Item>
            </Breadcrumb>
            <h2>Advertising management</h2>
            <p>Advertising information display, you can add new ads, modify ads, delete ads. Note: Only up to five ad slots are allowed.</p>
            <Divider style={{marginTop: '10px', marginBottom: '30px'}} />
            <Button
              type="primary"
              onClick={this.handleOpenAddModal}
            >
              Add new ads
            </Button>
          </Panel.Header>
          <Panel.Body type="light">
            <Table
              rowKey={record => record.advSwiperId}
              dataSource={advs}
              columns={columns}
              bordered
              onChange={this.handleChange}
              loading={isFetching}
            />
          </Panel.Body>
          <AddAdvModal
            visible={this.state.addModalVisible}
            handleSubmit={this.handleAddSuccess}
            handleCancel={this.handleAddModalClose}
          />
          <UpdateAdvModal
            visible={this.state.updateModalVisible}
            value={this.state.updateValue}
            handleSubmit={this.handleUpdateSuccess}
            handleCancel={this.handleUpdateCancel}
          />
          <DeleteAdvModal
            visible={this.state.deleteModalVisible}
            value={this.state.deleteValue}
            handleSubmit={this.handleDeleteSuccess}
            handleCancel={this.handleDeleteCancel}
          />
        </Panel>
      </Layout.Content>
    )
  }
}
