import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import categorySecondService from '@/services/categorySecondService';
import {
  message,
  Modal,
  Spin
} from 'antd';
import {
  authError,
  fetchAllCategorySecond
} from '@/actions';

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    fetchCategories: () => dispatch(fetchAllCategorySecond())
  })
)
export default class DeleteCategoryModal extends React.Component {
  static propTypes = {
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  handleConfirm = async () => {
    const {
      adminId,
      token,
      value
    } = this.props
    const categorySecondId = value.categorySecondId

    try {
      await categorySecondService.remove(adminId, token, categorySecondId)
      message.success("successfully deleted")
      this.props.fetchCategories()
      this.props.handleSubmit()
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = 'The server is wrong, please be patient, please wait patiently for a year, thank you'
        this.props.authError(errorMessage)
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        this.props.authError(errorMessage)
      }
      // 删除不成功
      if (err.response.status === 400 || err.response.status === 404) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
      this.props.fetchCategories()
      this.props.handleCancel()
    }
  }

  render() {
    const {
      value
    } = this.props

    const categoryName = value ? value.categoryName : ''

    return (
      <Modal
        title={`Delete category`}
        visible={this.props.visible}
        okText="confirm"
        cancelText="cancel"
        onOk={this.handleConfirm}
        onCancel={this.props.handleCancel}
      >
        <p>
          {
            categoryName ? (
              'Confirm that you want to delete the classification information：' + categoryName
            ) : ''
          }
        </p>
      </Modal>
    )
  }
}
