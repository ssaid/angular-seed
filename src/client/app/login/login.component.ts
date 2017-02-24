import { Component } from '@angular/core';
import { odooService } from '../angular-odoo/odoo.service';
import 'rxjs/add/operator/toPromise';  // for debugging

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'odoo-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  login: { userpass?: string, db?: string} = {};
  loginSuccess() {
    console.log('Login successfull');
  };
  dbs = [];
  handleError = null;

  constructor(public odoo: odooService){
  var defaultDb = null;
  this.handleError = (err) => {
    console.warn('yeah ! une erreur', err);
  }
  odoo.getSessionInfo()
    .then( x => defaultDb = x.db)
    .then( () => odoo.isLoggedIn().then(
        isLogged => {
          if (isLogged)
              this.loginSuccess();
          return isLogged
        }
      )
    ).then( (isLogged) => {
      if (!isLogged)
        return odoo.getDbList().then(
        x => {
            console.log('voici les bases', x)
            this.dbs = x;
            this.login.db = defaultDb;
        }
      )
    }).then(null, this.handleError);
  }
}
