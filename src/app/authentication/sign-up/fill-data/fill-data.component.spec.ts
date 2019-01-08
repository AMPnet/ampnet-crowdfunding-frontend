import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillDataComponent } from './fill-data.component';

describe('FillDataComponent', () => {
  let component: FillDataComponent;
  let fixture: ComponentFixture<FillDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
