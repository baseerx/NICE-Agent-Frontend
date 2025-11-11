export function getCsrfToken() {
  const csrftoken = document.cookie.split("=")[1];
  if (csrftoken) {
    return csrftoken;
  }
  return "";
}
