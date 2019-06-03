import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  message,
  Icon,
  Upload,
  Modal,
  Form,
  Input
} from 'antd';
import CategorySelector from '../../components/CategorySelector';
import goodService from '@/services/goodService';
import {
  authError,
  serviceStart,
  serviceEnd
} from '@/actions';

const FormItem = Form.Item

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

@connect(
  state => ({
    adminId: state.auth.admin.adminId,
    token: state.auth.admin.token,
    inService: state.service.inService
  }),
  dispatch => ({
    authError: (errorMessage) => dispatch(authError(errorMessage)),
    serviceStart: () => dispatch(serviceStart()),
    serviceEnd: () => dispatch(serviceEnd())
  })
)
@Form.create()
export default class AddGoodMOdal extends React.Component {
  static propTypes = {
    adminId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    inService: PropTypes.bool.isRequired,
    authError: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
  }

  state = {
    loading: false,
    uploaded: false
  }

  beforeUpload = (file) => {
    const isJPGOrPNG = file.type === 'image/jpeg' || 'image/png';
    if (!isJPGOrPNG) {
      message.error('You can only upload JPG or PNG file!');
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    }

    this.setState({
      uploaded: true,
      file
    })

    return false;
  }

  // handleChange = (info) => {
  //   if (info.file.status === 'uploading') {
  //     this.setState({ loading: true });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, imageUrl => this.setState({
  //       imageUrl,
  //       loading: false,
  //     }));
  //   }
  // }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (err) {
        return ;
      }

      this.postGood(values)
    })
  }

  postGood = async (good) => {
    const {
      adminId,
      token,
      authError,
      handleSubmit,
      serviceStart,
      serviceEnd
    } = this.props

    try {
      serviceStart()

      const res = await goodService.create(
        adminId,
        token,
        good,
        good.image.file
      )
      serviceEnd()
      message.success("Add item successfully")
      handleSubmit()
    } catch (err) {
      serviceEnd()
      if (err.response === undefined) {
        const errorMessage = 'Server error, please try again later'
        authError(errorMessage)
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        authError(errorMessage)
      }
      if (err.response.status === 400) {
        const errorMessage = err.response.data.message
        message.error(errorMessage)
      }
    }
  }

  renderUploadButton() {
    return (
      <Button type={this.state.uploaded ? "primary" : "dashed"}>
        <Icon type={this.props.inService ? 'loading':'plus'} />
        {this.state.uploaded ? (
          '上传成功'
        ) : (
          '上传图片'
        )}
      </Button>
    )
  }

  priceValidator = (rule, value, callback) => {
    if (value <= 0) {
      callback('Price must be greater than 0')
    }
    callback()
  }

  render() {
    const {
      visible,
      handleCancel,
      form
    } = this.props

    const { getFieldDecorator } = form
    const uploadButton = this.renderUploadButton()
    const imageUrl = this.state.imageUrl

    return (
      <Modal
        visible={visible}
        title="Add item"
        okText="Preservation"
        cancelText="cancel"
        onCancel={handleCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical">
          <FormItem label="product name:">
            {getFieldDecorator('goodName', {
              rules: [{
                required: true,
                message: 'Please enter the product name'
              }, {
                max: 20,
                min: 1,
                message: 'Product name cannot exceed 20 characters'
              }]
            })(
              <Input type="text"/>
            )}
          </FormItem>
          <FormItem label="Product category：">
            {getFieldDecorator('categorySecondId', {
              rules: [{
                required: true,
                message: 'Please select a product category'
              }]
            })(
              <CategorySelector />
            )}
          </FormItem>
          <FormItem label="image:">
            {getFieldDecorator('image', {
              rules: [{
                required: true,
                message: 'Please upload a product image'
              }]
            })(
              <Upload
                name="image"
                listType="picture"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
              >
                {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
              </Upload>
            )}
          </FormItem>
          <FormItem label="Current price:">
            {getFieldDecorator('price', {
              rules: [{
                required: true,
                message: 'Please enter the price of the product'
              }, {
                max: 10,
                message: 'The price cannot exceed ten digits'
              }, {
                validator: this.priceValidator
              }]
            })(
              <Input type="number"/>
            )}
          </FormItem>
          <FormItem label="Original price:">
            {getFieldDecorator('originalPrice', {
              rules: [{
                max: 10,
                message: 'The price cannot exceed ten digits'
              }, {
                validator:this.priceValidator
              }]
            })(
              <Input type="number"/>
            )}
          </FormItem>
          <FormItem label="specification:">
            {getFieldDecorator('spec', {
              rules: [{
                required: true ,
                message: 'Please enter the specifications of the product'
              }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="place of origin:">
            {getFieldDecorator('origin', {
              rules: [{
                required: true,
                message: 'Please enter the country of origin of the product'
              }]
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
