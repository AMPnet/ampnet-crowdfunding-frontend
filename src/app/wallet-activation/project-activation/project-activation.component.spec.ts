import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActivationComponent } from './project-activation.component';

describe('ProjectActivationComponent', () => {
  let component: ProjectActivationComponent;
  let fixture: ComponentFixture<ProjectActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
