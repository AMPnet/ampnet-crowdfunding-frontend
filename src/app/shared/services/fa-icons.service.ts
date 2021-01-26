import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
    faAddressBook,
    faAlignLeft,
    faArrowCircleDown,
    faArrowCircleUp,
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faBolt,
    faCaretRight,
    faChartLine,
    faChartPie,
    faCheck,
    faCheckCircle,
    faClock,
    faCogs,
    faCreditCard,
    faDizzy,
    faEnvelope,
    faEnvelopeOpen,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faFileChartLine,
    faFileDownload,
    faFlagCheckered,
    faHandshake,
    faInfoCircle,
    faLayerGroup,
    faLink,
    faLock,
    faLongArrowAltLeft,
    faMapMarkedAlt,
    faPaperPlane,
    faPiggyBank,
    faPlus,
    faPlusCircle,
    faSearch,
    faSignOutAlt,
    faSolarPanel,
    faStore,
    faTimesCircle,
    faTrash,
    faTrashAlt,
    faUniversity,
    faUser,
    faUserCog,
    faUsers,
    faWallet
} from '@fortawesome/pro-solid-svg-icons';

import { faFacebookF, faFacebookSquare, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';

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
        faPaperPlane, faChartPie, faDizzy, faMapMarkedAlt, faTimesCircle, faLink,
        faFileDownload, faLock, faExclamationTriangle, faPlus, faTrash, faTrashAlt, faChartLine,
        faPlusCircle, faArrowLeft, faArrowRight, faBolt, faFileChartLine, faCheck, faEye, faEyeSlash,
        faSearch, faCheckCircle, faSolarPanel, faUsers, faFacebookF, faFacebookSquare,
        faTwitter, faGoogle, faInfoCircle, faEnvelope
    ];

    constructor(private lib: FaIconLibrary) {
    }

    addIcons() {
        this.lib.addIcons(...this.icons);
    }
}
