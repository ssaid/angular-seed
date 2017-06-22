import { Component, Directive, ElementRef, Input, HostListener, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({ 
  moduleId: module.id,
  selector: 'input-barcode',
  template: `
  <div class="panel panel-default">
    <div class="panel-heading">Barcode Scanner</div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              <div class="input-group">
                  <div class="input-group-btn">
                      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{barcodeReaderOn === true ? "Automatic detection" : "Manual detection"}}<span class="caret"></span></button>
                      <ul class="dropdown-menu">
                          <li (click)="barcodeReaderOn=true" [class.disabled]="barcodeReaderOn"><a>Automatic Scanner</a></li>
                          <li (click)="barcodeReaderOn=false" [class.disabled]="!barcodeReaderOn"><a>Manual Scanner</a></li>
                      </ul>
                  </div><!-- /btn-group -->
                  <input type="text" class="form-control" placeholder="Barcode" [disabled]="barcodeReaderOn" [(ngModel)]="scanBuffer" (keyup.enter)="scanFinished(scanBuffer)">
              </div><!-- /input-group -->
          </div><!-- /.col-md-12 -->
      </div>
Editable <input type="checkbox" [checked]="editMode" [(ngModel)]="editMode">
    </div>
  </div>
  `,

})
export class BarcodeComponent implements OnChanges {
  scanBuffer: string = '';
  @Input() barcodeReaderOn: boolean = true;
  editMode: boolean = false;
  @Input() endKeyCode: string;
  @Output() onScannedString: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.info(changes);
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
    if (this.editMode == true) {
      this.editMode = false;
      return;
    }
    if (scannedString !== ''){
      console.info("Scanned: ", scannedString);
      this.onScannedString.emit(String(scannedString).replace(/'/g, "-"));
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

