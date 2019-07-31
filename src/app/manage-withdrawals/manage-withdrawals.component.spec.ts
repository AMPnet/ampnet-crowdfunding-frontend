import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWithdrawalsComponent } from './manage-withdrawals.component';

describe('ManageWithdrawalsComponent', () => {
  let component: ManageWithdrawalsComponent;
  let fixture: ComponentFixture<ManageWithdrawalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWithdrawalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
