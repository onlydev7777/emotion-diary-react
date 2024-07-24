export const getStringedDate = (targetDate) => {
  let year = targetDate.getFullYear();
  let month = targetDate.getMonth() + 1;
  let date = targetDate.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (date < 10) {
    date = "0" + date;
  }

  return year + "-" + month + "-" + date;
}
export const getDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
export const getDateYearMonth = (dateString) => {
  const year = Number(dateString.substring(0, 4));
  const month = Number(dateString.substring(5, 6));
  return new Date(year, month - 1);
}
export const getStringYearMonth = (date) => {
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  return String(date.getFullYear()) + String(month);
}