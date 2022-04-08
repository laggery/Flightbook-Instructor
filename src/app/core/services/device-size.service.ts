import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceSizeService {

  public isMobile: BehaviorSubject<boolean>;

  constructor() {
    this.isMobile = new BehaviorSubject<boolean>(false);
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    console.log(event.currentTarget.innerWidth);
  }

  
}
