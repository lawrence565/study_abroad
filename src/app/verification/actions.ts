'use server';

import { resolveDemoSession } from '@/lib/auth/demo-session';
import { loadSchoolSeed } from '@/lib/schools/load-seed';
import { submitVerificationRequest } from '@/lib/verification/submit-request';
import type { DemoSession } from '@/types/auth';
import type { School } from '@/types/schools';
import type {
  VerificationActionState,
  VerificationMethod,
  VerificationRequestSummary,
} from '@/types/verification';

export type VerificationActionDependencies = {
  resolveDemoSession?: () => Promise<DemoSession>;
  loadSchoolSeed?: () => School[];
  submitVerificationRequest?: typeof submitVerificationRequest;
  now?: () => Date;
};

function readFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function buildError(message: string): VerificationActionState {
  return {
    status: 'error',
    message,
  };
}

function buildSchoolRepository(schools: School[]) {
  return {
    findById(schoolId: string) {
      return schools.find((school) => school.id === schoolId);
    },
  };
}

function buildSuccessState(
  request: VerificationRequestSummary,
): VerificationActionState {
  return {
    status: 'success',
    message: 'Verification request submitted.',
    request,
  };
}

export async function submitVerificationAction(
  _previousState: VerificationActionState,
  formData: FormData,
  dependencies: VerificationActionDependencies = {},
): Promise<VerificationActionState> {
  const resolveSession =
    dependencies.resolveDemoSession ?? resolveDemoSession;
  const loadSchools = dependencies.loadSchoolSeed ?? loadSchoolSeed;
  const submitRequest =
    dependencies.submitVerificationRequest ?? submitVerificationRequest;

  const session = await resolveSession();
  void session;

  const schoolId = readFormValue(formData, 'schoolId');
  const method = readFormValue(formData, 'method') as VerificationMethod | '';

  if (!schoolId) {
    return buildError('Select a school.');
  }

  if (method !== 'school_email' && method !== 'manual_review') {
    return buildError('Select a verification method.');
  }

  if (method === 'school_email') {
    const schoolEmail = readFormValue(formData, 'schoolEmail');

    if (!schoolEmail) {
      return buildError(
        'School email is required for school_email verification.',
      );
    }

    const schools = loadSchools();
    const request = submitRequest(
      {
        schoolId,
        method,
        schoolEmail,
      },
      {
        schoolRepository: buildSchoolRepository(schools),
        verificationRequestRepository: {
          create(request) {
            return request;
          },
        },
        now: dependencies.now,
      },
    );

    return buildSuccessState(request);
  }

  const evidenceSummary = readFormValue(formData, 'evidenceSummary');

  if (!evidenceSummary) {
    return buildError('Manual review requires an evidence summary.');
  }

  const schools = loadSchools();
  const request = submitRequest(
    {
      schoolId,
      method,
      evidenceSummary,
    },
    {
      schoolRepository: buildSchoolRepository(schools),
      verificationRequestRepository: {
        create(request) {
          return request;
        },
      },
      now: dependencies.now,
    },
  );

  return buildSuccessState(request);
}
