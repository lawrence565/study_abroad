import type { School, SchoolProgram } from '@/types/schools';
import type {
  ProfileMatchInput,
  ProfileMatchBand,
  ProfileMatchResult,
} from '@/types/profile-match';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeGpa(gpa: number | undefined): number | undefined {
  if (typeof gpa !== 'number' || Number.isNaN(gpa)) {
    return undefined;
  }

  return clamp((gpa / 4) * 100, 0, 100);
}

function normalizeTestScore(testScore: number | undefined): number | undefined {
  if (typeof testScore !== 'number' || Number.isNaN(testScore)) {
    return undefined;
  }

  return clamp((testScore / 120) * 100, 0, 100);
}

function scoreRequirement(
  requirement: string,
  gpaScore: number | undefined,
  testScore: number | undefined,
): number {
  const normalizedRequirement = requirement.toLowerCase();

  if (
    normalizedRequirement.includes('transcript') ||
    normalizedRequirement.includes('a-level') ||
    normalizedRequirement.includes('mathematics') ||
    normalizedRequirement.includes('math') ||
    normalizedRequirement.includes("bachelor's degree")
  ) {
    return gpaScore ?? 50;
  }

  if (
    normalizedRequirement.includes('sat') ||
    normalizedRequirement.includes('act') ||
    normalizedRequirement.includes('admissions test') ||
    normalizedRequirement.includes('english proficiency') ||
    normalizedRequirement.includes('writing sample') ||
    normalizedRequirement.includes('references')
  ) {
    return testScore ?? 50;
  }

  return 70;
}

function scoreProgram(
  profile: ProfileMatchInput,
  school: School,
  program: SchoolProgram,
): ProfileMatchResult {
  const gpaScore = normalizeGpa(profile.gpa);
  const testScore = normalizeTestScore(profile.testScore);
  const requirementScores = program.requirements.map((requirement) =>
    scoreRequirement(requirement, gpaScore, testScore),
  );
  const requirementScore =
    requirementScores.length > 0
      ? requirementScores.reduce((sum, value) => sum + value, 0) /
        requirementScores.length
      : 70;
  const countryScore =
    profile.targetCountry === undefined || profile.targetCountry === ''
      ? 80
      : profile.targetCountry === school.country
        ? 100
        : 45;
  const selectivityScore = clamp(20 + school.ranking * 2, 20, 100);

  const parts = [
    gpaScore ?? 50,
    testScore ?? 50,
    countryScore,
    requirementScore,
    selectivityScore,
  ];
  const score = Math.round(
    parts.reduce((sum, value) => sum + value, 0) / parts.length,
  );

  const reasons = [
    profile.targetCountry
      ? profile.targetCountry === school.country
        ? 'Target country matches this school.'
        : `Target country differs from this school's country.`
      : 'No target country was provided, so country fit is treated as neutral.',
  ];

  if (typeof profile.gpa === 'number') {
    reasons.push(
      gpaScore !== undefined && gpaScore >= 75
        ? 'GPA is a strong fit for the academic requirements.'
        : 'GPA is below the stronger end of the academic range.',
    );
  } else {
    reasons.push('No GPA was provided, so academic fit is partially estimated.');
  }

  if (typeof profile.testScore === 'number') {
    reasons.push(
      testScore !== undefined && testScore >= 75
        ? 'Test score supports the program requirements.'
        : 'Test score is a modest fit for the program requirements.',
    );
  } else {
    reasons.push(
      'No test score was provided, so test-based requirements are partially estimated.',
    );
  }

  const missingAcademicRequirements = program.requirements.filter((requirement) =>
    requirement.toLowerCase().includes('degree'),
  );
  if (missingAcademicRequirements.length > 0 && typeof profile.gpa !== 'number') {
    reasons.push('This program includes degree-level requirements that are not fully measured here.');
  }

  return {
    schoolId: school.id,
    schoolName: school.name,
    schoolCountry: school.country,
    programCode: program.code,
    programName: program.name,
    programRequirements: program.requirements,
    score,
    band: score >= 65 ? 'Safety' : score >= 50 ? 'Match' : 'Reach',
    reasons,
  };
}

function pickBestProgram(
  profile: ProfileMatchInput,
  school: School,
): ProfileMatchResult {
  const rankedPrograms = school.programs.map((program) =>
    scoreProgram(profile, school, program),
  );

  return rankedPrograms.sort((left, right) => {
    if (left.score !== right.score) {
      return right.score - left.score;
    }

    return left.programName.localeCompare(right.programName);
  })[0];
}

export function scoreProfile(
  profile: ProfileMatchInput,
  schools: readonly School[],
): ProfileMatchResult[] {
  return [...schools]
    .map((school) => pickBestProgram(profile, school))
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }

      if (left.band !== right.band) {
        const bandOrder: Record<ProfileMatchBand, number> = {
          Safety: 0,
          Match: 1,
          Reach: 2,
        };

        return bandOrder[left.band] - bandOrder[right.band];
      }

      if (left.schoolName !== right.schoolName) {
        return left.schoolName.localeCompare(right.schoolName);
      }

      return left.programName.localeCompare(right.programName);
    });
}
