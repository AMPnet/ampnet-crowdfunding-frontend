import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSingleDepositComponent } from './manage-single-deposit.component';

describe('ManageSingleDepositComponent', () => {
  let component: ManageSingleDepositComponent;
  let fixture: ComponentFixture<ManageSingleDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSingleDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSingleDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
