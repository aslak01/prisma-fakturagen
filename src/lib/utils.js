export const parseDate = (d) => {
  const date = new Date(d)
  return new Intl.DateTimeFormat('nb-NO').format(date)
}

export const parseISOdate = (d) => {
  const date = new Date(d)
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const formatNumberToCurrency = (n, currency = 'EUR') => {
  return new Intl.NumberFormat('nb-NO', { style: 'currency', currency }).format(
    n
  )
}

export const splitStringInNs = (string, n = 3) => {
  let str = string
  if (typeof str !== 'string' || !(str instanceof String)) {
    str = String(str)
  }
  return [...str]
    .map((d, i) => (i % n === 0 ? ' ' + d : d))
    .join('')
    .trim()
}
