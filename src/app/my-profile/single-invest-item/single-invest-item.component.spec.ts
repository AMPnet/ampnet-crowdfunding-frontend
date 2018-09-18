import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInvestItemComponent } from './single-invest-item.component';

describe('SingleInvestItemComponent', () => {
  let component: SingleInvestItemComponent;
  let fixture: ComponentFixture<SingleInvestItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleInvestItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleInvestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
