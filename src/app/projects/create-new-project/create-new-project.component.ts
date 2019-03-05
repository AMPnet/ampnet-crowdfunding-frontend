import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectService } from '../project-service';
import { FormGroup } from '@angular/forms';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit, AfterViewInit {

  @ViewChild("date-picker")
  public datePickerElement: ElementRef;

  constructor(private projectService: ProjectService) { 

  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    flatpickr(this.datePickerElement.nativeElement , {});
  }

  submitButtonClicked() { }

}
