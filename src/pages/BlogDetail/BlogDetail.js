import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl, baseUrlImage } from "../../base/baseUrl";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import formatDate from "../../utils/formatDate";
import { Card } from "antd";
import '../Blog/Blog.css'
const { Meta } = Card;

const BlogDetail = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);

  const getAllBlog = async () => {
    try {
      const res = await axios.get(`${baseUrl}blogs/get-all-blogs`);
      const blogs = res?.data;
      setBlogs(blogs);
    } catch (error) {}
  };
  useEffect(() => {
    getAllBlog();
  }, []);

  const findBlog = blogs.find((item) => item._id === id);
  const filterAllBlog = blogs.filter((item) => item._id !== id);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  return (
    <div className="w-1240 w-375 py-5">
      <Row>
        <Col sm={9}>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-[26px] fw-bold">{findBlog?.title}</h1>
            </div>
            <span className="text-gray-500">
              Ngày đăng: {formatDate(findBlog?.createdAt)}
            </span>
            <div className="w-[100%] h-auto">
              <img
                src={findBlog?.image}
                alt=""
                className="w-[100%] rounded-lg h-[500px] object-cover"
              />
            </div>
            <div dangerouslySetInnerHTML={{ __html: findBlog?.content }}></div>
          </div>
        </Col>
        <Col sm={3} className="">
          <span className="fw-bold text-[20px]  mb-5 block">
            Xem thêm nội dung khác
          </span>
          <div className="flex flex-col gap-4 sticky-sidebar-blog ">
            {filterAllBlog?.map((item) => {
              return (
                <Card
                  hoverable
                  className="bsd"
                  style={{
                    width: "100%",
                  }}
                  cover={<img alt="example" width="100%" src={item?.image} />}
                >
                  <Meta
                    title={
                      <Link to={`/tin-tuc/${item?._id}`} className="w-full text-black">
                        {item?.title}
                      </Link>
                    }
                    description= {formatDate(item?.createdAt)}
                  />
                </Card>
              );
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BlogDetail;
