import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateSignComponent } from './activate-sign.component';

describe('ActivateSignComponent', () => {
  let component: ActivateSignComponent;
  let fixture: ComponentFixture<ActivateSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
