import { Component } from '@angular/core';
import { AuthhenticationService } from '../../services/authhentication.service';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  constructor(
    private authServ: AuthhenticationService
  ) {
    console.log('authState',this.authServ.authState);
  }
}
