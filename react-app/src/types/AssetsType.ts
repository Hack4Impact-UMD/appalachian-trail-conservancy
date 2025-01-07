export interface AssetsType {
  type: AssetsDocumentType; // EMAIL || REGISTRATIONCODE
  dateUpdated: string; // YYYY-MM-DD
}

export interface EmailType extends AssetsType {
  subject: string;
  body: string; // html for the purpose of styling
}

export interface RegistrationCodeType extends AssetsType {
  code: string;
}

export type AssetsDocumentType = "EMAIL" | "REGISTRATIONCODE";
