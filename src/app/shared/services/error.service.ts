import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PopupService } from './popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from './router.service';
import { UserAuthService } from './user/user-auth.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    constructor(private popupService: PopupService,
                private router: RouterService,
                private userAuthService: UserAuthService,
                private translate: TranslateService) {
    }

    get handleError() {
        return (source: Observable<unknown>) =>
            source.pipe(this.processError());
    }

    get displayError() {
        return (source: Observable<unknown>) =>
            source.pipe(this.processError(true, false));
    }

    private processError(shouldDisplay = true, shouldTakeAction = true) {
        return catchError(err => {
            const errorRes = err as HttpErrorResponse;
            let display$: Observable<unknown>;
            let action$: Observable<unknown>;

            if (errorRes.error instanceof ErrorEvent) { // client-side error
                return throwError(err);
            } else {  // server-side error
                const error = errorRes.error as BackendError;

                switch (error.err_code) {
                    case RegistrationError.SIGN_UP_INCOMPLETE:
                        display$ = this.displayMessage('errors.registration.sign_up_incomplete');
                        break;

                    case RegistrationError.USER_EXISTS:
                        display$ = this.displayMessage('errors.registration.user_exists');
                        break;

                    case RegistrationError.CONFIRMATION_TOKEN_INVALID:
                        display$ = this.displayMessage('errors.registration.confirmation_token_invalid');
                        action$ = this.takeAction(() => this.router.navigate['/']);
                        break;

                    case RegistrationError.CONFIRMATION_TOKEN_EXPIRED:
                        display$ = this.displayMessage('errors.registration.confirmation_token_expired');
                        // TODO: Implement redirect to resend email confirmation when it gets implemented.
                        break;

                    case RegistrationError.SOCIAL_FAILED:
                        display$ = this.displayMessage('errors.registration.social_failed');
                        break;

                    case RegistrationError.CAPTCHA_FAILED:
                        display$ = this.displayMessage('errors.registration.captcha_failed');
                        break;

                    case AuthError.NO_FORGOT_PASS_TOKEN:
                    case AuthError.FORGOT_PASS_EXPIRED:
                        display$ = this.displayMessage('errors.auth.invalid_forgot_password_link');
                        action$ = this.takeAction(() => this.router.navigate['/forgot_password']);
                        break;

                    case AuthError.INVALID_JWT:
                    case AuthError.MISSING_JWT:
                    case AuthError.CANNOT_REGISTER_JWT:
                    case UserError.USER_JWT_MISSING:
                        action$ = this.takeAction(() => of(this.userAuthService.logout())
                            .pipe(this.router.navigate['/']));
                        break;

                    case AuthError.INVALID_CREDENTIALS:
                        display$ = this.displayMessage('errors.auth.invalid_credentials');
                        break;

                    case UserError.NO_USER:
                        display$ = this.displayMessage('errors.user.no_user');
                        break;

                    case UserError.INVALID_BANK_ACCOUNT_DATA:
                        display$ = this.displayMessage('errors.user.invalid_bank_account_data');
                        break;

                    case UserError.DIFFERENT_PASSWORD:
                        display$ = this.displayMessage('errors.user.different_password');
                        break;

                    case UserError.INVALID_PRIVILEGE:
                        display$ = this.displayMessage('errors.user.invalid_privilege');
                        break;

                    case WalletError.MISSING_WALLET:
                        display$ = this.displayMessage('errors.wallet.missing_wallet');
                        break;

                    case WalletError.CANNOT_CREATE_NEW_WALLET:
                        display$ = this.displayMessage('errors.wallet.cannot_create_new_wallet');
                        break;

                    case WalletError.NOT_ENOUGH_FUNDS:
                        display$ = this.displayMessage('errors.wallet.not_enough_funds');
                        break;

                    case WalletError.WALLET_ALREADY_REGISTERED:
                        display$ = this.displayMessage('errors.wallet.wallet_already_registered');
                        break;

                    case WalletError.MISSING_DEPOSIT:
                        display$ = this.displayMessage('errors.wallet.missing_deposit');
                        break;

                    case WalletError.DEPOSIT_ALREADY_MINTED:
                        display$ = this.displayMessage('errors.wallet.deposit_already_minted');
                        break;

                    case WalletError.DEPOSIT_NOT_APPROVED:
                        display$ = this.displayMessage('errors.wallet.deposit_not_approved');
                        break;

                    case WalletError.UNAPPROVED_DEPOSIT_EXISTS:
                        display$ = this.displayMessage('errors.wallet.unapproved_deposit_exists');
                        break;

                    case WalletError.MISSING_WITHDRAWAL:
                        display$ = this.displayMessage('errors.wallet.missing_withdrawal');
                        break;

                    case WalletError.UNAPPROVED_WITHDRAW_EXISTS:
                        display$ = this.displayMessage('errors.wallet.unapproved_withdraw_exists');
                        break;

                    case WalletError.WITHDRAW_ALREADY_APPROVED:
                        display$ = this.displayMessage('errors.wallet.withdraw_already_approved');
                        break;

                    case WalletError.WITHDRAW_NOT_APPROVED:
                        display$ = this.displayMessage('errors.wallet.withdraw_not_approved');
                        break;

                    case WalletError.WITHDRAW_ALREADY_BURNED:
                        display$ = this.displayMessage('errors.wallet.withdraw_already_burned');
                        break;

                    case WalletError.WALLET_NOT_ACTIVATED_BY_ADMIN:
                        display$ = this.displayMessage('errors.wallet.wallet_not_activated_by_admin');
                        break;

                    case WalletError.MISSING_REVENUE_PAYOUT:
                        display$ = this.displayMessage('errors.wallet.missing_revenue_payout');
                        break;

                    case OrganizationError.ORG_MISSING:
                        display$ = this.displayMessage('errors.organization.org_missing');
                        break;

                    case OrganizationError.USER_ALREADY_MEMBER:
                        display$ = this.displayMessage('errors.organization.user_already_member');
                        break;

                    case OrganizationError.USER_ALREADY_INVITED:
                        display$ = this.displayMessage('errors.organization.user_already_invited');
                        break;

                    case OrganizationError.ORG_NAME_ALREADY_EXISTS:
                        display$ = this.displayMessage('errors.organization.org_name_already_exists');
                        break;

                    case OrganizationError.ORG_MISSING_PRIVILEGE:
                        display$ = this.displayMessage('errors.organization.org_missing_privilege');
                        break;

                    case OrganizationError.INVALID_ORG_INVITATION:
                        display$ = this.displayMessage('errors.organization.invalid_org_invitation');
                        break;

                    case OrganizationError.ORG_MEMBERSHIP_MISSING:
                        display$ = this.displayMessage('errors.organization.org_membership_missing');
                        break;

                    case ProjectError.PROJECT_MISSING:
                        display$ = this.displayMessage('errors.project.project_missing');
                        break;

                    case ProjectError.INVALID_DATE:
                        display$ = this.displayMessage('errors.project.invalid_date');
                        break;

                    case ProjectError.PROJECT_EXPIRED:
                        display$ = this.displayMessage('errors.project.project_expired');
                        break;

                    case ProjectError.USER_EXCEEDED_MAX_FUNDS:
                        display$ = this.displayMessage('errors.project.user_exceeded_max_funds');
                        break;

                    case ProjectError.PROJECT_REACHED_EXPECTED_FUNDING:
                        display$ = this.displayMessage('errors.project.project_reached_expected_funding');
                        break;

                    case ProjectError.PROJECT_NOT_ACTIVE:
                        display$ = this.displayMessage('errors.project.project_not_active');
                        break;

                    case ProjectError.MIN_INVESTMENT_GREATER_THAN_MAX:
                        display$ = this.displayMessage('errors.project.min_investment_greater_than_max');
                        break;

                    case ProjectError.EXPECTED_FUNDING_TOO_HIGH:
                        display$ = this.displayMessage('errors.project.expected_funding_too_high');
                        break;

                    case ProjectError.MAX_INVESTMENT_TOO_HIGH:
                        display$ = this.displayMessage('errors.project.max_investment_too_high');
                        break;

                    case ProjectError.INVALID_ROI:
                        display$ = this.displayMessage('errors.project.invalid_roi');
                        break;

                    case InternalError.UPLOAD_DOCUMENT_FAILED:
                    case InternalError.INVALID_VALUE_IN_REQUEST:
                    case InternalError.GRPC_FAILED_BLOCKCHAIN_SERVICE:
                    case InternalError.GRPC_FAILED_USER_SERVICE:
                    case InternalError.GRPC_FAILED_PROJECT_SERVICE:
                    case InternalError.GRPC_FAILED_MAIL_SERVICE:
                    case InternalError.DATABASE_EXCEPTION:
                    case InternalError.INVALID_REQUEST_DATA:
                    case InternalError.GRPC_FAILED_WALLET_SERVICE:
                    case InternalError.PDF_GENERATION_FAILED:
                        display$ = this.displayMessage('errors.internal.something_went_wrong');
                        break;

                    case TransactionError.TRANSACTION_MISSING:
                        display$ = this.displayMessage('errors.transaction.transaction_missing');
                        break;
                    case TransactionError.MISSING_COMPANION_DATA:
                        display$ = this.displayMessage('errors.transaction.missing_companion_data');
                        break;

                    case CooperativeError.COOP_MISSING:
                        display$ = this.displayMessage('errors.cooperative.coop_missing');
                        break;
                    case CooperativeError.COOP_ALREADY_EXISTS:
                        display$ = this.displayMessage('errors.cooperative.coop_already_exists');
                        break;

                    case MiddlewareError.TRANSACTION_NOT_SIGNED:
                        display$ = this.displayMessage('errors.middleware.transaction_not_signed');
                        break;
                    case MiddlewareError.TRANSACTION_NOT_MINED:
                        display$ = this.displayMessage('errors.middleware.transaction_not_mined');
                        break;
                    case MiddlewareError.TRANSACTION_NOT_FOUND:
                        display$ = this.displayMessage('errors.middleware.transaction_not_found');
                        break;
                    case MiddlewareError.WALLET_NOT_FOUND:
                        display$ = this.displayMessage('errors.middleware.wallet_not_found');
                        break;
                    case MiddlewareError.WALLET_ALREADY_EXISTS:
                        display$ = this.displayMessage('errors.middleware.wallet_already_exists');
                        break;

                    case MiddlewareError.INVALID_CONTRACT_CALLED:
                    case MiddlewareError.TRANSACTION_VERIFICATION_FAILED:
                    case MiddlewareError.CREATE_WALLET_TRANSACTION_FAILED:
                    case MiddlewareError.CREATE_WALLET_TRANSACTION_PENDING:
                    case MiddlewareError.CREATE_GROUP_CONTRACT_FAILED:
                    case MiddlewareError.CREATE_PROJECT_CONTRACT_FAILED:
                    case MiddlewareError.CREATE_SELL_OFFER_CONTRACT_FAILED:
                    case MiddlewareError.AE_SDK_ERROR:
                    case MiddlewareError.TRANSACTION_DRY_RUN_FAILED:
                    case MiddlewareError.PRECONDITION_FAILED:
                    case MiddlewareError.COOPERATIVE_MISSING:
                    case MiddlewareError.CONTRACT_DEPLOYMENT_FAILED:
                    case MiddlewareError.UNKNOWN_ERROR:
                        display$ = this.displayMessage('errors.middleware.general_error');
                        break;
                }
            }

            return of('').pipe(
                switchMap(() => shouldDisplay && display$ ? display$ : of('')),
                switchMap(() => {
                    if (shouldTakeAction) {
                        return action$ ? action$ : EMPTY;
                    } else {
                        return throwError(err);
                    }
                })
            );
        });
    }

    private takeAction<T>(source: () => Observable<T> | Promise<T>): Observable<T> {
        return of('').pipe(switchMap(source));
    }

    private displayMessage(translationKey: string) {
        return this.popupService.error(this.translate.instant(translationKey));
    }
}

