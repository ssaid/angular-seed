import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
// import 'rxjs/add/operator/toPromise';  // for debugging
import { OpenService } from './open.service';
import { Picking } from './classes';
import { NotificationsService } from 'angular2-notifications';
import 'rxjs/add/operator/switchMap';
import { odooService } from '../angular-odoo/odoo.service';


@Component({
  moduleId: module.id,
  selector: 'incoming-detail',
  template: `
    <div *ngIf="picking">
      <h3>Recepcion(#{{picking.id}}) [{{picking.partner_id[1]}}]</h3>
      <input-barcode [endKeyCode]="13" (onScannedString)="onScanned($event)"></input-barcode>
    </div>
    <button (click)="goBack()" class="btn btn-primary">Back</button>
  ` ,
})
export class IncomingsDetailComponent implements OnInit{ 
  @Input() picking: Picking;
  onScanned(event: string) {
    console.log('Scanned item --> ', event);  
    this.odoo.call('stock.picking.in', 'jenck_receive_product', [this.picking.id], {scan: event}).then(
      x => {
        console.log(x);
      },
      (err) => {
        console.log(err);
      })
    // do magic
  }
  // picking: Picking;
  constructor(
    private openService: OpenService,
    private route: ActivatedRoute,
    private location: Location,
    public odoo: odooService,
  ) {}
  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.openService.getPicking(+params['id']))
      .subscribe(picking => this.picking = picking);
  }
  goBack(): void {
    this.location.back();
  }
}


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
  pickings: Picking[];
  selectedPicking: Picking;

  onSelect(p: Picking): void {
    this.selectedPicking = p;
    console.info(this);
  }

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
        this.pickings = pickings;
      }, this.handleError);
  }
  constructor(public open: OpenService, private _notificationsService: NotificationsService){
  }
}
