import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingsComponent, IncomingsDetailComponent } from './incomings.component';
import { IncomingsRoutingModule } from './incomings-routing.module';
import { FormsModule } from '@angular/forms';
import { BarcodeDirective } from '../shared/barcode/barcode.directive';

@NgModule({
  imports: [CommonModule, IncomingsRoutingModule, FormsModule],
  declarations: [IncomingsComponent, IncomingsDetailComponent, BarcodeDirective],
  exports: [IncomingsComponent, IncomingsDetailComponent]
})
export class IncomingsModule { }
