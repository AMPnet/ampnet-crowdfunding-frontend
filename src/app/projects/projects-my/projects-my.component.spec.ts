import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsMyComponent } from './projects-my.component';

describe('ProjectsMyComponent', () => {
  let component: ProjectsMyComponent;
  let fixture: ComponentFixture<ProjectsMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsMyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
