import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositModalComponent } from './deposit-modal.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DepositModalComponent', () => {
  let component: DepositModalComponent;
  let fixture: ComponentFixture<DepositModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepositModalComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
