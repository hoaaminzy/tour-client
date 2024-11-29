import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, baseUrlImage } from "../../base/baseUrl";
import formatDate from "../../utils/formatDate";
import { Link } from "react-router-dom";
import { Card } from "antd";
import "./Blog.css";
const { Meta } = Card;
const Blog = () => {
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
    <div className="w-1240 w-375 py-5 tintuc">
      <span className="uppercase fw-bold text-[28px] mb-5 block text-center text-[#276ca1]">
        Tin tức
      </span>
      <div className={` ${isMobile ? " " : "grid grid-cols-3 gap-5 "}`}>
        {blogs?.map((item) => {
          return (
            // <div className="flex bsd gap-3 flex-col h-[400px]  rounded-lg overflow-hidden">
            //   <Link to={`/tin-tuc/${item?._id}`} className="h-[200px]">
            //     <img
            //       alt=""
            //       width="100%"
            //       height="100%"
            //       className="object-cover"
            //       src={item?.image}
            //     />
            //   </Link>
            //   <div className="flex p-2 h-[200px] flex-col justify-between">
            //     <span>{item?.title}</span>
            //     <span className="text-slate-500">
            //       Ngày đăng: {formatDate(item?.createdAt)}
            //     </span>
            //   </div>
            // </div>
            <Card
              hoverable
              className="bsd"
              style={{
                width: 450,
              }}
              cover={
                <Link to={`/tin-tuc/${item?._id}`} className="w-full">
                  <img alt="example" width="100%" src={item?.image} />
                </Link>
              }
            >
              <Meta
                title={item?.title}
                description={formatDate(item?.createdAt)}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