interface BackendError {
    description: string;
    message: string;
    err_code: RegistrationError | AuthError | UserError | WalletError | OrganizationError |
        ProjectError | InternalError | TransactionError | CooperativeError | MiddlewareError;
    errors: { [key: string]: string };
}

enum RegistrationError {
    SIGN_UP_INCOMPLETE = '0101',
    USER_EXISTS = '0103',
    CONFIRMATION_TOKEN_INVALID = '0104',
    CONFIRMATION_TOKEN_EXPIRED = '0105',
    SOCIAL_FAILED = '0106',
    CAPTCHA_FAILED = '0110',
}

enum AuthError {
    NO_FORGOT_PASS_TOKEN = '0202',
    FORGOT_PASS_EXPIRED = '0203',
    INVALID_JWT = '0204',
    MISSING_JWT = '0205',
    CANNOT_REGISTER_JWT = '0206',
    INVALID_CREDENTIALS = '0207',
}

enum UserError {
    USER_JWT_MISSING = '0301',
    INVALID_BANK_ACCOUNT_DATA = '0302',
    DIFFERENT_PASSWORD = '0303',
    INVALID_PRIVILEGE = '0305',
    NO_USER = '0306'
}

enum WalletError {
    MISSING_WALLET = '0501',
    CANNOT_CREATE_NEW_WALLET = '0502',
    NOT_ENOUGH_FUNDS = '0503',
    WALLET_ALREADY_REGISTERED = '0504',
    MISSING_DEPOSIT = '0505',
    DEPOSIT_ALREADY_MINTED = '0506',
    DEPOSIT_NOT_APPROVED = '0507',
    UNAPPROVED_DEPOSIT_EXISTS = '0508',
    MISSING_WITHDRAWAL = '0509',
    UNAPPROVED_WITHDRAW_EXISTS = '0510',
    WITHDRAW_ALREADY_APPROVED = '0511',
    WITHDRAW_NOT_APPROVED = '0512',
    WITHDRAW_ALREADY_BURNED = '0513',
    WALLET_NOT_ACTIVATED_BY_ADMIN = '0514',
    MISSING_REVENUE_PAYOUT = '0515',
}

