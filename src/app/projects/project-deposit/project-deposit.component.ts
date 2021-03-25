import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-project-deposit',
    templateUrl: './project-deposit.component.html',
    styleUrls: ['./project-deposit.component.scss']
})
export class ProjectDepositComponent implements OnInit {
    projectUUID: string;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.projectUUID = this.route.snapshot.params.id;
    }
}
