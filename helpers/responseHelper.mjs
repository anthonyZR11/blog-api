export const responseData = ({ status = null, message = '', data = null, error = null }) => {
  return {
    status,
    message,
    data,
    error
  }
}
