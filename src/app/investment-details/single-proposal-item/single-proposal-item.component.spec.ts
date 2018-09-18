import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProposalItemComponent } from './single-proposal-item.component';

describe('SingleProposalItemComponent', () => {
  let component: SingleProposalItemComponent;
  let fixture: ComponentFixture<SingleProposalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProposalItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProposalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
