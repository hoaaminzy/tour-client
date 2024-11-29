// src/components/Breadcrumb.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  // Chia nhỏ `pathname` thành các phần để tạo breadcrumb
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav>
      <ul style={{ display: "flex", listStyle: "none" }} className="gap-2">
        <li>
          <Link className="text-black mr-2 fw-bold" to="/trang-chu">
            Trang chủ
          </Link>
          {pathnames.length > 0 && "/"}
        </li>
        {pathnames.map((name, index) => {
          // Xây dựng đường dẫn cho từng phần trong breadcrumb
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name}>
              {isLast ? (
                <span className="text-black fw-bold mr-2">
                  {name === "chuong-trinh" ? "Chương trình" : name}
                </span>
              ) : (
                <Link className="text-black fw-bold mr-2 " to={routeTo}>
                  {name === "chuong-trinh" ? "Chương trình" : name}
                </Link>
              )}
              {!isLast && `/`}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
