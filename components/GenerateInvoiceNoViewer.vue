<template>
  <div id="webviewer" ref="viewer"></div>
</template>
<script lang="ts">
async function getData() {
  return {
    "invoices": [
      {
        "BondNumber": "Z00001",
        "Principal": "Fake Name",
        "Obligee": "City of Abilene",
        "BondType": "L&P",
        "IssuingCarrier": "Fake Insurance Company",
        "BondAmount": "$25,000.00",
        "InvoiceCost": "$100.00"
      }
    ],
    "GrandTotal": "$100.00",
    "TodaysDate": "1/11/2024",
    "DueDate": "Before Bond Issuance",
    "PrincipalName": "Fake Name",
    "PrincipalAddress1": "4546 Corporate Dr",
    "PrincipalCity": "West Des Moines",
    "PrincipalState": "Iowa",
    "PrincipalZipCode": "50266",
    "InsuranceAgencyName": "Fake Agency"
  }
}

export default {
  name: 'WebViewer',
  props: {
    path: String,
    url: String,
    configPath: { type: String, default: "./pdftronConfigs/config.js" },
  },
  mounted: async function () {
    import('@pdftron/webviewer').then(async () => {
      //@ts-expect-error
      WebViewer({
        path: '../webviewer',
        initialDoc: this.url,
        licenseKey: '',
        config: this.configPath,
        disabledElements: ['header'],
        fullAPI: true
      }, this.$refs.viewer).then(async (instance: any) => {
        const { Feature } = instance.UI;
        const { annotationManager, PDFNet } = instance.Core;

        await PDFNet.initialize();

        annotationManager.enableReadOnlyMode();
        instance.UI.disableFeatures([Feature.FilePicker]);
        instance.UI.disableElements(['ribbons', 'toolsHeader', 'contextMenuPopup']);

        const fileName = 'ZipInvoice';

        instance.UI.setHeaderItems((header: any) => {
          const items = header.getItems().slice(5, -2);
          header.update(items);
          header.get('zoomOverlayButton').insertBefore({
            type: 'actionButton',
            img: 'icon-header-print-line',
            title: 'Print',
            onClick: async () => {
              await instance.UI.print();
            },
            dataElement: 'printButton'
          });

          header.get('zoomOverlayButton').insertBefore({
            type: 'actionButton',
            img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#adb5bd" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z"/></svg>',
            title: 'Download',
            onClick: async () => {
              const options = {
                filename: fileName,
                downloadType: 'pdf',
              };
              instance.UI.downloadPdf(options);
            }
          });
          header.get('zoomOverlayButton').insertBefore({ type: 'divider', dataElement: 'S3Divider' });
          header.get('printButton').insertBefore({ type: 'spacer' });
        });

        instance.UI.setPrintQuality(5);

        const jsonData = await getData();

        await instance.Core.officeToPDFBuffer('../../ZipBondsInvoice.docx', {
          officeOptions: {
            templateValues: jsonData
          }
        }).then(async (buffer: ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray) => {
          const pdfNetDoc = await PDFNet.PDFDoc.createFromBuffer(buffer)
          instance.UI.loadDocument(pdfNetDoc)
        });

      })
    })
  }
}
</script>