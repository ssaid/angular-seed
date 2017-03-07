import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingsComponent, IncomingsDetailComponent } from './incomings.component';
import { IncomingsRoutingModule } from './incomings-routing.module';
import { FormsModule } from '@angular/forms';
import { BarcodeComponent } from '../shared/barcode/barcode.directive';

@NgModule({
  imports: [CommonModule, IncomingsRoutingModule, FormsModule],
  declarations: [IncomingsComponent, IncomingsDetailComponent, BarcodeComponent],
  exports: [IncomingsComponent, IncomingsDetailComponent]
})
export class IncomingsModule { }
