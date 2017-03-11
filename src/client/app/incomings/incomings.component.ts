import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
// import 'rxjs/add/operator/toPromise';  // for debugging
import { OpenService } from './open.service';
import { Picking } from './classes';
import { NotificationsService } from 'angular2-notifications';
import 'rxjs/add/operator/switchMap';
import { odooService } from '../angular-odoo/odoo.service';
import {MdDialog, MdDialogRef} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'incoming-detail',
  template: `
    <div class="row">
      <div *ngIf="picking">
        <h3>Recepcion(#{{picking.id}}) [{{picking.partner_id[1]}}]</h3>
        <input-barcode [barcodeReaderOn]="barcodeReaderOn" [endKeyCode]="13" (onScannedString)="onScanned($event)"></input-barcode>
        <button md-button color="primary" (click)="askQuantity()">Cantidad: {{qty}}</button>
        <button md-button color="primary" (click)="switchBarcodeMode()">Cambiar modo</button>
      </div>
    </div>
    <button (click)="goBack()" class="btn btn-primary">Back</button>
  ` ,
})
export class IncomingsDetailComponent implements OnInit{ 
  @Input() picking: Picking;
  qty: number = 1;
  askQty: boolean = false;
  barcodeReaderOn: boolean = false;
  prevBarcodeState: boolean = false;
  switchBarcodeMode() {
    if (this.barcodeReaderOn) {
      this.barcodeReaderOn = false;
    }
    else {
      this.barcodeReaderOn = true;
    }
    // this.barcodeReaderOn = !this.barcodeReaderOn;
  }
  askQuantity() {
    let dialogRef = this.dialog.open(DialogAskQuantity);
    dialogRef.afterClosed().subscribe(result => {
      this.qty = parseInt(result)||1;
    });
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
  handleResponse = (x: any) => {
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
    this.odoo.call(
      'stock.picking.in', 
      'jenck_receive_product', 
      [this.picking.id], 
      {scan: event, context: {'qty': this.qty, 'mode': 'match_regex'}})
      .then(this.handleResponse, this.handleError);
  }
  // picking: Picking;
  constructor(
    private openService: OpenService,
    private route: ActivatedRoute,
    private location: Location,
    public odoo: odooService,
    private _notificationsService: NotificationsService,
    public dialog: MdDialog,
    private ref: ChangeDetectorRef,
    public zone: NgZone,
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


@Component({
  selector: 'dialog-ask-quantity',
  template: `
  <h1 md-dialog-title>Cantidad</h1>
  <md-input-container class="example-full-width">
    <input mdInput placeholder="Cantidad a ingresar" #qtyInput (keypress)="keyHandler($event)">
  </md-input-container>
  <div md-dialog-actions>
    <button md-button (click)="dialogRef.close(qtyInput.value)">Validar</button>
  </div>
  `,
})
export class DialogAskQuantity {
  constructor(public dialogRef: MdDialogRef<DialogAskQuantity>) {
  }
  keyHandler (event: KeyboardEvent){
    event.stopPropagation();  // Prevent the barcode listener of handling the event (because this is not a barcode)
  }
}
