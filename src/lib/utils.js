export const parseDate = (d) => {
  const date = new Date(d)
  return new Intl.DateTimeFormat('nb-NO').format(date)
}
