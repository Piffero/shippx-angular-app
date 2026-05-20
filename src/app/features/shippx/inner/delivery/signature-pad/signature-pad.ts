import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'rd-delivery-signature-pad',
  imports: [CommonModule],
  templateUrl: './signature-pad.html',
  styleUrl: './signature-pad.css',
})
export class SignaturePad implements AfterViewInit {
  @ViewChild('sigCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Output() onSave = new EventEmitter<File>();

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  isEmpty = signal(true);

  ngAfterViewInit() {
    this.initContext();
  }

  private initContext() {
    const canvasEl = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d')!;

    // Ajusta a resolução para não ficar serrilhado em telas retina
    const rect = canvasEl.getBoundingClientRect();
    canvasEl.width = rect.width;
    canvasEl.height = rect.height;

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#001f54'; // Azul Andrometra
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    this.isEmpty.set(false);
    this.draw(event);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    event.preventDefault();

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = ('touches' in event) ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const y = ('touches' in event) ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.beginPath();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.isEmpty.set(true);
  }

  async save() {
    const dataUrl = this.canvas.nativeElement.toDataURL('image/png');
    
    // Converte DataURL para File para enviar ao Storage do Supabase
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'signature.png', { type: 'image/png' });
    
    this.onSave.emit(file);
  }
}
