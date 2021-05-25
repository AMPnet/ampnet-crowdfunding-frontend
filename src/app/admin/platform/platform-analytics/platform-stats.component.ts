import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatsService } from '../../../shared/services/stats.service';
import { shareReplay } from 'rxjs/operators';
import { ReportService, ReportXlsxType } from '../../../shared/services/report/report.service';

@Component({
    selector: 'app-platform-stats',
    templateUrl: './platform-stats.component.html',
    styleUrls: ['./platform-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformStatsComponent {
    reportXlsxType = ReportXlsxType;

    statsUsers$ = this.statsService.users().pipe(shareReplay(1));
    statsWallets$ = this.statsService.wallets().pipe(shareReplay(1));

    constructor(private statsService: StatsService,
                private reportService: ReportService) {
    }

    downloadReport(type: ReportXlsxType): void {
        this.reportService.report(type).subscribe();
    }
}
