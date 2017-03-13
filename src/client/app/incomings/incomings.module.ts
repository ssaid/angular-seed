import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingsComponent, IncomingsDetailComponent } from './incomings.component';
import { IncomingsRoutingModule } from './incomings-routing.module';
import { FormsModule } from '@angular/forms';
import { BarcodeComponent } from '../shared/barcode/barcode.component';
import { MaterialModule } from '@angular/material';
import { DialogAskQuantity, DialogAskLot } from './incomings.component';

@NgModule({
  imports: [CommonModule, IncomingsRoutingModule, FormsModule, MaterialModule],
  declarations: [IncomingsComponent, IncomingsDetailComponent, BarcodeComponent, DialogAskQuantity, DialogAskLot],
  exports: [IncomingsComponent, IncomingsDetailComponent],
  entryComponents: [DialogAskQuantity, DialogAskLot],
})
export class IncomingsModule { }
