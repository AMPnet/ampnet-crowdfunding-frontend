import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import * as Uppy from 'uppy';
import { AbstractControl } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-upload-area',
    templateUrl: './upload-area.component.html',
    styleUrls: ['./upload-area.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadAreaComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() areaID: string;
    @Input() restrictions: UploadAreaComponentRestrictions;
    @Input() firstFileControl: AbstractControl;
    @Input() filesControl: AbstractControl;

    @Output() filesQuantityChange = new EventEmitter<{ files: object[] }>();

    @ViewChild('uploadArea') uploadAreaEl;

    private uppy: Uppy.Core.Uppy;
    private subSink = new SubSink();

    constructor() {
    }

    ngOnInit() {
        this.uppy = Uppy.Core({restrictions: this.restrictions});

        this.uppy.on('file-added', () => {
            this.filesQuantityChanged();
        });

        this.uppy.on('file-removed', () => {
            this.filesQuantityChanged();
        });
    }

    ngAfterViewInit() {
        this.uppy.use(Uppy.Dashboard, {
            id: this.areaID,
            target: this.uploadAreaEl.nativeElement,
            inline: true,
            height: 300,
            width: '100%',
            hideUploadButton: true,
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const firstFileCtl: SimpleChange = changes.firstFileControl;
        const filesCtl: SimpleChange = changes.filesControl;

        if (firstFileCtl?.isFirstChange() || firstFileCtl?.currentValue !== firstFileCtl?.previousValue) {
            this.subSink.sink = this.firstFileControl?.valueChanges.subscribe(file => {
                if (!file) {
                    this.uppy.reset();
                }
            });
        }

        if (filesCtl?.isFirstChange() || filesCtl?.currentValue !== filesCtl?.previousValue) {
            this.subSink.sink = this.filesControl?.valueChanges.subscribe(files => {
                if (!files || !!files && files.length === 0) {
                    this.uppy.reset();
                }
            });
        }
    }

    ngOnDestroy() {
        this.uppy.close();
        this.subSink.unsubscribe();
    }

    private filesQuantityChanged() {
        const files = this.uppy.getFiles().map(file => file.data);

        this.firstFileControl?.setValue(files[0]);
        this.filesControl?.setValue(files);

        [this.firstFileControl, this.filesControl].forEach(control => {
            control?.markAsTouched();
            control?.markAsDirty();
        });

        this.filesQuantityChange.emit({files: files});
    }
}

export interface UploadAreaComponentRestrictions {
    maxFileSize?: number | null;
    minFileSize?: number | null;
    maxNumberOfFiles?: number | null;
    minNumberOfFiles?: number | null;
    allowedFileTypes?: string[] | null;
}