enum OrganizationError {
    ORG_MISSING = '0601',
    USER_ALREADY_MEMBER = '0604',
    USER_ALREADY_INVITED = '0605',
    ORG_NAME_ALREADY_EXISTS = '0606',
    ORG_MISSING_PRIVILEGE = '0607',
    ORG_MEMBERSHIP_MISSING = '0608',
    INVALID_ORG_INVITATION = '0609',
}

enum ProjectError {
    PROJECT_MISSING = '0701',
    INVALID_DATE = '0702',
    PROJECT_EXPIRED = '0703',
    USER_EXCEEDED_MAX_FUNDS = '0704',
    PROJECT_REACHED_EXPECTED_FUNDING = '0706',
    PROJECT_NOT_ACTIVE = '0707',
    MIN_INVESTMENT_GREATER_THAN_MAX = '0708',
    EXPECTED_FUNDING_TOO_HIGH = '0709',
    MAX_INVESTMENT_TOO_HIGH = '0710',
    INVALID_ROI = '0711',
}

enum InternalError {
    UPLOAD_DOCUMENT_FAILED = '0801',
    INVALID_VALUE_IN_REQUEST = '0802',
    GRPC_FAILED_BLOCKCHAIN_SERVICE = '0803',
    GRPC_FAILED_USER_SERVICE = '0804',
    GRPC_FAILED_PROJECT_SERVICE = '0805',
    GRPC_FAILED_MAIL_SERVICE = '0806',
    DATABASE_EXCEPTION = '0807',
    INVALID_REQUEST_DATA = '0808',
    GRPC_FAILED_WALLET_SERVICE = '0809',
    PDF_GENERATION_FAILED = '0810',
}

