import { Injectable } from '@angular/core';
import { odooService } from '../angular-odoo/odoo.service';


@Injectable()
export class OpenService {

  constructor(public odoo: odooService) {
  
  }

  get_pickings_in() {
    return this.odoo.searchRead('stock.picking.in', [["type", "=", "in"]], ["name", "partner_id"])
      .then( (pickings: any) => {
        console.log("[OpenService]: ", pickings);
        return pickings.records;
      });
  }
}
