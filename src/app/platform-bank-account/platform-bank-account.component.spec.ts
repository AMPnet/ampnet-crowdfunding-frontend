import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformBankAccountComponent } from './platform-bank-account.component';

describe('PlatformBankAccountComponent', () => {
  let component: PlatformBankAccountComponent;
  let fixture: ComponentFixture<PlatformBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
