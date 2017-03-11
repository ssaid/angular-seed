import { Component, Directive, ElementRef, Input, HostListener, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({ 
  moduleId: module.id,
  selector: 'input-barcode',
  template: `
  <md-card>
      <md-slide-toggle [(ngModel)]="barcodeReaderOn">Automatic Scanner</md-slide-toggle>

      <md-input-container class="example-full-width">
        <input mdInput placeholder="Barcode" [disabled]="barcodeReaderOn" value="Google" [(ngModel)]="scanBuffer" (keyup.enter)="scanFinished(scanBuffer)">
      </md-input-container>
  </md-card>
  `,

})
export class BarcodeComponent implements OnChanges {
  scanBuffer: string = '';
  @Input() barcodeReaderOn: boolean = true;
  @Input() endKeyCode: string;
  @Output() onScannedString: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.info(changes);
  }

  switchOnScanner() {
    this.barcodeReaderOn = true;
  }

  switchOffScanner() {
    this.barcodeReaderOn = false;
  }

  constructor() {
  }

  manageBuffer(keyStr: string, keyCode: number) {
    // console.info('Scanned:', keyStr, keyCode);
    // Assume default end character ~Intro(13)~
    if (keyCode === (parseInt(this.endKeyCode) || 13)) {
      this.scanFinished(this.scanBuffer);
    }
    else {
      this.scanBuffer += keyStr;
    }
  }

  scanFinished(scannedString: string) {
    // console.warn('Scan finished -> ', this.scanBuffer);
    if (scannedString !== ''){
      console.info("Scanned: ", scannedString);
      this.onScannedString.emit(scannedString);
      this.scanBuffer = '';
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (this.barcodeReaderOn){
      this.manageBuffer(event.key, event.keyCode || event.which);
    }
  }

}

