import { Component } from '@angular/core';
import { NbRegisterComponent, NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
})
export class NgxRegisterComponent extends NbRegisterComponent {

  carrierList: any = [
    {carrierID: 1, carrierName: 'AT&T'},
    {carrierID: 2, carrierName: 'T-Mobile'},
    {carrierID: 3, carrierName: 'Verizon'},
    {carrierID: 4, carrierName: 'Sprint'},
    {carrierID: 5, carrierName: 'Virgin'},
    {carrierID: 6, carrierName: 'Metro PCS'},
    {carrierID: 7, carrierName: 'Boost'},
    {carrierID: 8, carrierName: 'Google Fi'},
  ];


  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    const user = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      employeeID: this.user.employeeID,
      email: this.user.email,
      password: this.user.password,
      phoneNumber: this.user.phoneNumber,
      carrierID: this.user.carrier,
    };


    this.service.register(this.strategy, user).subscribe((result: any) => {
      this.submitted = false;

      // console.log(result.response);
      // if (result.isSuccess()) {
      //   this.messages = result.getMessages();
      // } else {
      //   this.errors = result.getErrors();
      // }


      if (result.response.body[0].status === 'Email already exists') {
        this.errors = ['Email already exists! please try another email'];
      } else {
        this.messages = result.getMessages();


        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      }

    });
  }


  // onInit() {
  //   this.user.carrier = {carrierID: 1, carrierName: 'AT&T'};
  // }


}
