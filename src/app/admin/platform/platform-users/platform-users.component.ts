import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReportService } from '../../../shared/services/report/report.service';

@Component({
    selector: 'app-platform-users',
    templateUrl: './platform-users.component.html',
    styleUrls: ['./platform-users.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformUsersComponent {
    constructor(private reportService: ReportService) {
    }

    downloadReport() {
        return this.reportService.usersSummary();
    }
}
