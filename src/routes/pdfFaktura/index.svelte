<script>
  import { onMount } from 'svelte'

  import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

  import { drawTitle, drawKunde, drawFakturaLinjer } from './drawRoutines'

  let pdf
  let pdfWasGenerated = false

  const title = 'Faktura'
  const randomDate = () =>
    new Date().getTime() - 1000 * 3600 * 24 * Math.floor(Math.random() * 31)

  export let kunde = {
    navn: 'Kunde kundesen',
    orgnr: '123123123',
    adr: 'Adressevei 12, Oslo 2131',
  }
  export let lineHeadings = {
    dato: 'Dato',
    beskrivelse: 'Beskrivelse',
    pris: 'Pris',
  }

  export let lines = [
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
    navn: import.meta.env.VITE_YOUR_FIRM_NAME,
    orgno: import.meta.env.VITE_YOUR_FIRM_ORGNO,
    addr: import.meta.env.VITE_YOUR_FIRM_ADDR,
  }
  console.log(dittFirma)

  async function createPdf() {
    const pdfDoc = await PDFDocument.create()
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    // const stringWidth = helvetica.widthOfTextAtSize(string, fontSize)

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

    const test = drawFakturaLinjer(lineHeadings, lines, settings)

    page.drawLine({
      start: { x: settings.xMargin, y: test.end },
      end: { x: settings.width - settings.xMargin, y: test.end },
      thickness: 1,
      color: settings.color,
    })

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
