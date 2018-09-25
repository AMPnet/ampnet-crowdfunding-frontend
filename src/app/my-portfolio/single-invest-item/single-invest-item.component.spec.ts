import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInvestItemComponent } from './single-invest-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { InvestItemModel } from './InvestItemModel';

describe('SingleInvestItemComponent', () => {
  it('should create', () => {

    TestBed.configureTestingModule({
      declarations: [ SingleInvestItemComponent ],
      imports: [ RouterTestingModule ]
    });

    const fixture = TestBed.createComponent(SingleInvestItemComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();

  });
});
