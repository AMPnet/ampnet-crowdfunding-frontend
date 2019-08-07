import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignBroadcastComponent } from './sign-broadcast.component';

describe('SignBroadcastComponent', () => {
  let component: SignBroadcastComponent;
  let fixture: ComponentFixture<SignBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignBroadcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
