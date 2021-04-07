import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { PopupService } from './popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from './router.service';
import { UserService } from './user/user.service';


@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    constructor(private popupService: PopupService,
                private router: RouterService,
                private userService: UserService,
                private translate: TranslateService) {
    }

    get handleError() {
        return <T>(source: Observable<T>): Observable<T> => {
            return source.pipe(catchError(this.processError()));
        };
    }

    private processError<T>() {
        return (err: any, caught: Observable<T>) => {
            const errorRes = err as HttpErrorResponse;
            let action$: Observable<any> = throwError(err);
            let completeAfterAction = true;

            if (errorRes.error instanceof ErrorEvent) { // client-side error
                return action$;
            } else if (errorRes.status === 400) {  // server-side error
                const error = errorRes.error as BackendError;

                switch (error?.err_code) {
                    case RegistrationError.SIGN_UP_INCOMPLETE:
                        action$ = this.displayMessage('errors.registration.sign_up_incomplete');
                        break;

                    case RegistrationError.USER_EXISTS:
                        action$ = this.displayMessage('errors.registration.user_exists');
                        break;

                    case RegistrationError.CONFIRMATION_TOKEN_INVALID:
                        action$ = this.displayMessage('errors.registration.confirmation_token_invalid').pipe(
                            finalize(() => this.router.navigate['/'])
                        );
                        break;

                    case RegistrationError.CONFIRMATION_TOKEN_EXPIRED:
                        action$ = this.displayMessage('errors.registration.confirmation_token_expired');
                        // TODO: Implement redirect to resend email confirmation when it gets implemented.
                        break;

                    case RegistrationError.SOCIAL_FAILED:
                        action$ = this.displayMessage('errors.registration.social_failed');
                        break;

                    case RegistrationError.CAPTCHA_FAILED:
                        action$ = this.displayMessage('errors.registration.captcha_failed');
                        break;

                    case RegistrationError.SIGN_UP_DISABLED:
                        action$ = this.displayMessage('errors.registration.sign_up_disabled');
                        break;

                    case AuthError.INVALID_LOGIN_METHOD:
                        action$ = this.displayMessage('errors.auth.invalid_login_method');
                        break;

                    case AuthError.NO_FORGOT_PASS_TOKEN:
                    case AuthError.FORGOT_PASS_EXPIRED:
                        action$ = this.displayMessage('errors.auth.invalid_forgot_password_link').pipe(
                            finalize(() => this.router.navigate['/auth/forgot_password'])
                        );
                        break;

                    case AuthError.INVALID_JWT:
                        action$ = this.userService.refreshUserToken().pipe(
                            this.handleError,
                            switchMap(() => caught)
                        );
                        completeAfterAction = false;
                        break;
                    case AuthError.MISSING_JWT:
                    case AuthError.CANNOT_REGISTER_JWT:
                    case UserError.USER_JWT_MISSING:
                    case AuthError.INVALID_REFRESH_TOKEN:
                    case InternalError.JWT_VALIDATION_FAILED:
                        action$ = this.userService.logout().pipe(
                            tap(() => this.router.navigate(['/auth/sign_in']))
                        );
                        break;

                    case AuthError.INVALID_CREDENTIALS:
                        action$ = this.displayMessage('errors.auth.invalid_credentials');
                        break;

                    case UserError.NO_USER:
                        action$ = this.displayMessage('errors.user.no_user');
                        break;

                    case UserError.INVALID_BANK_ACCOUNT_DATA:
                        action$ = this.displayMessage('errors.user.invalid_bank_account_data');
                        break;

                    case UserError.DIFFERENT_PASSWORD:
                        action$ = this.displayMessage('errors.user.different_password');
                        break;

                    case UserError.INVALID_PRIVILEGE:
                        action$ = this.displayMessage('errors.user.invalid_privilege');
                        break;

                    case WalletError.MISSING_WALLET:
                        action$ = this.displayMessage('errors.wallet.missing_wallet');
                        break;

                    case WalletError.CANNOT_CREATE_NEW_WALLET:
                        action$ = this.displayMessage('errors.wallet.cannot_create_new_wallet');
                        break;

                    case WalletError.NOT_ENOUGH_FUNDS:
                        action$ = this.displayMessage('errors.wallet.not_enough_funds');
                        break;

                    case WalletError.WALLET_ALREADY_REGISTERED:
                        action$ = this.displayMessage('errors.wallet.wallet_already_registered');
                        break;

                    case WalletError.MISSING_DEPOSIT:
                        action$ = this.displayMessage('errors.wallet.missing_deposit');
                        break;

                    case WalletError.DEPOSIT_ALREADY_MINTED:
                        action$ = this.displayMessage('errors.wallet.deposit_already_minted');
                        break;

                    case WalletError.DEPOSIT_NOT_APPROVED:
                        action$ = this.displayMessage('errors.wallet.deposit_not_approved');
                        break;

                    case WalletError.UNAPPROVED_DEPOSIT_EXISTS:
                        action$ = this.displayMessage('errors.wallet.unapproved_deposit_exists');
                        break;

                    case WalletError.MISSING_WITHDRAWAL:
                        action$ = this.displayMessage('errors.wallet.missing_withdrawal');
                        break;

                    case WalletError.UNAPPROVED_WITHDRAW_EXISTS:
                        action$ = this.displayMessage('errors.wallet.unapproved_withdraw_exists');
                        break;

                    case WalletError.WITHDRAW_ALREADY_APPROVED:
                        action$ = this.displayMessage('errors.wallet.withdraw_already_approved');
                        break;

                    case WalletError.WITHDRAW_NOT_APPROVED:
                        action$ = this.displayMessage('errors.wallet.withdraw_not_approved');
                        break;

                    case WalletError.WITHDRAW_ALREADY_BURNED:
                        action$ = this.displayMessage('errors.wallet.withdraw_already_burned');
                        break;

                    case WalletError.WALLET_NOT_ACTIVATED_BY_ADMIN:
                        action$ = this.displayMessage('errors.wallet.wallet_not_activated_by_admin');
                        break;

                    case WalletError.MISSING_REVENUE_PAYOUT:
                        action$ = this.displayMessage('errors.wallet.missing_revenue_payout');
                        break;

                    case OrganizationError.ORG_MISSING:
                        action$ = this.displayMessage('errors.organization.org_missing');
                        break;

                    case OrganizationError.USER_ALREADY_MEMBER:
                        action$ = this.displayMessage('errors.organization.user_already_member');
                        break;

                    case OrganizationError.USER_ALREADY_INVITED:
                        action$ = this.displayMessage('errors.organization.user_already_invited');
                        break;

                    case OrganizationError.ORG_NAME_ALREADY_EXISTS:
                        action$ = this.displayMessage('errors.organization.org_name_already_exists');
                        break;

                    case OrganizationError.ORG_MISSING_PRIVILEGE:
                        action$ = this.displayMessage('errors.organization.org_missing_privilege');
                        break;

                    case OrganizationError.INVALID_ORG_INVITATION:
                        action$ = this.displayMessage('errors.organization.invalid_org_invitation');
                        break;

                    case OrganizationError.ORG_MEMBERSHIP_MISSING:
                        action$ = this.displayMessage('errors.organization.org_membership_missing');
                        break;

                    case ProjectError.PROJECT_MISSING:
                        action$ = this.displayMessage('errors.project.project_missing');
                        break;

                    case ProjectError.INVALID_DATE:
                        action$ = this.displayMessage('errors.project.invalid_date');
                        break;

                    case ProjectError.PROJECT_EXPIRED:
                        action$ = this.displayMessage('errors.project.project_expired');
                        break;

                    case ProjectError.USER_EXCEEDED_MAX_FUNDS:
                        action$ = this.displayMessage('errors.project.user_exceeded_max_funds');
                        break;

                    case ProjectError.PROJECT_REACHED_EXPECTED_FUNDING:
                        action$ = this.displayMessage('errors.project.project_reached_expected_funding');
                        break;

                    case ProjectError.PROJECT_NOT_ACTIVE:
                        action$ = this.displayMessage('errors.project.project_not_active');
                        break;

                    case ProjectError.MIN_INVESTMENT_GREATER_THAN_MAX:
                        action$ = this.displayMessage('errors.project.min_investment_greater_than_max');
                        break;

                    case ProjectError.EXPECTED_FUNDING_TOO_HIGH:
                        action$ = this.displayMessage('errors.project.expected_funding_too_high');
                        break;

                    case ProjectError.MAX_INVESTMENT_TOO_HIGH:
                        action$ = this.displayMessage('errors.project.max_investment_too_high');
                        break;

                    case ProjectError.INVALID_ROI:
                        action$ = this.displayMessage('errors.project.invalid_roi');
                        break;

                    case ProjectError.NO_WRITE_PRIVILEGE:
                        action$ = this.displayMessage('errors.project.no_write_privilege');
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
                        action$ = this.displayMessage('errors.internal.something_went_wrong');
                        break;

                    case TransactionError.TRANSACTION_MISSING:
                        action$ = this.displayMessage('errors.transaction.transaction_missing');
                        break;
                    case TransactionError.MISSING_COMPANION_DATA:
                        action$ = this.displayMessage('errors.transaction.missing_companion_data');
                        break;

                    case CooperativeError.COOP_MISSING:
                        action$ = this.displayMessage('errors.cooperative.coop_missing');
                        break;
                    case CooperativeError.COOP_ALREADY_EXISTS:
                        action$ = this.displayMessage('errors.cooperative.coop_already_exists');
                        break;

                    case MiddlewareError.TRANSACTION_NOT_SIGNED:
                        action$ = this.displayMessage('errors.middleware.transaction_not_signed');
                        break;
                    case MiddlewareError.TRANSACTION_NOT_MINED:
                        action$ = this.displayMessage('errors.middleware.transaction_not_mined');
                        break;
                    case MiddlewareError.TRANSACTION_NOT_FOUND:
                        action$ = this.displayMessage('errors.middleware.transaction_not_found');
                        break;
                    case MiddlewareError.WALLET_NOT_FOUND:
                        action$ = this.displayMessage('errors.middleware.wallet_not_found');
                        break;
                    case MiddlewareError.WALLET_ALREADY_EXISTS:
                        action$ = this.displayMessage('errors.middleware.wallet_already_exists');
                        break;

                    // Synchronous errors that are reasonable to show
                    case MiddlewareError.TOKEN_NOT_INITIALIZED:
                        action$ = this.displayMessage('errors.middleware.token_not_initialized');
                        break;
                    case MiddlewareError.INVEST_FAILED_PROJECT_FUNDED:
                        action$ = this.displayMessage('errors.middleware.project_funded');
                        break;
                    case MiddlewareError.INVEST_FAILED_ZERO_TOKENS:
                        action$ = this.displayMessage('errors.middleware.invest_zero_tokens');
                        break;
                    case MiddlewareError.INVEST_FAILED_INSUFFICIENT_FUNDS:
                        action$ = this.displayMessage('errors.middleware.insufficient_funds');
                        break;
                    case MiddlewareError.INVEST_MAX_PER_USER_EXCEEDED:
                        action$ = this.displayMessage('errors.middleware.max_per_user_exceeded');
                        break;
                    case MiddlewareError.INVEST_MIN_PER_USER_REQUIRED:
                        action$ = this.displayMessage('errors.middleware.min_per_user_required');
                        break;
                    case MiddlewareError.INVEST_INVESTMENT_CAP_EXCEEDED:
                        action$ = this.displayMessage('errors.middleware.investment_cap_exceeded');
                        break;
                    case MiddlewareError.INVEST_FRACTION_NON_FUNDED:
                        action$ = this.displayMessage('errors.middleware.fraction_non_funded');
                        break;
                    case MiddlewareError.INVEST_FUNDING_ENDED:
                        action$ = this.displayMessage('errors.middleware.funding_ended');
                        break;
                    case MiddlewareError.WITHDRAW_AMOUNT_TOO_LOW:
                        action$ = this.displayMessage('errors.middleware.withdraw_amount_too_low');
                        break;
                    case MiddlewareError.REVENUE_SHARE_ORG_OWNER_PERMISSION:
                        action$ = this.displayMessage('errors.middleware.revenue_share_org_owner_permission');
                        break;
                    case MiddlewareError.REVENUE_SHARE_PROJECT_STILL_FUNDING:
                        action$ = this.displayMessage('errors.middleware.revenue_share_project_still_funding');
                        break;
                    case MiddlewareError.REVENUE_SHARE_ZERO:
                        action$ = this.displayMessage('errors.middleware.revenue_share_zero');
                        break;
                    case MiddlewareError.REVENUE_SHARE_PROJECT_BALANCE_LOW:
                        action$ = this.displayMessage('errors.middleware.revenue_share_project_balance_low');
                        break;
                    case MiddlewareError.REVENUE_SHARE_ALREADY_STARTED:
                        action$ = this.displayMessage('errors.middleware.revenue_share_already_started');
                        break;

                    // Error that are unlikely to happen on frontend.
                    // For now, there is no reason to show the exact messages.
                    case MiddlewareError.CLAIM_OWNERSHIP_DISABLED:
                    case MiddlewareError.MULTIPLE_OWNERSHIP_CLAIM:
                    case MiddlewareError.PLATFORM_MANAGER_PERMISSION_REQUIRED:
                    case MiddlewareError.SENDER_WALLET_NOT_ACTIVATED:
                    case MiddlewareError.RECEIVER_WALLET_NOT_ACTIVATED:
                    case MiddlewareError.WALLET_NOT_ACTIVATED:
                    case MiddlewareError.WITHDRAW_AMOUNT_MUST_BE_POSITIVE:
                    case MiddlewareError.TRANSFER_FUNDS_MUST_BE_POSITIVE:
                    case MiddlewareError.USER_INSUFFICIENT_FUNDS:
                    case MiddlewareError.APPROVE_SENDER_WALLET_NOT_ACTIVATED:
                    case MiddlewareError.APPROVE_RECEIVER_WALLET_NOT_ACTIVATED:
                    case MiddlewareError.DEPOSIT_APPROVE_FAILED:
                    case MiddlewareError.WITHDRAW_FAILED:
                    case MiddlewareError.WITHDRAW_AMOUNT_TOO_HIGH:
                    case MiddlewareError.TOKEN_ISSUER_PERMISSION_REQUIRED:
                    case MiddlewareError.ACTIVATED_WALLET_REQUIRED:
                    case MiddlewareError.CREATE_ORG_UNAUTHORIZED:
                    case MiddlewareError.ADD_TO_ORG_UNAUTHORIZED:
                    case MiddlewareError.ACCEPT_INVITE_NO_ORG:
                    case MiddlewareError.ACCEPT_INVITE_ACCEPTED:
                    case MiddlewareError.ORG_OWNER_PERMISSION:
                    case MiddlewareError.ACTIVE_WALLET_PERMISSION:
                    case MiddlewareError.ORG_ACTIVE_WALLET_PERMISSION:
                    case MiddlewareError.ORG_OWNER_TO_CREATE_PROJECT:
                    case MiddlewareError.ORG_ACTIVE_WALLET_TO_CREATE_PROJECT:
                    case MiddlewareError.ORG_OWNER_TO_CANCEL:
                    case MiddlewareError.PLAT_MANAGER_ADD_INVESTMENT:
                    case MiddlewareError.NEW_INVESTMENT_PROJECT_FUNDED:
                    case MiddlewareError.NEW_INVESTMENT_PROJECT_EXPIRED:
                    case MiddlewareError.INVESTMENT_CANCEL_FAILED:
                    case MiddlewareError.WITHDRAW_FAILED_CAP_NOT_REACHED:
                    case MiddlewareError.ORG_OWNER_WITHDRAW_PERMISSION:
                    case MiddlewareError.WITHDRAW_FAILED_PAYOUT_IN_PROCESS:
                    case MiddlewareError.EXECUTE_PAYOUT_FAILED_NOT_STARTED:
                    case MiddlewareError.REVENUE_SHARE_ACTIVE_WALLET_PERMISSION:
                    case MiddlewareError.REVENUE_SHARE_AMOUNT_GT_ZERO_REQUIRED:
                    case MiddlewareError.REVENUE_SHARE_BALANCE_LOW:
                    case MiddlewareError.TRANSFER_SHARES_PROJECT_STILL_FUNDING:
                    case MiddlewareError.TRANSFER_SHARES_REVENUE_SHARE_IN_PROCESS:
                    case MiddlewareError.TRANSFER_SHARES_INSUFFICIENT_FUNDS:
                    case MiddlewareError.TRANSFER_SHARES_NEED_APPROVAL:
                    case MiddlewareError.TRANSFER_SHARES_SENDER_NOT_MEMBER:
                    case MiddlewareError.TRANSFER_SHARES_RECEIVER_NOT_MEMBER:
                    case MiddlewareError.SELL_OFFER_PROJECT_NOT_FUNDED:
                    case MiddlewareError.SELL_OFFER_SHARE_AMOUNT_TOO_LOW:
                    case MiddlewareError.SELL_OFFER_SETTLED:
                    case MiddlewareError.SELL_OFFER_INSUFFICIENT_FUNDS:
                    case MiddlewareError.COUNTER_OFFER_SELLER_ACCEPT_PERMISSION:
                    case MiddlewareError.COUNTER_OFFER_NOT_FOUND:
                    case MiddlewareError.COUNTER_OFFER_SELLER_CANCEL_PERMISSION:

                    case MiddlewareError.INVALID_CONTRACT_CALLED:
                    case MiddlewareError.TRANSACTION_VERIFICATION_FAILED:
                    case MiddlewareError.CREATE_WALLET_TRANSACTION_FAILED:
                    case MiddlewareError.CREATE_WALLET_TRANSACTION_PENDING:
                    case MiddlewareError.CREATE_GROUP_CONTRACT_FAILED:
                    case MiddlewareError.CREATE_PROJECT_CONTRACT_FAILED:
                    case MiddlewareError.CREATE_SELL_OFFER_CONTRACT_FAILED:
                    case MiddlewareError.AE_SDK_ERROR:
                    case MiddlewareError.TRANSACTION_DRY_RUN_FAILED:
                    case MiddlewareError.COOPERATIVE_MISSING:
                    case MiddlewareError.CONTRACT_DEPLOYMENT_FAILED:
                    case MiddlewareError.UNKNOWN_ERROR:
                        action$ = this.displayMessage('errors.middleware.general_error');
                        break;
                    case undefined:
                    default:
                        action$ = this.displayMessage('errors.internal.something_went_wrong');
                }
            }

            return completeAfterAction ? action$.pipe(switchMap(() => EMPTY)) : action$;
        };
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

export enum RegistrationError {
    SIGN_UP_INCOMPLETE = '0101',
    USER_EXISTS = '0103',
    CONFIRMATION_TOKEN_INVALID = '0104',
    CONFIRMATION_TOKEN_EXPIRED = '0105',
    SOCIAL_FAILED = '0106',
    CAPTCHA_FAILED = '0110',
    SIGN_UP_DISABLED = '0112',
}

export enum AuthError {
    INVALID_LOGIN_METHOD = '0201',
    NO_FORGOT_PASS_TOKEN = '0202',
    FORGOT_PASS_EXPIRED = '0203',
    INVALID_JWT = '0204',
    MISSING_JWT = '0205',
    CANNOT_REGISTER_JWT = '0206',
    INVALID_CREDENTIALS = '0207',
    INVALID_REFRESH_TOKEN = '0208',
}

export enum UserError {
    USER_JWT_MISSING = '0301',
    INVALID_BANK_ACCOUNT_DATA = '0302',
    DIFFERENT_PASSWORD = '0303',
    INVALID_PRIVILEGE = '0305',
    NO_USER = '0306'
}

export enum WalletError {
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

export enum OrganizationError {
    ORG_MISSING = '0601',
    USER_ALREADY_MEMBER = '0604',
    USER_ALREADY_INVITED = '0605',
    ORG_NAME_ALREADY_EXISTS = '0606',
    ORG_MISSING_PRIVILEGE = '0607',
    ORG_MEMBERSHIP_MISSING = '0608',
    INVALID_ORG_INVITATION = '0609',
}

export enum ProjectError {
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
    NO_WRITE_PRIVILEGE = '0713',
}

export enum InternalError {
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
    JWT_VALIDATION_FAILED = '0813',
}

export enum TransactionError {
    TRANSACTION_MISSING = '0901',
    MISSING_COMPANION_DATA = '0902',
}

export enum CooperativeError {
    COOP_MISSING = '1001',
    COOP_ALREADY_EXISTS = '1002',
}

export enum MiddlewareError {
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

    CLAIM_OWNERSHIP_DISABLED = '11600',
    MULTIPLE_OWNERSHIP_CLAIM = '11601',
    TOKEN_NOT_INITIALIZED = '11602',
    PLATFORM_MANAGER_PERMISSION_REQUIRED = '11603',
    SENDER_WALLET_NOT_ACTIVATED = '11604',
    RECEIVER_WALLET_NOT_ACTIVATED = '11605',
    WALLET_NOT_ACTIVATED = '11606',
    WITHDRAW_AMOUNT_MUST_BE_POSITIVE = '11607',
    TRANSFER_FUNDS_MUST_BE_POSITIVE = '11608',
    USER_INSUFFICIENT_FUNDS = '11609',
    APPROVE_SENDER_WALLET_NOT_ACTIVATED = '11610',
    APPROVE_RECEIVER_WALLET_NOT_ACTIVATED = '11611',
    DEPOSIT_APPROVE_FAILED = '11612',
    WITHDRAW_FAILED = '11613',
    WITHDRAW_AMOUNT_TOO_HIGH = '11614',
    WITHDRAW_AMOUNT_TOO_LOW = '11615',
    TOKEN_ISSUER_PERMISSION_REQUIRED = '11616',
    ACTIVATED_WALLET_REQUIRED = '11617',
    CREATE_ORG_UNAUTHORIZED = '11618',
    ADD_TO_ORG_UNAUTHORIZED = '11619',
    ACCEPT_INVITE_NO_ORG = '11620',
    ACCEPT_INVITE_ACCEPTED = '11621',
    ORG_OWNER_PERMISSION = '11622',
    ACTIVE_WALLET_PERMISSION = '11623',
    ORG_ACTIVE_WALLET_PERMISSION = '11624',
    ORG_OWNER_TO_CREATE_PROJECT = '11625',
    ORG_ACTIVE_WALLET_TO_CREATE_PROJECT = '11626',
    ORG_OWNER_TO_CANCEL = '11627',
    PLAT_MANAGER_ADD_INVESTMENT = '11628',
    NEW_INVESTMENT_PROJECT_FUNDED = '11629',
    NEW_INVESTMENT_PROJECT_EXPIRED = '11630',
    INVESTMENT_CANCEL_FAILED = '11631',
    WITHDRAW_FAILED_CAP_NOT_REACHED = '11632',
    ORG_OWNER_WITHDRAW_PERMISSION = '11633',
    WITHDRAW_FAILED_PAYOUT_IN_PROCESS = '11634',
    EXECUTE_PAYOUT_FAILED_NOT_STARTED = '11635',
    INVEST_FAILED_PROJECT_FUNDED = '11636',
    INVEST_FAILED_ZERO_TOKENS = '11637',
    INVEST_FAILED_INSUFFICIENT_FUNDS = '11638',
    INVEST_MAX_PER_USER_EXCEEDED = '11639',
    INVEST_MIN_PER_USER_REQUIRED = '11640',
    INVEST_INVESTMENT_CAP_EXCEEDED = '11641',
    INVEST_FRACTION_NON_FUNDED = '11642',
    INVEST_FUNDING_ENDED = '11643',
    REVENUE_SHARE_ORG_OWNER_PERMISSION = '11644',
    REVENUE_SHARE_PROJECT_STILL_FUNDING = '11645',
    REVENUE_SHARE_ZERO = '11646',
    REVENUE_SHARE_PROJECT_BALANCE_LOW = '11647',
    REVENUE_SHARE_ALREADY_STARTED = '11648',
    REVENUE_SHARE_ACTIVE_WALLET_PERMISSION = '11649',
    REVENUE_SHARE_AMOUNT_GT_ZERO_REQUIRED = '11650',
    REVENUE_SHARE_BALANCE_LOW = '11651',
    TRANSFER_SHARES_PROJECT_STILL_FUNDING = '11652',
    TRANSFER_SHARES_REVENUE_SHARE_IN_PROCESS = '11653',
    TRANSFER_SHARES_INSUFFICIENT_FUNDS = '11654',
    TRANSFER_SHARES_NEED_APPROVAL = '11655',
    TRANSFER_SHARES_SENDER_NOT_MEMBER = '11656',
    TRANSFER_SHARES_RECEIVER_NOT_MEMBER = '11657',
    SELL_OFFER_PROJECT_NOT_FUNDED = '11658',
    SELL_OFFER_SHARE_AMOUNT_TOO_LOW = '11659',
    SELL_OFFER_SETTLED = '11660',
    SELL_OFFER_INSUFFICIENT_FUNDS = '11661',
    COUNTER_OFFER_SELLER_ACCEPT_PERMISSION = '11662',
    COUNTER_OFFER_NOT_FOUND = '11663',
    COUNTER_OFFER_SELLER_CANCEL_PERMISSION = '11664',

    COOPERATIVE_MISSING = '1170',
    CONTRACT_DEPLOYMENT_FAILED = '1190',
    UNKNOWN_ERROR = '1199'
}
