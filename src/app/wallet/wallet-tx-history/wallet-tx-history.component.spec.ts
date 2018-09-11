import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTxHistoryComponent } from './wallet-tx-history.component';

describe('WalletTxHistoryComponent', () => {
  let component: WalletTxHistoryComponent;
  let fixture: ComponentFixture<WalletTxHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletTxHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletTxHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
