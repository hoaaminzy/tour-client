import React from "react";
import { Form, Input, Select, message, Button, InputNumber } from "antd";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
const { TextArea } = Input;
const { Option } = Select;

function ContactForm() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}contacts/contact`, values);
      if (response.data.success) {
        message.success(response.data.message);
        form.resetFields(); // Reset form fields after successful submission
        await axios.post(`${baseUrl}email/send-email-contact`, {
          email: values.email,
          displayName: values.fullName,
        });
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-1240 w-375 flex flex-col py-5 gap-5">
      <div className="w-full flex justify-center">
        <div className="w-[1000px] text-center flex flex-col gap-4 ">
          <span
            style={{ textTransform: "uppercase" }}
            className="text-[28px] fw-bold text-[#276ca1]"
          >
            Liên hệ hỗ trợ
          </span>
          <p className="text-left text-center">
            Để có thể đáp ứng được các yêu cầu và đóng góp ý kiến của quý khách,
            xin vui lòng gửi thông tin vào form bên dưới !
          </p>
        </div>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-3 gap-3">
          <Form.Item
            label="Loại thông tin"
            name="infoType"
            rules={[
              { required: true, message: "Vui lòng chọn loại thông tin!" },
            ]}
          >
            <Select placeholder="Chọn loại thông tin">
              <Option value="Du lịch">Du lịch</Option>
              <Option value="Công việc">Công việc</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Tên công ty" name="companyName">
            <Input placeholder="Nhập tên công ty" />
          </Form.Item>

          <Form.Item label="Số khách" name="numberOfGuests">
            <InputNumber min={0} placeholder="0" style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi ngay
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ContactForm;
