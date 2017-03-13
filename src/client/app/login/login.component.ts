import { Component } from '@angular/core';
import { odooService } from '../angular-odoo/odoo.service';
import 'rxjs/add/operator/toPromise';  // for debugging
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

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
    console.info('[LoginComponent]: LoggedIn');
    this.isLoggedIn = true;
    this._notificationsService.info('LogIn', 'Logged In');
    this.router.navigateByUrl('/incomings');
  };
  isLoggedIn: boolean = false;
  dbs = [];
  submitted = false;
  separator = ' ';
  handleError = null;

  constructor(public odoo: odooService, private _notificationsService: NotificationsService, public router: Router){
  var defaultDb = null;
  this.handleError = (err) => {
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
            console.info('Available Databases', x);
            this.dbs = x;
            this.login.db = defaultDb;
        }
      )
    }).then(null, this.handleError);
  }
  onLogin(form) {
    this.submitted = true;
    var db = null, login = null, password = null;

    if (form.valid) {
      db = this.login.db;
      let userpass = this.login.userpass;
      if (userpass.indexOf(this.separator) !== -1 ) {
        let splitted = userpass.split(this.separator);
        login = splitted[0];
        password = splitted[1];
      } else { //token based auth
        login = 'based_on_token';
        password = userpass;
      }

      this.odoo.login(db, login, password).then(
        () => this.loginSuccess()
      , this.handleError);
    }
  }
}
