import { Injectable } from '@angular/core';
import { odooService } from '../angular-odoo/odoo.service';
import { Picking, Configuration } from './classes';


@Injectable()
export class OpenService {

  constructor(public odoo: odooService) {
  
  }
  get_pickings_in(): Promise<Picking[]> {
    return this.odoo.searchRead('stock.picking.in', [["type", "=", "in"], ["state", "in", ["assigned",]]], ["name", "partner_id"])
      .then( (pickings: any) => {
        console.log("[OpenService]: ", pickings);
        return pickings.records;
      });
  }
  getPicking(id: number): Promise<Picking> {
    console.info('getpicking', id);
    return this.get_pickings_in()
      .then(pickings => pickings.find(picking => picking.id === id));
  }
  getConfigurations(): Promise<Configuration[]> {
    return this.odoo.searchRead('stock.regex.config', [], ['name', 'regex_pn', 'regex_ln', 'regex_expdate', 'use_2scan', 'regex_pn_fl', 'regex_ln_fl', 'regex_expdate_fl'])
      .then( (configurations: any) => {
        console.log('[OpenService]: ', configurations);
        for (var i in configurations.records){
          configurations.records[i]['regex_pn'] = new RegExp(configurations.records[i]['regex_pn'], configurations.records[i]['regex_pn_fl']||'');
          configurations.records[i]['regex_ln'] = new RegExp(configurations.records[i]['regex_ln'], configurations.records[i]['regex_ln_fl']||'');
          configurations.records[i]['regex_expdate'] = new RegExp(configurations.records[i]['regex_expdate'], configurations.records[i]['regex_expdate_fl']||'');
        }
        return configurations.records;
      });
  }
}
