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
    <div class="row">
      <div *ngIf="picking">
        <h3>Recepcion(#{{picking.id}}) [{{picking.partner_id[1]}}]</h3>
        <input-barcode [barcodeReaderOn]="barcodeReaderOn" [endKeyCode]="13" (onScannedString)="onScanned($event)"></input-barcode>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-btn">
            <button class="btn btn-default" type="button">Cambiar Cantidad</button>
          </span>
          <input type="text" class="form-control" placeholder="Cantidad" [(ngModel)]="qty" readonly>
        </div><!-- /input-group -->
      </div><!-- /.col-md-6 --> 
    </div>

    <button (click)="goBack()" class="btn btn-primary">Back</button>
  ` ,
})
export class IncomingsDetailComponent implements OnInit{ 
  @Input() picking: Picking;
  qty: number = 1;
  askQty: boolean = false;
  barcodeReaderOn: boolean = false;
  handleError = (err) => {
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
  handleResponse = (x) => {
    console.info('Response ', x);
    if (x.state === 'fail'){
      this._notificationsService.error('Error', x.msg);
    }
    else{
      this._notificationsService.success('Success', x.msg);
    }
  }
  onScanned(event: string) {
    console.log('Scanned item --> ', event);  
    this.odoo.call('stock.picking.in', 'jenck_receive_product', [this.picking.id], {scan: event, context: {'qty': 1}}).then(this.handleResponse, this.handleError);
  }
  // picking: Picking;
  constructor(
    private openService: OpenService,
    private route: ActivatedRoute,
    private location: Location,
    public odoo: odooService,
    private _notificationsService: NotificationsService,
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
