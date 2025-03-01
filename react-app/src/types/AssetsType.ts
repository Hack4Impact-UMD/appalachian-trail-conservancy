export interface AssetsType {
  type: AssetsDocumentType; // EMAIL || REGISTRATIONCODE || REAUTHKEY
  dateUpdated: string; // ISO
}

export interface EmailType extends AssetsType {
  subject: string;
  body: string; // html for the purpose of styling
}

export interface RegistrationCodeType extends AssetsType {
  code: string;
}

export interface ReauthKeyType extends AssetsType {
  key: string;
}

export type AssetsDocumentType = "EMAIL" | "REGISTRATIONCODE" | "REAUTHKEY";
