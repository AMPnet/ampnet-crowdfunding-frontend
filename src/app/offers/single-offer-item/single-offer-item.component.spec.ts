import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOfferItemComponent } from './single-offer-item.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SingleOfferItemComponent', () => {


  it('should create', () => {
    TestBed.configureTestingModule({
      declarations: [ SingleOfferItemComponent ],
      imports: [ RouterTestingModule ]
    });
    const fixture = TestBed.createComponent(SingleOfferItemComponent);
    const component = fixture.componentInstance;

    expect(component).toBeDefined();
  });
});
