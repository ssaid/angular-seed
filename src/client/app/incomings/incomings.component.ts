import { Component, OnInit, Input, ChangeDetectorRef, NgZone, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
// import 'rxjs/add/operator/toPromise';  // for debugging
import { OpenService } from './open.service';
import { Picking, Configuration, CurrentScan } from './classes';
import { NotificationsService } from 'angular2-notifications';
import 'rxjs/add/operator/switchMap';
import { odooService } from '../angular-odoo/odoo.service';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'regex-configuration',
  template: `
<div class="row" *ngIf="selectedConf">
  <div class="panel panel-default">
    <div class="panel-heading">RegEx Configuration
      <div class="btn-group">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span *ngIf="!selectedConf">--- <span class="caret"></span></span>
          <span *ngIf="selectedConf">{{selectedConf.name}} <span class="caret"></span></span>
        </button>
        <ul class="dropdown-menu">
          <li *ngFor="let conf of configurations" (click)="selectConf(conf)"><a>{{conf.name}}</a></li>
        </ul>
      </div> 
    </div>
    <div class="panel-body">
      
    </div>
    <dl class="dl-horizontal">
      <dt>Regex Lot<dt>
      <dd>{{selectedConf.regex_ln}}</dd>
      <dt>Regex P/N</dt>
      <dd>{{selectedConf.regex_pn}}</dd>
      <dt>Regex Exp. Date</dt>
      <dd>{{selectedConf.regex_expdate}}</dd>
      <dt>Segundo Escaneo</dt>
      <dd>{{selectedConf.use_2scan}}</dd>
    </dl>
  </div>
</div>
  `
})
export class RegexConfigurationComponent implements OnInit{
  configurations: Configuration[];
  selectedConf: Configuration;
  @Output() confUpdated = new EventEmitter();
  @Input() scanInProcess: boolean = false;

  constructor(
    private open: OpenService,
  ) {}
  selectConf(conf: Configuration): void {
    if (this.scanInProcess){
      window.alert('Hay un escaneo en proceso, finalize el escaneo o aborte la operación. No se cambio la configuración.');
      return;
    }
    this.selectedConf = conf;
    this.confUpdated.emit(conf);
  };
  setDefaultConf(): void {
    this.selectConf(this.configurations[0]);
  };
  getConfigurations(): void {
    this.open.getConfigurations()
      .then( (configurations: Configuration[]) => {
        this.configurations = configurations;
        this.selectConf(this.configurations[0]);
      }, (e) => console.warn(e))
  }
  ngOnInit(): void {
    console.info("[RegexConfigurationComponent]: ngOnInit");
    this.getConfigurations();
  }
}


