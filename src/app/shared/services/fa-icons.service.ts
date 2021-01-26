import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
    faAddressBook,
    faAlignLeft,
    faArrowCircleDown,
    faArrowCircleUp,
    faArrowDown,
    faArrowRight,
    faArrowUp,
    faBolt,
    faCaretRight,
    faChartPie,
    faCheck,
    faClock,
    faCogs,
    faCreditCard,
    faDizzy,
    faEnvelopeOpen,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faFileChartLine,
    faFileDownload,
    faFlagCheckered,
    faHandshake,
    faLayerGroup,
    faLink,
    faLock,
    faLongArrowAltLeft,
    faMapMarkerAlt,
    faPaperPlane,
    faPiggyBank,
    faPlus,
    faPlusCircle,
    faSignOutAlt,
    faStore,
    faTimesCircle,
    faTrash,
    faTrashAlt,
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
        faFlagCheckered, faEnvelopeOpen, faSignOutAlt, faLongArrowAltLeft,
        faCaretRight, faExclamationTriangle, faClock, faPiggyBank, faAddressBook,
        faPaperPlane, faChartPie, faDizzy, faMapMarkerAlt, faTimesCircle, faLink,
        faFileDownload, faLock, faExclamationTriangle, faPlus, faTrash, faTrashAlt,
        faPlusCircle, faArrowRight, faBolt, faFileChartLine, faCheck, faEye, faEyeSlash
    ];

    constructor(private lib: FaIconLibrary) {
    }

    addIcons() {
        this.lib.addIcons(...this.icons);
    }
}
