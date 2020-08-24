import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFilterComponent } from './offer-filter.component';

describe('OfferFilterComponent', () => {
  let component: OfferFilterComponent;
  let fixture: ComponentFixture<OfferFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
