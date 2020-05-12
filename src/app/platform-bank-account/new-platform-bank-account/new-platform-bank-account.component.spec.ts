import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlatformBankAccountComponent } from './new-platform-bank-account.component';

describe('NewPlatformBankAccountComponent', () => {
  let component: NewPlatformBankAccountComponent;
  let fixture: ComponentFixture<NewPlatformBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlatformBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlatformBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
