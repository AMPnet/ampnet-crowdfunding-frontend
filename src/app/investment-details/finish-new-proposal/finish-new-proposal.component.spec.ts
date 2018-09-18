import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishNewProposalComponent } from './finish-new-proposal.component';

describe('FinishNewProposalComponent', () => {
  let component: FinishNewProposalComponent;
  let fixture: ComponentFixture<FinishNewProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishNewProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishNewProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
