import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletActivationComponent } from './wallet-activation.component';

describe('WalletActivationComponent', () => {
  let component: WalletActivationComponent;
  let fixture: ComponentFixture<WalletActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
