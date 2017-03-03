import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncomingsComponent, IncomingsDetailComponent } from './incomings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'incomings', component: IncomingsComponent },
      { path: 'incomings/:id', component: IncomingsDetailComponent },
    ])
  ],
  exports: [RouterModule]
})
export class IncomingsRoutingModule { }
