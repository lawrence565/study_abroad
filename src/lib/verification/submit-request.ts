import { randomUUID } from 'node:crypto';
import type { School } from '@/types/schools';
import type {
  VerificationRequest,
  VerificationRequestInput,
  VerificationRequestSummary,
} from '@/types/verification';

export type SchoolRepository = {
  findById(schoolId: string): School | undefined;
};

export type VerificationRequestRepository = {
  create(request: VerificationRequest): VerificationRequest;
};

export type SubmitVerificationRequestDependencies = {
  schoolRepository?: SchoolRepository;
  verificationRequestRepository?: VerificationRequestRepository;
  now?: () => Date;
  schools?: School[];
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

function toVerificationRequestSummary(
  request: VerificationRequest,
): VerificationRequestSummary {
  const summary: VerificationRequestSummary = {
    id: request.id,
    schoolId: request.schoolId,
    schoolName: request.schoolName,
    schoolDomain: request.schoolDomain,
    method: request.method,
    submittedAt: request.submittedAt,
  };

  if (request.schoolEmail) {
    summary.schoolEmail = request.schoolEmail;
  }

  if (request.evidenceSummary) {
    summary.evidenceSummary = request.evidenceSummary;
  }

  return summary;
}

export function submitVerificationRequest(
  input: VerificationRequestInput,
  dependencies: SubmitVerificationRequestDependencies,
): VerificationRequestSummary {
  const schoolRepository =
    dependencies.schoolRepository ??
    (dependencies.schools ? getSchoolRepository(dependencies.schools) : undefined);
  const verificationRequestRepository =
    dependencies.verificationRequestRepository ??
    getVerificationRequestRepository();

  if (!schoolRepository) {
    throw new Error('A school repository or seed schools are required.');
  }

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

    const request = verificationRequestRepository.create({
      id: randomUUID(),
      schoolId: school.id,
      schoolName: school.name,
      schoolDomain,
      method: input.method,
      status: 'pending',
      evidenceSummary,
      submittedAt,
    });

    return toVerificationRequestSummary(request);
  }

  const schoolEmail = normalizeEmail(input.schoolEmail ?? '');

  if (!schoolEmail) {
    throw new Error('School email is required for school_email verification.');
  }

  if (extractEmailDomain(schoolEmail) !== schoolDomain) {
    throw new Error('School email domain must match the selected school record.');
  }

  const request = verificationRequestRepository.create({
    id: randomUUID(),
    schoolId: school.id,
    schoolName: school.name,
    schoolDomain,
    method: input.method,
    status: 'pending',
    schoolEmail,
    submittedAt,
  });

  return toVerificationRequestSummary(request);
}
