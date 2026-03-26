import { randomUUID } from 'node:crypto';
import type { School } from '@/types/schools';
import type {
  VerificationRequest,
  VerificationRequestInput,
} from '@/types/verification';

export type SchoolRepository = {
  findById(schoolId: string): School | undefined;
};

export type VerificationRequestRepository = {
  create(request: VerificationRequest): VerificationRequest;
};

export type SubmitVerificationRequestDependencies = {
  schoolRepository: SchoolRepository;
  verificationRequestRepository: VerificationRequestRepository;
  now?: () => Date;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function extractEmailDomain(email: string): string {
  const parts = email.split('@');

  if (parts.length !== 2 || !parts[1]) {
    throw new Error('School email must include a domain.');
  }

  return parts[1];
}

function normalizeText(value: string | undefined): string {
  return value?.trim() ?? '';
}

function getSchoolRepository(schools: School[]): SchoolRepository {
  return {
    findById(schoolId) {
      return schools.find((school) => school.id === schoolId);
    },
  };
}

function getVerificationRequestRepository(): VerificationRequestRepository {
  return {
    create(request) {
      return request;
    },
  };
}

export function submitVerificationRequest(
  input: VerificationRequestInput,
  dependencies: Partial<SubmitVerificationRequestDependencies> & {
    schools: School[];
  },
): VerificationRequest {
  const schoolRepository =
    dependencies.schoolRepository ?? getSchoolRepository(dependencies.schools);
  const verificationRequestRepository =
    dependencies.verificationRequestRepository ??
    getVerificationRequestRepository();
  const school = schoolRepository.findById(input.schoolId);

  if (!school) {
    throw new Error(`Unknown school: ${input.schoolId}`);
  }

  const submittedAt = (dependencies.now ?? (() => new Date()))().toISOString();
  const schoolDomain = school.emailDomain.trim().toLowerCase();

  if (input.method === 'manual_review') {
    const evidenceSummary = normalizeText(input.evidenceSummary);

    if (!evidenceSummary) {
      throw new Error('Manual review requires an evidence summary.');
    }

    return verificationRequestRepository.create({
      id: randomUUID(),
      schoolId: school.id,
      schoolName: school.name,
      schoolDomain,
      method: input.method,
      status: 'pending',
      evidenceSummary,
      submittedAt,
    });
  }

  const schoolEmail = normalizeEmail(input.schoolEmail ?? '');

  if (!schoolEmail) {
    throw new Error('School email is required for school_email verification.');
  }

  if (extractEmailDomain(schoolEmail) !== schoolDomain) {
    throw new Error('School email domain must match the selected school record.');
  }

  return verificationRequestRepository.create({
    id: randomUUID(),
    schoolId: school.id,
    schoolName: school.name,
    schoolDomain,
    method: input.method,
    status: 'pending',
    schoolEmail,
    submittedAt,
  });
}
