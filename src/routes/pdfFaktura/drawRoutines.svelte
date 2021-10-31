import { parseDate, formatNumberToCurrency } from '$lib/utils'

export const drawTitle = (title, settings) => {
  const page = settings.page
  const size = settings.titleSize
  const font = settings.font
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
  const font = settings.font
  const y = settings.height - settings.yMargin - 60
  const x = settings.xMargin
  const color = settings.rgb(0, 0, 0)
  const lineHeight = font.heightAtSize(size) + 5

  for (const [i, value] of Object.values(kunde).entries()) {
    page.drawText(value, {
      x,
      y: y - lineHeight * i,
      size,
      font,
      color,
    })
  }
}

export const drawFakturaLinjer = (lineHeadings, lines, settings) => {
  const page = settings.page
  const size = settings.lineSize
  const font = settings.font
  const boldFont = settings.boldFont
  const width = settings.width - settings.xMargin
  const y = settings.height - settings.yMargin - 160
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
    console.log('width', width, i)
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
        string = formatNumberToCurrency(value)
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
