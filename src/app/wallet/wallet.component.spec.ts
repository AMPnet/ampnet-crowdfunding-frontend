import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletComponent } from './wallet.component';
import { WalletTxHistoryComponent } from './wallet-tx-history/wallet-tx-history.component';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from './withdraw-modal/withdraw-modal.component';

import { RouterTestingModule } from '@angular/router/testing';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletComponent,
        WalletTxHistoryComponent,
        DepositModalComponent,
        WithdrawModalComponent
      ],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
