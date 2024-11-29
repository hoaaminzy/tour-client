import dayjs from "dayjs";
import "dayjs/locale/en-gb"; // Import locale if needed for specific formatting

const formatDate = (dateString) => {
  return dayjs(dateString).format("DD-MM-YYYY");
};
export default formatDate;
