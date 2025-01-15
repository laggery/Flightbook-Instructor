import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';

@Component({
    selector: 'fb-control-sheet',
    templateUrl: './control-sheet.component.html',
    styleUrls: ['./control-sheet.component.scss'],
    standalone: false
})
export class ControlSheetComponent implements OnInit {
  @Input()
  controlSheet: ControlSheet | undefined;

  @Output() saveControlSheetEvent = new EventEmitter<ControlSheet>();

  constructor() { }

  ngOnInit(): void {
  }

  saveTrainingHill(value: number, key: any) {
    if (this.controlSheet && this.controlSheet?.trainingHill) {
      this.controlSheet.trainingHill[key] = value;
      this.saveControlSheetEvent.emit(this.controlSheet);
    }
  }

  saveTheory(value: number, key: any) {
    if (this.controlSheet && this.controlSheet?.theory) {
      this.controlSheet.theory[key] = value;
      this.saveControlSheetEvent.emit(this.controlSheet);
    }
  }

  saveAltitudeFlight(value: number, key: any) {
    if (this.controlSheet && this.controlSheet?.altitudeFlight) {
      this.controlSheet.altitudeFlight[key] = value;
      this.saveControlSheetEvent.emit(this.controlSheet);
    }
  }

  addControlSheet() {
    this.controlSheet = new ControlSheet();
    this.saveControlSheetEvent.emit(this.controlSheet);
  }

  canEditChange(event: MatSlideToggleChange) {
    this.controlSheet!.userCanEdit = event.checked;
    this.saveControlSheetEvent.emit(this.controlSheet);
  }
}
