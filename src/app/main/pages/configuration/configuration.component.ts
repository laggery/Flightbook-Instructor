import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild(MatSidenav) sidenav: MatSidenav | undefined;
  type = "team";
  unsubscribe$ = new Subject<void>();

  constructor(
    private deviceSize: DeviceSizeService
  ) { }

  ngOnInit(): void {
    this.deviceSize.isMobile.pipe(takeUntil(this.unsubscribe$)).subscribe((mobile: boolean) => {
      if (!mobile) {
        this.sidenav?.open();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openDetail(type: string){
    if (this.deviceSize.isMobile.getValue()) {
      this.sidenav?.close();
    }
    this.type = type;
  }

  backButton() {
    this.sidenav?.open();
  }

}
