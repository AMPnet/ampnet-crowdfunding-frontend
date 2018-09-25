import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { WalletChartComponent } from '../wallet/wallet-chart/wallet-chart.component';

describe('OverviewComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent, WalletChartComponent]
    });
   
    const fixture = TestBed.createComponent(OverviewComponent);
    const component = fixture.componentInstance;

    expect(component).toBeDefined();
  });
});
