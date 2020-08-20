import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../projects/project-service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';

@Component({
    selector: 'app-revenue-share',
    templateUrl: './revenue-share.component.html',
    styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {
    @Input() projectName: string;
    @Input() amount: number;
    projectID: string;

    constructor(private route: ActivatedRoute, private projectService: ProjectService) {
    }

    ngOnInit() {
        this.fetchDataFromRoute();
    }

    fetchDataFromRoute() {
        this.projectID = this.route.snapshot.params.projectID;
        this.amount = this.route.snapshot.params.amount;
        this.getProject(this.projectID);
    }

    getProject(projectUUID: string) {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(projectUUID)
            .subscribe(res => {
                SpinnerUtil.hideSpinner();
                this.projectName = res.name;
            }, error => {
                hideSpinnerAndDisplayError(error);
            });
    }
}
