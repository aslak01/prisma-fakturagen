<script>
  import { onMount } from 'svelte'

  import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

  import {
    drawTitle,
    drawKunde,
    drawFakturaLinjer,
    drawFakturaInfo,
    drawSums,
    drawPayTo,
  } from './drawRoutines.js'

  let pdf
  let pdfWasGenerated = false

  const title = 'Faktura'
  const randomDate = () =>
    new Date().getTime() - 1000 * 3600 * 24 * Math.floor(Math.random() * 31)
  const aMonthInTheFuture = () => new Date().getTime() + 1000 * 3600 * 24 * 30.5

  export let kunde = {
    navn: import.meta.env.VITE_MY_CUSTOMER_NAME || 'Kunde kundesen',
    orgnr: import.meta.env.VITE_MY_CUSTOMER_ORGNO || '123321312',
    adr: import.meta.env.VITE_MY_CUSTOMER_ADDR || 'Eksempelvei 21, Byen 1234',
  }
  export let lineHeadings = {
    dato: 'Dato',
    beskrivelse: 'Beskrivelse',
    pris: 'Pris',
  }

  import { firstFaktura } from '$lib/demofaktura.js'

  let test = firstFaktura || false

  export let lines = test.length
    ? test
    : [
        {
          dato: new Date(randomDate()),
          beskrivelse: 'Noe som koster penger',
          pris: 123.3,
        },
        {
          dato: new Date(randomDate()),
          beskrivelse: 'Noe annet som koster penger',
          pris: 4.2,
        },
        {
          dato: new Date(randomDate()),
          beskrivelse: 'En tredje ting',
          pris: 69,
        },
        {
          dato: new Date(randomDate()),
          beskrivelse: 'En fjerde ting',
          pris: 42,
        },
      ]

  const dittFirma = {
    navn: import.meta.env.VITE_YOUR_FIRM_NAME || 'Mitt firma',
    orgno: import.meta.env.VITE_YOUR_FIRM_ORGNO || '123123123',
    addr: import.meta.env.VITE_YOUR_FIRM_ADDR || 'Adressegassa 12, Sted 1234',
  }
  export let fakturaMeta = {
    fakturaDato: {
      title: 'Fakturadato',
      value: new Date(),
    },
    betalingsFrist: {
      title: 'Betalingsfrist',
      value: new Date(aMonthInTheFuture()),
    },
    fakturaNr: {
      title: 'Fakturanummer',
      value: 1,
    },
  }

  const dinBank = {
    accno: import.meta.env.VITE_YOUR_BANK_ACC || '123123123',
    iban: import.meta.env.VITE_YOUR_IBAN || 'iban123123123',
    bic: import.meta.env.VITE_YOUR_BIC || 'BANKNAME123',
    bank: import.meta.env.VITE_YOUR_BANK || 'My Bank',
  }

  async function createPdf() {
    const pdfDoc = await PDFDocument.create()
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    pdfDoc.setTitle('Faktura 1')
    pdfDoc.setAuthor(import.meta.env.VITE_MY_NAME || 'Jonas Jonassen')
    pdfDoc.setSubject(import.meta.env.VITE_MY_SERVICE || 'Tjeneste')
    pdfDoc.setCreationDate(new Date('2018-06-24T01:58:37.228Z'))
    pdfDoc.setModificationDate(new Date('2019-12-21T07:00:11.000Z'))

    const settings = {
      page,
      width,
      height,
      font: helvetica,
      boldFont: helveticaBold,
      rgb,
      titleSize: 15,
      lineSize: 10,
      xMargin: 100,
      yMargin: 100,
    }

    drawTitle(title, settings)
    drawKunde(kunde, settings)
    drawFakturaLinjer(lineHeadings, lines, settings)
    drawFakturaInfo(dittFirma, fakturaMeta, settings)

    const test = drawFakturaLinjer(lineHeadings, lines, settings)

    page.drawLine({
      start: { x: settings.xMargin, y: test.end },
      end: { x: settings.width - settings.xMargin, y: test.end },
      thickness: 1,
      color: settings.color,
    })

    drawSums(lines, settings, test.end)

    drawPayTo(dinBank, settings, test.end)

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
    pdfWasGenerated = true
    pdf.src = pdfDataUri
  }

  onMount(() => {
    createPdf()
  })
</script>

<div class="preview" class:invisible={!pdfWasGenerated}>
  <iframe title="pdf" bind:this={pdf} style="width: 100%; height: 100%;" />
</div>

<style>
  .invisible {
    display: none;
  }
  .preview {
    height: 70vh;
  }
</style>
