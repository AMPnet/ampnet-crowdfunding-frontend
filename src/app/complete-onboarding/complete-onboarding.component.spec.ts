import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteOnboardingComponent } from './complete-onboarding.component';

describe('CompleteOnboardingComponent', () => {
  let component: CompleteOnboardingComponent;
  let fixture: ComponentFixture<CompleteOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
