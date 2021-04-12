import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-picture',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureComponent implements OnInit {
    @Input() image: ImageType;
    @Input() type: ImageTypeText;
    mainImageURL = '';

    constructor() {
    }

    ngOnInit() {
        this.mainImageURL = this.getURL(this.image, this.type);
    }

    private getURL(image: ImageType, type: ImageTypeText): string {
       switch (type) {
           case 'squareSmall':
               return image.square_small;
           case 'wideMedium':
               return image.wide_medium;
           case 'full':
               return image.full;
           case 'original':
               return image.original;
       }
    }

}

export interface ImageType {
    square_small: string;
    wide_medium: string;
    full: string;
    original: string;
}

type ImageTypeText = 'squareSmall' | 'wideMedium' | 'full' | 'original';
