import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
    faAlignLeft,
    faArrowCircleDown,
    faArrowCircleUp,
    faArrowDown,
    faArrowUp,
    faCogs,
    faCreditCard,
    faEnvelopeOpen,
    faFlagCheckered,
    faHandshake,
    faLayerGroup,
    faSignOutAlt,
    faStore,
    faUniversity,
    faUser,
    faUserCog,
    faWallet
} from '@fortawesome/pro-solid-svg-icons';


@Injectable({
    providedIn: 'root'
})
export class FaIconsService {
    icons = [
        faAlignLeft, faUser, faWallet, faLayerGroup,
        faStore, faUserCog, faCreditCard,
        faArrowUp, faArrowDown, faArrowCircleDown,
        faArrowCircleUp, faUniversity, faHandshake, faCogs,
        faFlagCheckered, faEnvelopeOpen, faSignOutAlt
    ];

    constructor(private lib: FaIconLibrary) {
    }

    addIcons() {
        this.lib.addIcons(...this.icons);
    }
}
