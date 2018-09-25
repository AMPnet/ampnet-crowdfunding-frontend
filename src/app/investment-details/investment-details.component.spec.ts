import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentDetailsComponent } from './investment-details.component';
import { SingleProposalItemComponent } from './single-proposal-item/single-proposal-item.component';


describe('InvestmentDetailsComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentDetailsComponent, SingleProposalItemComponent ]
    });
    const fixture = TestBed.createComponent(InvestmentDetailsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
