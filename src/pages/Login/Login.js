import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import logoLogin from "../../images/icons/vtv-logo.fa3631b9.png";
import { Input, Form, message, Button } from "antd";
import { Link } from "react-router-dom";
import logoGG from "../../images/icons/Google_Icons-09-512.webp";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../config/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../base/baseUrl";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });
        await axios.post(`${baseUrl}email/send-email`, {
          email: user.email,
          displayName: user.displayName,
        });
      }
      sessionStorage.setItem("userToken", token);
      navigate("/trang-chu");
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Lưu thông tin người dùng
      } else {
        setUser(null); // Đặt lại nếu người dùng đăng xuất
      }
    });

    return () => unsubscribe();
  }, []);
  console.log(user);
  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}auth/login`, values);

      sessionStorage.setItem("userToken", response.data.token);
      sessionStorage.setItem("emailUser", response.data.user.email);
      message.success("Đăng nhập thành công!");
      navigate("/trang-chu");
      form.resetFields();
    } catch (error) {
      message.error("Đăng nhập thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-1240 w-375 py-10 flex justify-center">
        <div className="w-[500px] justify-center items-center flex">
          <div className="flex w-full flex-col justify-center items-center gap-5">
            <div>
              <img src={logoLogin} className="object-cover w-[300px]" alt="" />
            </div>
            <div className="w-full">
              <Form
                onFinish={handleFinish}
                form={form}
                style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
                className="bg-white p-4  w-full rounded-xl flex flex-col justify-center items-center gap-4"
              >
                <div>
                  <span className="uppercase text-[#276ca1] text-[28px] fw-bold">
                    Đăng nhập
                  </span>
                </div>
                <div className="w-full flex flex-col justify-center items-center gap-3 ">
                  <div className="flex flex-col w-full">
                    <div className="w-full flex flex-col gap-2">
                      <label className="fw-bold">
                        Số điện thoại hoặc email *
                      </label>
                      <Form.Item
                        className="w-full"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                        ]}
                      >
                        <Input placeholder="Nhập email" />
                      </Form.Item>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <label className="fw-bold">Mật khẩu</label>
                      <Form.Item
                        className="w-full"
                        name="password"
                        rules={[
                          { required: true, message: "Vui lòng nhập mật khẩu" },
                        ]}
                      >
                        <Input.Password placeholder="Nhập mật khẩu" />
                      </Form.Item>
                    </div>
                  </div>
                  <p>
                    Chưa là thành viên ?{" "}
                    <Link to="/signup" className="text-[#276ca1]">
                      Đăng ký ngay
                    </Link>
                  </p>
                  <ReCAPTCHA
                    sitekey="6LcFUk8qAAAAAAZ_9oNM3NHcJGB_jGLU1Nq6dT-f"
                    onChange={onCaptchaChange}
                  />
                  <button
                    className=" rounded-lg   w-[250px]  bg-red-500 text-white p-3"
                    type="submit"
                  >
                    Đăng nhập
                  </button>
                  <span>Hoặc</span>
                  <button
                    onClick={signInWithGoogle}
                    className="btn w-[250px] flex items-center  bg-white outline border text-black px-3"
                    type="button"
                  >
                    <img
                      alt=" "
                      src={logoGG}
                      style={{ width: "40px", height: "auto" }}
                    />
                    Đăng nhập với Google
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
