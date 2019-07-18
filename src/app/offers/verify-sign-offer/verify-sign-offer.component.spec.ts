import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySignOfferComponent } from './verify-sign-offer.component';

describe('VerifySignOfferComponent', () => {
  let component: VerifySignOfferComponent;
  let fixture: ComponentFixture<VerifySignOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifySignOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifySignOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
