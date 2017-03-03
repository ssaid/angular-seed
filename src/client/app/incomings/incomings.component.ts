import { Component, OnInit } from '@angular/core';
// import { odooService } from '../angular-odoo/odoo.service';
// import 'rxjs/add/operator/toPromise';  // for debugging
import { OpenService } from './open.service';
import { Picking } from './classes';
import { NotificationsService } from 'angular2-notifications';


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

  handleError = (err: any) => {
    console.warn('Error ', err);
    this._notificationsService.error(err.title, err.message,
    {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 20
    })
  }

  ngOnInit(): void {
    console.info("[IncomingsComponent]: ngOnInit");
    this.getPickings();
  }
  getPickings(): void {
    this.open.get_pickings_in()
      .then( (pickings: any) => {
        console.warn('rr:', pickings);
      }, this.handleError);
  }
  constructor(public open: OpenService, private _notificationsService: NotificationsService){
  }
}
