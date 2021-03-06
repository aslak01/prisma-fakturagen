import { parseDate, formatNumberToCurrency } from '$lib/utils'

export const drawTitle = (title, settings) => {
  const page = settings.page
  const size = settings.titleSize
  const font = settings.boldFont
  const y = settings.height - settings.yMargin
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)

  page.drawText(title, {
    x,
    y,
    size,
    font,
    color,
  })
}

export const drawKunde = (kunde, settings) => {
  const page = settings.page
  const size = settings.lineSize
  const font = settings.boldFont
  const y = settings.height - settings.yMargin - settings.marginTop
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)
  const lineHeight = font.heightAtSize(size) + 5

  for (const [i, value] of Object.entries(kunde).entries()) {
    let string = value[1]
    if (value[0] === 'orgno') {
      string = 'Org.nr. ' + value[1]
    }

    page.drawText(string, {
      x,
      y: y - lineHeight * i,
      size,
      font,
      color,
    })
  }
}

export const drawFakturaLinjer = (
  lineHeadings,
  lines,
  settings,
  currency = 'EUR'
) => {
  const page = settings.page
  const size = settings.lineSize
  const font = settings.font
  const boldFont = settings.boldFont
  const width = settings.width - settings.xMargin
  const y = settings.height - settings.yMargin - settings.marginTop * 3
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)
  const lineHeight = font.heightAtSize(size) + 5
  const lineHeightBold = boldFont.heightAtSize(size)

  const xPos = [x, x + 80, width]

  page.drawLine({
    start: { x, y: y - lineHeightBold / 2 },
    end: { x: width, y: y - lineHeightBold / 2 },
    thickness: 1,
    color,
  })
  for (const [i, value] of Object.values(lineHeadings).entries()) {
    page.drawText(value, {
      x: xPos[i] - (i === 2 ? boldFont.widthOfTextAtSize(value, size) : 0),
      y,
      size,
      color,
      font: boldFont,
    })
  }
  for (const [l, obj] of lines.entries()) {
    for (const [i, value] of Object.values(obj).entries()) {
      let string
      if (typeof value.getMonth === 'function') {
        string = parseDate(value)
      } else if (typeof value === 'number') {
        string = formatNumberToCurrency(value, currency)
      } else {
        string = String(value)
      }
      page.drawText(string, {
        x: xPos[i] - (i === 2 ? boldFont.widthOfTextAtSize(string, size) : 0),
        y: y - lineHeight * (l + 1),
        size,
        color,
        font,
      })
    }
  }
  return {
    start: y,
    end: y - lineHeight * (lines.length + 0.3),
  }
}

export const drawFakturaInfo = (company, fakturaMeta, settings) => {
  const page = settings.page
  const size = settings.lineSize
  const font = settings.font
  const boldFont = settings.boldFont
  const width = settings.width - settings.xMargin
  const y = settings.height - settings.yMargin + 3
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)
  const lineHeight = font.heightAtSize(size) + 5

  for (const [i, value] of Object.entries(company).entries()) {
    let string = value[1]
    if (value[0] === 'orgno') {
      string = 'Org.nr. ' + value[1]
    }
    page.drawText(string, {
      x: width - font.widthOfTextAtSize(string, size),
      y: y - lineHeight * i,
      size,
      font,
      color,
    })
  }
  for (const [i, value] of Object.values(fakturaMeta).entries()) {
    let verdi
    if (typeof value.value.getMonth === 'function') {
      verdi = parseDate(value.value)
    } else {
      verdi = String(value.value)
    }

    page.drawText(verdi, {
      x: width - font.widthOfTextAtSize(verdi, size),
      y: y - lineHeight * (i + 4),
      size,
      font,
      color,
    })
    page.drawText(value.title, {
      x: width - 140,
      y: y - lineHeight * (i + 4),
      size,
      font: boldFont,
      color,
    })
  }
}

export const drawSums = (lines, settings, linesEnd, currency = 'EUR') => {
  const page = settings.page
  const size = settings.lineSize
  const font = settings.font
  const boldFont = settings.boldFont
  const width = settings.width - settings.xMargin
  const y = settings.height - settings.yMargin - settings.marginTop
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)
  const lineHeight = font.heightAtSize(size) + 5
  const lineHeightBold = boldFont.heightAtSize(size)

  const sum = formatNumberToCurrency(
    lines.reduce((a, b) => +a + +b.pris, 0),
    currency
  )
  page.drawText(sum, {
    x: width - font.widthOfTextAtSize(sum, size),
    y: linesEnd - 30,
    size,
    font: boldFont,
    color,
  })
  page.drawText('Sum', {
    x: width - font.widthOfTextAtSize(sum, size) - 40,
    y: linesEnd - 30,
    size,
    font,
    color,
  })
  const noMva = 'MVA: 0%'
  page.drawText(noMva, {
    x: width - font.widthOfTextAtSize(noMva, size),
    y: linesEnd - 45,
    size,
    font,
    color,
  })
}

export const drawPayTo = (bank, settings, linesEnd) => {
  const page = settings.page
  const size = settings.lineSize
  const font = settings.font
  const boldFont = settings.boldFont
  const width = settings.width - settings.xMargin
  const y = settings.height - settings.yMargin - settings.marginTop
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)
  const lineHeight = font.heightAtSize(size) + 5
  const lineHeightBold = boldFont.heightAtSize(size)

  const start = linesEnd - 80

  page.drawText('Betales til:', {
    x,
    y: start,
    size,
    font: boldFont,
    color,
  })
  for (const [i, value] of Object.entries(bank).entries()) {
    let key = value[0]
    let string = value[1]
    if (key === 'kontonr') {
      key = 'Kontonummer'
    } else if (key === 'bic') {
      key = 'BIC'
    } else if (key === 'iban') {
      key = 'IBAN'
    } else if (key === 'bank') {
      key = 'Bank'
    }
    page.drawText(key, {
      x,
      y: start - lineHeight * (i + 1),
      size,
      font,
      color,
    })
    page.drawText(string, {
      x: x + 80,
      y: start - lineHeight * (i + 1),
      size,
      font,
      color,
    })
  }
}
