import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Icon,
  Upload,
  message,
  Modal,
  Form,
  Input
} from 'antd';
import {
  authError,
  getAllAdvs
} from '@/actions/index';
import advService from '@/services/advService';
import CategorySelector from '../../components/CategorySelector';

const FormItem = Form.Item

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    fetchAdvs: () => dispatch(getAllAdvs())
  })
)
@Form.create()
export default class UpdateAdvModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  state = {
    fileList: [],
    previewImage: '',
    previewVisible: false
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return ;
      }

      let image;
      if (values.image) {
        image = values.image.fileList[0].originFileObj
      }

      this.updateCategory(
        values.advSwiperId,
        values.name,
        values.categorySecondId,
        image
      )
    })
  }

  handlePictureChange = ({ fileList }) => {
    this.setState({
      fileList
    })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleRemove = (file) => {
    this.setState({
      fileList: []
    })
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  updateCategory = async (advSwiperId, name, categorySecondId, image) => {
    const {
      adminId,
      token
    } = this.props

    try {
      const res = await advService.update(
        adminId,
        token,
        {
          advSwiperId,
          name,
          categorySecondId,
          image
        }
      )
      message.success('Successfully modified')
      this.props.fetchAdvs()
      this.props.handleSubmit()
    } catch (err) {
      if (err.message === undefined) {
        const errorMessage = 'The server is wrong, please be patient, please wait patiently for a year, thank you'
        this.props.authError(errorMessage)
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        this.props.authError(errorMessage)
      }
      // 修改不成功
      if (err.response.status === 400 ||err.response.status === 404) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
    }
  }

  renderUploadBtn = () => {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
  }

  render() {
    const {
      visible,
      handleCancel,
      handleSubmit,
      form,
      value
    } = this.props

    const {
      fileList,
      previewImage,
      previewVisible
    } = this.state

    const { getFieldDecorator } = form
    const advSwiperId = value ? value.advSwiperId : ''
    const name = value ? value.name : ''
    const categorySecondId = value ? value.categorySecondId : ''

    return (
      <Modal
        visible={visible}
        title="Modify classification information"
        okText="modify"
        cancelText="cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          <FormItem label="id">
            {getFieldDecorator('advSwiperId', {
              initialValue: advSwiperId
            })(
              <Input type="text" disabled />
            )}
          </FormItem>
          <FormItem label="name">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: 'Please enter an ad name'
              }, {
                max: 10,
                min: 1,
                message: 'Ad name cannot exceed 10 characters'
              }],
              initialValue: name
            })(
              <Input type="text" />
            )}
          </FormItem>
          <FormItem label="Secondary classification">
            {getFieldDecorator('categorySecondId', {
              initialValue: categorySecondId,
              rules: [{
                required: true,
                message: 'Please select the secondary category'
              }]
            })(
              <CategorySelector
                allItem={false}
                level="second"
              />
            )}
          </FormItem>
          <FormItem label="Edit image">
            {
              getFieldDecorator('image')(
                <Upload
                  action="http://yushijie.club:8080/cloudcommodity/api/v1/fileUpload"
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={this.handleRemove}
                  onPreview={this.handlePreview}
                  // onPreview={this.handlePreview}
                  // beforeUpload={this.beforeUpload}
                  onChange={this.handlePictureChange}
                >
                  {fileList.length >= 1 ? null : this.renderUploadBtn()}
                </Upload>
              )
            }
          </FormItem>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form>
      </Modal>
    )
  }
}
