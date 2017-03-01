import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncomingsComponent } from './incomings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'incomings', component: IncomingsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class IncomingsRoutingModule { }
