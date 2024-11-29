import React, { useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";

const { Option } = Select;

const UpdateBookingForm = ({ record, handleUpdate, status }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(record); 
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        handleUpdate({ ...record, ...values }); // Handle update with new values
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {status === "Xác nhận đơn đặt" ||
      status === "Thanh toán thành công" ||
      status === "Đã hoàn thành tour" ? (
        ""
      ) : (
        <Button type="primary" onClick={showModal}>
          Chỉnh sửa thông tin
        </Button>
      )}

      <Modal
        title="Chỉnh sửa "
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập Email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="selectedPayment"
            rules={[
              { required: true, message: "Vui lòng chọn hình thức thanh toán" },
            ]}
          >
            <Select>
              <Option value="momo">Momo</Option>
              <Option value="cash">Tiền mặt</Option>
              <Option value="bank">Chuyển Khoản</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Message"
            name="messageContent"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateBookingForm;