enum TransactionError {
    TRANSACTION_MISSING = '0901',
    MISSING_COMPANION_DATA = '0902',
}

enum CooperativeError {
    COOP_MISSING = '1001',
    COOP_ALREADY_EXISTS = '1002',
}

enum MiddlewareError {
    TRANSACTION_NOT_SIGNED = '1101',
    TRANSACTION_NOT_MINED = '1102',
    INVALID_CONTRACT_CALLED = '1103',
    TRANSACTION_VERIFICATION_FAILED = '1104',
    TRANSACTION_NOT_FOUND = '1105',
    WALLET_NOT_FOUND = '1110',
    CREATE_WALLET_TRANSACTION_FAILED = '1111',
    CREATE_WALLET_TRANSACTION_PENDING = '1112',
    WALLET_ALREADY_EXISTS = '1113',
    CREATE_GROUP_CONTRACT_FAILED = '1120',
    CREATE_PROJECT_CONTRACT_FAILED = '1130',
    CREATE_SELL_OFFER_CONTRACT_FAILED = '1131',
    AE_SDK_ERROR = '1140',
    TRANSACTION_DRY_RUN_FAILED = '1150',
    PRECONDITION_FAILED = '1160',
    COOPERATIVE_MISSING = '1170',
    CONTRACT_DEPLOYMENT_FAILED = '1190',
    UNKNOWN_ERROR = '1199'
}
