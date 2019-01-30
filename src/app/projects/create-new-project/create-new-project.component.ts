import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project-service';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit {

  constructor(private projectService: ProjectService) { }

  ngOnInit() {

  }

}
