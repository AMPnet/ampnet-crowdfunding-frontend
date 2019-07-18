export interface OfferModel {
  offerID: number,
  title: string;
  description: string;
  offeredBy: string;
  status: string;
  fundingRequired: number;
  currentFunding: number;
  headerImageUrl: string;
  endDate: string;
  owner: string
  currency: string
}
