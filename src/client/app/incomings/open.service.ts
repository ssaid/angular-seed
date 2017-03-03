import { Injectable } from '@angular/core';
import { odooService } from '../angular-odoo/odoo.service';
import { Picking } from './classes';


@Injectable()
export class OpenService {

  constructor(public odoo: odooService) {
  
  }
  get_pickings_in(): Promise<Picking[]> {
    return this.odoo.searchRead('stock.picking.in', [["type", "=", "in"]], ["name", "partner_id"])
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
}
