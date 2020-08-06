import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class WithdrawCooperativeService {

  endpoint = '/wallet/cooperative/withdraw';

  constructor(private http: HttpClient) { }

  generateBurnWithdrawTx(withdrawID: number) {
    return this.http.post(API.generateComplexRoute(this.endpoint, [
      withdrawID.toString(), 'transaction', 'burn'
    ]), {}, API.tokenHeaders());
  }

  getApprovedWithdrawals() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      'approved'
    ]), API.tokenHeaders());
  }

  getApprovedProjectWithdraws() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      'approved', 'project'
    ]), API.tokenHeaders());
  }

  getBurnedWithdrawals() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      'burned'
    ]), API.tokenHeaders());
  }

  getBurnedProjectWithdrawals() {
    return this.http.get(API.generateComplexRoute(this.endpoint, [
      'burned', 'project'
    ]), API.tokenHeaders());
  }

  uploadDocument(withdrawID: number) {
    // TODO: send document data as file
    return this.http.post(API.generateComplexRoute(this.endpoint, [
      withdrawID.toString(), 'document'
    ]), {}, API.tokenHeaders());
  }
}
