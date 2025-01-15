import { Component, effect, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    standalone: false
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild(MatSidenav) sidenav: MatSidenav | undefined;
  type = "team";
  unsubscribe$ = new Subject<void>();

  constructor(
    private deviceSize: DeviceSizeService
  ) {
    effect(() => {
      if ((!this.deviceSize.isMobile())) {
        this.sidenav?.open();
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openDetail(type: string){
    if (this.deviceSize.isMobile()) {
      this.sidenav?.close();
    }
    this.type = type;
  }

  backButton() {
    this.sidenav?.open();
  }

}
