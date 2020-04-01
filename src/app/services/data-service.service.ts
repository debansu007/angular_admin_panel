import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  userSource = new BehaviorSubject(null);
  userData = this.userSource.asObservable();

  constructor() { }

  changeData(data: any) {
    this.userSource.next(data);
  }

}
