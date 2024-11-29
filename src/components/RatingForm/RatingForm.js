import React, { useState, useEffect } from "react";
import {
  Form,
  Rate,
  Input,
  Button,
  List,
  Avatar,
  Typography,
  Modal,
  message,
} from "antd";
import axios from "axios"; // Sử dụng axios để gọi API
import { baseUrl } from "../../base/baseUrl";

const { TextArea } = Input;
const { Text } = Typography;
const RatingForm = ({ user, slugTour }) => {
  const tokenUser = sessionStorage.getItem("emailUser");
  const [allUsers, setAllUsers] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [replyComment, setReplyComment] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    setShowReplies(!showReplies); // Toggle between showing and hiding replies
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}auth/get-all-users`);
      const users = response?.data;
      setAllUsers(users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAllBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}booking/get-all-bookings`);
      const bookings = response?.data?.bookings;
      setAllBookings(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getAllTours = async () => {
    try {
      const response = await axios.get(`${baseUrl}tour/get-all-tours`);
      const tours = response?.data?.tours;
      setAllTours(tours);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    getAllBookings();
    getAllUsers();
    getAllTours();
  }, []);

  const filterUserInfor = allUsers.find((item) => item?.email === tokenUser);
  const filterToursDetail = allTours?.find((item) => item?.slug === slugTour);
  const checkReview = allBookings.filter(
    (item) => item.status === "Đã hoàn thành tour"
  );

  const [form] = Form.useForm();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseUrl}review/get-all-reviews`);
      setComments(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách bình luận");
    }
  };

  const filterReviewDetail = comments.filter(
    (item) => item?.tourId?.slug === slugTour
  );

  const onSubmit = async () => {
    try {
      await form.validateFields();

      const newComment = {
        rating,
        comment,
        userId: user || filterUserInfor,
        tourId: filterToursDetail,
      };
      await axios.post(`${baseUrl}review/add-review`, newComment);

      fetchComments();

      setRating(0);
      setComment("");
      form.resetFields();

      message.success("Gửi đánh giá thành công!");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin hoặc kiểm tra lại lỗi.");
      console.log(error);
    }
  };

  const handleReply = (commentId) => {
    setReplyComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle hiển thị form trả lời
    }));
  };

  // Gửi phản hồi cho bình luận
  const onReplySubmit = async (parentCommentId, replyText) => {
    try {
      const replyData = {
        reviewId: parentCommentId,
        reply: replyText,
        userId: user || filterUserInfor,
      };
      await axios.post(`${baseUrl}review/add-reply`, replyData); // Giả sử bạn có route /review/add-reply

      fetchComments();
      message.success("Phản hồi thành công!");
    } catch (error) {
      message.error("Không thể gửi phản hồi");
      console.log(error);
    }
  };
  const commentsToShow = showAllComments
    ? filterReviewDetail
    : filterReviewDetail.slice(0, 3);

  const toggleComments = () => {
    setShowReplies(!showReplies); // Toggle between showing all or just 2 comments
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener to track resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <Modal
        title="Đánh giá tour"
        open={isModalOpen}
        onOk={handleOk}
        centered
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          className="flex flex-col pt-3 gap-3"
          layout="vertical"
          onFinish={onSubmit}
        >
          <div className="justify-center flex">
            <img
              src={filterToursDetail?.images[0]}
              alt=""
              className={` ${
                isMobile ? "w-full" : "w-[300px]"
              }  object-cover h-[200px] rounded-lg `}
            />
          </div>
          <span className="text-center block fw-bold text-[20px]">
            {filterToursDetail?.title}
          </span>
          <Form.Item
            className="flex justify-center"
            name="rating"
            rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
          >
            <Rate
              className={` ${isMobile ? "text-[28px]" : "text-[50px]"}`}
              onChange={setRating}
              value={rating}
            />
          </Form.Item>

          <Form.Item
            label="Bình luận"
            name="comment"
            rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
          >
            <TextArea
              rows={4}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <List
        className="comment-list"
        header={`Có ${commentsToShow.length} bình luận`}
        itemLayout="horizontal"
        dataSource={commentsToShow.reverse()}
        renderItem={(item) => (
          <li key={item._id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "16px 0px",
              }}
            >
              <div className="">
                <div className="flex gap-3 items-center">
                  <div>
                    <img
                      src={
                        item?.userId?.photoURL ||
                        "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                      }
                      className="w-[40px] h-[40px]"
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col ">
                    <Text className="fw-bold">{item.userId.displayName}</Text>
                    <Rate
                      className={`${isMobile ? "text-[12px]" : ""}`}
                      disabled
                      value={item.rating}
                    />

                    <div className="flex gap-4">
                      <Text type="secondary">
                        {new Date(item.datetime).toLocaleString()}
                      </Text>
                      <Text
                        className="cursor-pointer"
                        onClick={() => handleReply(item._id)}
                        type="secondary"
                      >
                        Trả lời
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="ml-13 ">
                  <p>{item.comment}</p>
                </div>
              </div>
            </div>

            <div className="ml-10">
              {item.replies && item.replies.length > 0 ? (
                <List
                  className="reply-list"
                  dataSource={item.replies}
                  renderItem={(reply) => (
                    <li key={reply._id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          margin: "10px 0px",
                        }}
                      >
                        <Avatar>{reply.userId.displayName[0]}</Avatar>
                        <div className="flex flex-col gap-1">
                          <Text>{reply.userId.displayName}</Text>
                          <Text>{reply.reply}</Text>
                          <Text type="secondary">
                            {new Date(reply.datetime).toLocaleString()}
                          </Text>
                        </div>
                      </div>
                    </li>
                  )}
                />
              ) : (
                <Text type="secondary">Không có bình luận</Text>
              )}
            </div>

            {replyComment[item._id] && (
              <Form
                onFinish={(values) => onReplySubmit(item._id, values.reply)}
                layout="vertical"
              >
                <Form.Item
                  name="reply"
                  rules={[
                    { required: true, message: "Vui lòng nhập phản hồi!" },
                  ]}
                >
                  <TextArea rows={2} placeholder="Nhập phản hồi của bạn" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Gửi phản hồi
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Hiển thị danh sách các phản hồi */}
          </li>
        )}
      />
      <div className="w-full gap-3 flex">
        {filterReviewDetail.length > 3 && (
          <button
            className="w-full btn bg-gray-300"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? "Thu gọn đánh giá" : "Xem thêm đánh giá"}
          </button>
        )}
        <button onClick={showModal} className="btn w-full btn-primary">
          Viết bình luận
        </button>
      </div>
    </div>
  );
};

export default RatingForm;
