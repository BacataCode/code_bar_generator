import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';

export function useBarCodes() {
  function randomNumber(max: number, min: number) {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }

  function barcodeGenerator(barrCode: string) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barrCode, {
      format: 'CODE128',
    });
    return canvas.toDataURL('image/png');
  }

  function barcodeToImage(dataUrl: string, fileName: string) {
    const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a5' });
    doc.addImage(`${dataUrl}`, 'PNG', 10, 10, 90, 59.6);
    doc.save(`${fileName}.pdf`);
  }

  function barcodesToImage(dataUrls: string[], fileName: string, names: string[]) {
    const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a5' });

    const sizeData = {
      width: 90,
      height: 59.6,
      spacing: 10,
      imagesPerRow: 3,
      imagesPerPage: 18,
    };

    let idxImage = 0;

    dataUrls.forEach((url, idx) => {
      // Si el índice es divisible por el número de imágenes por página, crear una nueva página
      if (idxImage % sizeData.imagesPerPage === 0 && idxImage !== 0) {
        doc.addPage();
        idxImage = 0;
      }

      // posición en el eje X (horizontal)
      const xPosition = sizeData.spacing + (idxImage % sizeData.imagesPerRow) * (sizeData.width + sizeData.spacing);

      // posición en el eje Y (vertical)
      const yPosition = sizeData.spacing + Math.floor(idxImage / sizeData.imagesPerRow) * (sizeData.height + sizeData.spacing);

      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(names[idx].substring(0, 19) + `${names[idx].length >= 19 ? '...' : ''}`, xPosition - 1, yPosition - 2.5);
      // Añadir la imagen en la posición calculada
      doc.addImage(`${url}`, 'PNG', xPosition, yPosition, sizeData.width, sizeData.height);

      idxImage++;
    });

    doc.save(`${fileName}.pdf`);
  }

  return { barcodeGenerator, randomNumber, barcodeToImage, barcodesToImage };
}
