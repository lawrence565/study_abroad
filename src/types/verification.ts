export type VerificationMethod = 'school_email' | 'manual_review';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type VerificationRequestInput = {
  schoolId: string;
  method: VerificationMethod;
  schoolEmail?: string;
  evidenceSummary?: string;
};

export type VerificationRequest = {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolDomain: string;
  method: VerificationMethod;
  status: VerificationStatus;
  schoolEmail?: string;
  evidenceSummary?: string;
  submittedAt: string;
};
