const parseISODate = (isoString) => {
  const date = new Date(isoString);

  // Lấy các phần tử thời gian từ đối tượng Date
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // getUTCMonth() trả về từ 0-11 nên cần cộng 1
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");

  return (
    <div>
      <h3>Phân tích chuỗi thời gian:</h3>
      <p>{year}</p>
      <p>{month}</p>
      <p>{day}</p>
      <p>{hours}</p>
      <p>{minutes}</p>
    </div>
  );
};
export default parseISODate;