@Component({
  moduleId: module.id,
  selector: 'incoming-detail',
  template: `
    <div class="row">
      <div *ngIf="picking && currentConfig">
        <div class="col-md-12">
          <h3 class="text-center">Recepcion(#{{picking.id}}) [{{picking.partner_id[1]}}]<span class="label label-info" *ngIf="scanInProcess">Escaneo en proceso</span> </h3>
          <input-barcode [barcodeReaderOn]="barcodeReaderOn" [endKeyCode]="13" (onScannedString)="onScanned($event)"></input-barcode>
        </div>
        <div class="col-md-6">
          <div class="panel panel-default" *ngIf="currentScan" >
            <div class="panel-heading">Configuración</div>
            <div class="panel-body">
              Cantidad: <strong>{{qty}}</strong>
              <button type="button" class="btn btn-primary" (click)="askQuantity()">Cambiar Cantidad</button>
                
              <span *ngIf="currentScan.scan1">Escaneo 1: <strong>{{currentScan.scan1}}</strong> [P/N: {{ currentScan.partNumber }}] [L/N: {{ currentScan.lotName }}]</span><br />
              <span *ngIf="currentScan.scan2">Escaneo 2: <strong>{{currentScan.scan2}}</strong></span>
              <span>Lote: <strong>{{lastScan.lotName}}</strong></span>
              <span>Part Number: <strong>{{lastScan.partNumber}}</strong></span>
              <span>Expiry Date: <strong>{{lastScan.expDate}}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <regex-configuration (confUpdated)="handleConfUpdated($event)" [scanInProcess]="scanInProcess"></regex-configuration>
    <button (click)="goBack()" class="btn btn-primary">Back</button>
  ` ,
})
export class IncomingsDetailComponent implements OnInit{ 
  @Input() picking: Picking;
  qty: number = 1;
  askQty: boolean = false;
  barcodeReaderOn: boolean = true;
  prevBarcodeState: boolean = false;
  currentConfig: Configuration;
  currentScan: CurrentScan = new CurrentScan();
  lastScan: CurrentScan;
  scanInProcess: boolean = false;
  switchBarcodeMode() {
    if (this.barcodeReaderOn) {
      this.barcodeReaderOn = false;
    }
    else {
      this.barcodeReaderOn = true;
    }
  }
  handleConfUpdated(conf: Configuration) {
    console.info(conf);
    this.currentConfig = conf;
    this.cleanScan();
  };
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
    this.cleanScan();
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
  cleanScan() {
    this.scanInProcess = false;
    this.lastScan = Object.assign({}, this.currentScan);
    this.currentScan.clean();
  }
  endScan() {
    // Handle the end of the procedure of scanning, and flush everything after  
    if (!this.currentScan.lotName){
      let err = {
        title: 'L/N Error',
        message: 'Lot Name required'
      } 
      return this.handleError(err);
    }
    if (!this.currentScan.partNumber){
      let err = {
        title: 'P/N Error',
        message: 'Part Number required'
      } 
      return this.handleError(err);
    }
    
    this.odoo.call(
      'stock.picking.in', 
      'jenck_receive_product', 
      [this.picking.id], 
      {'part_number': this.currentScan.partNumber, 'lot_name': this.currentScan.lotName, context: {'qty': this.qty, 'mode': 'simple'}})
      .then(this.handleResponse, this.handleError);

    this.cleanScan();
  }
  onScanned(event: string) {
    this.scanInProcess = true;
    console.log('Scanned item --> ', event);  
    if (!this.currentConfig.use_2scan) {  // 1 scan only
      this.currentScan.scan1 = event;
       let lotNameMatch = event.match(this.currentConfig.regex_ln);
      if (lotNameMatch) {
        this.currentScan.lotName = lotNameMatch[0];
      } else {
        this.currentScan.lotName = '';
      }
      let partNumberMatch = event.match(this.currentConfig.regex_pn);
      if (partNumberMatch) {
        this.currentScan.partNumber = partNumberMatch[0];
      } else {
        this.currentScan.partNumber = '';
      }
      let expDateMatch = event.match(this.currentConfig.regex_expdate);
      if (expDateMatch) {
        this.currentScan.expDate = expDateMatch[0];
      } else {
        this.currentScan.expDate = '';
      }
      this.endScan();
    } else {  // Two Scans
      if (!this.currentScan.scan1) {  // First scan has not been performed
        this.currentScan.scan1 = event;
        let partNumberMatch = event.match(this.currentConfig.regex_pn);
        if (partNumberMatch) {
          this.currentScan.partNumber = partNumberMatch[0];
        } else {
          this.currentScan.partNumber = '';
        }
        let expDateMatch = event.match(this.currentConfig.regex_expdate);
        if (expDateMatch) {
          this.currentScan.expDate = expDateMatch[0];
        } else {
          this.currentScan.expDate = '';
        }
      } else {  // Second scan
        this.currentScan.scan2 = event;
        let lotNameMatch = event.match(this.currentConfig.regex_ln);
        if (lotNameMatch) {
          this.currentScan.lotName = lotNameMatch[0];
        } else {
          this.currentScan.lotName = '';
        }
        this.endScan();
      } 
    }
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
