import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountInputComponent } from './bank-account-input.component';

describe('BankAccountInputComponent', () => {
  let component: BankAccountInputComponent;
  let fixture: ComponentFixture<BankAccountInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
