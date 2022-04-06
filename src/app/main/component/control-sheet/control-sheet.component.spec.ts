import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSheetComponent } from './control-sheet.component';

describe('ControlSheetComponent', () => {
  let component: ControlSheetComponent;
  let fixture: ComponentFixture<ControlSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
