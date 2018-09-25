import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProposalItemComponent } from './single-proposal-item.component';

describe('SingleProposalItemComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      declarations: [ SingleProposalItemComponent ],
    });
    const fixture = TestBed.createComponent(SingleProposalItemComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
