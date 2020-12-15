import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    constructor(private http: BackendHttpClient) {
    }

    getVeriffSession() {
        return this.http.get<VeriffSession>('/api/user/veriff/session');
    }
}

/**
 * Describes the user verification process and its state. If `Decision` is
 * equal to `null`, the decision has not been made yet.
 */
export interface VeriffSession {
    state: State;
    decision?: Decision;
    verification_url: string;
}

export enum State {
    /**
     * Verification URL has been generated and verification session has not
     * been started yet.
     */
    CREATED = 'created',
    /**
     * The user has clicked on verification URL and started verification process.
     * In given moment, user has not finished verification process yet.
     */
    STARTED = 'started',
    /**
     * The user has successfully finished verification process and is waiting for
     * a decision.
     */
    SUBMITTED = 'submitted'
}

interface Decision {
    session_id: string;
    status: DecisionStatus;
    code: number;
    reason: string;
    reason_code: DeclineDecisionCode | ResubmitDecisionCode;
    decision_time: Date;
    acceptance_time: Date;
}

export enum DecisionStatus {
    RESUBMISSION_REQUESTED = 'resubmission_requested',
    APPROVED = 'approved',
    DECLINED = 'declined',
    REVIEW = 'review',
    ABANDONED = 'abandoned',
    EXPIRED = 'expired'
}

enum DeclineDecisionCode {
    PHYSICAL_DOCUMENT_NOT_USED = 101,
    SUSPECTED_DOCUMENT = 102,
    /**
     * Person showing the document does not appear to match document photo.
     */
    NO_MATCH_DOCUMENT_PHOTO = 103,
    SUSPICIOUS_BEHAVIOUR = 105,
    KNOWN_FRAUD = 106,
    UNKNOWN_ABUSE = 107,
    DUPLICATED_USER = 108,
    DUPLICATED_DEVICE = 109,
    DUPLICATED_ID = 110,
}

enum ResubmitDecisionCode {
    VIDEO_PHOTO_MISSING = 201,
    FACE_NOT_VISIBLE = 202,
    FULL_DOCUMENT_NOT_VISIBLE = 203,
    POOR_IMAGE_QUALITY = 204,
    DOCUMENT_DAMAGED = 205,
    DOC_TYPE_NOT_SUPPORTED = 206,
    DOCUMENT_EXPIRED = 207
}
