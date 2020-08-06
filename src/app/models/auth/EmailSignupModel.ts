export enum UserRoles {
  ADMIN,
  USER
}


export interface EmailSignupModel {
  email: string,
  firstName: string,
  lastName: string,
  country: string,
  phoneNumber: string
}
