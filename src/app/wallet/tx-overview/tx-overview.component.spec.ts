import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxOverviewComponent } from './tx-overview.component';

describe('TxOverviewComponent', () => {
  let component: TxOverviewComponent;
  let fixture: ComponentFixture<TxOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TxOverviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
