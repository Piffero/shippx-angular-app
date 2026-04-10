import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'rd-shippings-lb-printing',
  imports: [QRCodeComponent],
  templateUrl: './lb-printing.html',
  styleUrl: './lb-printing.css',
})
export class LbPrinting {
  packageData = input.required<any>();

  @ViewChild('qrcodeElement', { static: false }) qrcodeElement!: ElementRef;


  generatePDF() {
    const pkg = this.packageData();
    
    // 1. Captura o Canvas gerado pelo angularx-qrcode
    const canvas = this.qrcodeElement.nativeElement.querySelector('canvas');
    if (!canvas) {
      console.error('QR Code ainda não foi gerado');
      return;
    }
    const qrDataUrl = canvas.toDataURL('image/png');

    // 2. Configura o PDF (Tamanho 100x150mm - Padrão Logístico)
    const doc = new jsPDF({
      unit: 'mm',
      format: [100, 150]
    });

    // --- DESIGN DA ETIQUETA ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SHIPPX LOGÍSTICA', 50, 15, { align: 'center' });
    doc.line(5, 20, 95, 20);

    doc.setFontSize(10);
    doc.text(`MARKETPLACE: ${pkg.origin_platform}`, 10, 30);
    doc.text(`PEDIDO: ${pkg.external_order_id}`, 10, 37);

    // 3. Inserir o QR Code capturado
    doc.addImage(qrDataUrl, 'PNG', 25, 45, 50, 50);

    // 4. Detalhes do Destino (Hub)
    doc.setFontSize(9);
    doc.text('POSTO DE COLETA (DESTINO):', 10, 105);
    doc.setFontSize(12);
    doc.text(pkg.partner_hubs?.name || 'CENTRAL DE DISTRIBUIÇÃO', 10, 112);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Instruções: Bipar este QR Code na recepção do posto.', 50, 135, { align: 'center' });

    // 5. Rodapé
    doc.setFontSize(7);
    const now = new Date().toLocaleString();
    doc.text(`Emitido em: ${now}`, 95, 145, { align: 'right' });

    // Abre para impressão
    window.open(doc.output('bloburl'), '_blank');
  }
}
