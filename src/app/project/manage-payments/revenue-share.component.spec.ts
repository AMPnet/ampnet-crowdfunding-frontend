import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentsComponent } from './manage-payments.component';

describe('RevenueShareComponent', () => {
  let component: ManagePaymentsComponent;
  let fixture: ComponentFixture<ManagePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePaymentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
