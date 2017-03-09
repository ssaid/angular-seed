import { Component, Directive, ElementRef, Input, HostListener, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({ 
  moduleId: module.id,
  selector: 'input-barcode',
  template: `
    <div class="row">
    <div class="col-lg-6">
        <div class="input-group">
            <div class="input-group-btn">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{barcodeReaderOn === true ? "Automatic detection" : "Manual detection"}}<span class="caret"></span></button>
                <ul class="dropdown-menu">
                    <li (click)="switchOnScanner()" [ngClass]="{'disabled': barcodeReaderOn===true}"><a>Automatic Scanner</a></li>
                    <li (click)="switchOffScanner()" [ngClass]="{'disabled': barcodeReaderOn===false}"><a>Manual Scanner</a></li>
                </ul>
            </div><!-- /btn-group -->
            <input type="text" class="form-control" aria-label="..." placeholder="Barcode" [disabled]="barcodeReaderOn" [(ngModel)]="scanBuffer" (keyup.enter)="scanFinished(scanBuffer)">
        </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
  </div>
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

