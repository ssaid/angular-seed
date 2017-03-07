import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { BarcodeDirective } from '../shared/barcode/barcode.directive';

@NgModule({
  imports: [CommonModule, AboutRoutingModule],
  declarations: [AboutComponent, BarcodeDirective],
  exports: [AboutComponent]
})
export class AboutModule { }
