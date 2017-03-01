import { Component, OnInit } from '@angular/core';
// import { odooService } from '../angular-odoo/odoo.service';
// import 'rxjs/add/operator/toPromise';  // for debugging
import { OpenService } from './open.service';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'odoo-incomings',
  templateUrl: 'incomings.component.html',
  styleUrls: ['incomings.component.css']
})
export class IncomingsComponent implements OnInit{
  rr: any;
  ngOnInit(): void {
    console.info("[IncomingsComponent]: ngOnInit");
    this.getPickings();
  }
  getPickings(): void {
    this.open.get_pickings_in()
      .then( (pickings: any) => {
        console.warn('rr:',this.rr);
        // TODO: this is not working properly because the get_pickings_in is returning void
      });
  }
  constructor(public open: OpenService){
  }
}
