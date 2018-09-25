export interface OfferDetailDocModel {
  docType: OfferDetailDocType;
  title: string;
  src: URL;
}

export enum OfferDetailDocType {
  PDF, DOC, XLS, PNG, JPG, OTHER
}
