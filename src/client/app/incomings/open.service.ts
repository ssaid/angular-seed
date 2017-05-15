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
    return this.odoo.searchRead('stock.regex.config', [], ['name', 'regex_pn', 'regex_ln', 'regex_expdate', 'use_2scan'])
      .then( (configurations: any) => {
        console.log('[OpenService]: ', configurations);
        return configurations.records;
      });
  }
}
