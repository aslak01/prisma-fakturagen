import { parseDate } from './utils'

const testInvoicability = (json) => {
  const res = json.filter(
    (x) =>
      x.jobsInvoice.invoicingState === 'CAN_CREATE_NEW_INVOICE' &&
      x.overview.status === 'NOT_INVOICED'
  )
  return res
}
const returnRelevantRows = (json) => {
  const res = json.map((x) => {
    return {
      dato: parseDate(x.overview.deliveryDate),
      beskrivelse:
        x.overview.sourceLanguage.symbol +
        ' > ' +
        x.overview.targetLanguages[0].symbol +
        '    ' +
        x.overview.idNumber,
      pris: x.overview.jobValue.value,
    }
  })
  return res
}

export const parseJson = (XTRFjson) => {
  const json = XTRFjson
  const invoicable = testInvoicability(json)
  const relevantInfo = returnRelevantRows(invoicable)
  return relevantInfo
}
