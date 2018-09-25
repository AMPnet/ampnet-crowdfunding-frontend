import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentOptionComponent } from './new-payment-option.component';
import { CreditCardInputComponent } from './credit-card-input/credit-card-input.component';
import { BankAccountInputComponent } from './bank-account-input/bank-account-input.component';

describe('NewPaymentOptionComponent', () => {
  let component: NewPaymentOptionComponent;
  let fixture: ComponentFixture<NewPaymentOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        NewPaymentOptionComponent, 
        CreditCardInputComponent,
        BankAccountInputComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
