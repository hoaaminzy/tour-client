import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import logoLogin from "../../images/icons/vtv-logo.fa3631b9.png";
import { Input, Form, message, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}auth/signup`, values);
      message.success("Đăng ký thành công!");
      form.resetFields();
      navigate("/dang-nhap");
    } catch (error) {
      message.error("There was an error create user!");
      console.error("Error adding tour:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1240 w-375 py-10 flex justify-center">
      <div className="w-[500px] justify-center items-center flex">
        <div className="flex w-full flex-col justify-center items-center gap-5">
          <div>
            <img src={logoLogin} className="object-cover w-[300px]" alt="" />
          </div>
          <div className="w-full">
            <Form
              onFinish={handleFinish}
              style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
              className="bg-white p-4 w-full rounded-xl flex flex-col justify-center items-center gap-4"
            >
              <div>
                <span className="uppercase text-[#276ca1] text-[28px] fw-bold">
                  Đăng ký
                </span>
              </div>
              <div className="w-full flex flex-col justify-center items-center gap-3">
                <Form.Item
                  className="w-full"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  name="displayName"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^\d{10,11}$/,
                      message: "Số điện thoại không hợp lệ (10-11 số)!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item className="w-full" name="address">
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <p>
                  Đã là thành viên?{" "}
                  <Link to="/dang-nhap" className="text-[#276ca1]">
                    Đăng nhập ngay
                  </Link>
                </p>

                <button
                  className="w-[250px] rounded-md bg-red-500 text-white py-3"
                  type="submit"
                >
                  Đăng ký
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
