import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DeviceSizeService } from './core/services/device-size.service';
import * as moment from 'moment';
// import 'moment/locale/de'
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translate: TranslateService, private devicesSizeService: DeviceSizeService) {
    this.translate.setDefaultLang('de');
    this.translate.use(localStorage.getItem('language') || navigator.language.split('-')[0]);
    moment.updateLocale('en', {
      week: {
        dow: 1,
      },
    })
  }

  @HostListener('window:load', ['$event']) onLoad(event: any) {
    if (event.currentTarget.innerWidth <= 768) {
      this.devicesSizeService.isMobile.next(true);
    } else {
      this.devicesSizeService.isMobile.next(false);
    }
  }
  
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    if (event.currentTarget.innerWidth <= 768) {
      this.devicesSizeService.isMobile.next(true);
    } else {
      this.devicesSizeService.isMobile.next(false);
    }
  }
}
