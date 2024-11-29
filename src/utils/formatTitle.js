const convertToSlug = (text) => {
  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Tách các ký tự có dấu ra khỏi chữ cái
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các ký tự dấu
  };

  return removeAccents(text)
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w\-]+/g, "") // Loại bỏ các ký tự đặc biệt (ngoại trừ gạch ngang)
    .replace(/\-\-+/g, "-") // Loại bỏ gạch ngang thừa
    .replace(/^-+/, "") // Loại bỏ gạch ngang ở đầu chuỗi
    .replace(/-+$/, ""); // Loại bỏ gạch ngang ở cuối chuỗi
};
export default convertToSlug;
