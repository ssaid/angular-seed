import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingsComponent, IncomingsDetailComponent } from './incomings.component';
import { IncomingsRoutingModule } from './incomings-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IncomingsRoutingModule, FormsModule],
  declarations: [IncomingsComponent, IncomingsDetailComponent],
  exports: [IncomingsComponent, IncomingsDetailComponent]
})
export class IncomingsModule { }
