import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({ 
  selector: '[inputBarcode]' 
})
export class BarcodeDirective {
  scanBuffer: string = '';
  @Input('inputBarcode') endKeyCode: string;

  constructor() {
  }

  manageBuffer(keyStr: string, keyCode: number) {
    // console.info('Scanned:', keyStr, keyCode);
    // Assume default end character ~Intro(13)~
    if (keyCode === (parseInt(this.endKeyCode) || 13)) {
      this.scanFinished(this.scanBuffer);
      this.scanBuffer = '';
    }
    else {
      this.scanBuffer += keyStr;
    }
  }

  scanFinished(scanString: string) {
    console.warn('Scan finished -> ', this.scanBuffer);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.manageBuffer(event.key, event.keyCode || event.which);
  }

}

