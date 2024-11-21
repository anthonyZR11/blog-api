import dayjs from 'dayjs'
export const responseData = ({ status = null, message = '', data = [], error = null, page, limit, totalRows }) => {
  return {
    status,
    message,
    data,
    meta: {
      page,
      limit,
      totalRows
    },
    error
  }
}

export const formatDateTime = (date = new Date()) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
