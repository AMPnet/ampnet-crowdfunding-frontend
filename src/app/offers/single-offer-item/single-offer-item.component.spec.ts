import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOfferItemComponent } from './single-offer-item.component';

describe('SingleOfferItemComponent', () => {
  let component: SingleOfferItemComponent;
  let fixture: ComponentFixture<SingleOfferItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleOfferItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOfferItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
