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

function normalizeStandardizedScore(
  standardizedScore: number | undefined,
): number | undefined {
  if (
    typeof standardizedScore !== 'number' ||
    Number.isNaN(standardizedScore)
  ) {
    return undefined;
  }

  return clamp((standardizedScore / 120) * 100, 0, 100);
}

type RequirementModel = 'gpa' | 'standardized' | 'unmodeled';

function classifyRequirement(requirement: string): RequirementModel {
  const normalizedRequirement = requirement.toLowerCase();

  if (
    normalizedRequirement.includes('english proficiency') ||
    normalizedRequirement.includes('english language proficiency') ||
    normalizedRequirement.includes('language proficiency') ||
    normalizedRequirement.includes('ielts') ||
    normalizedRequirement.includes('toefl') ||
    normalizedRequirement.includes('duolingo') ||
    normalizedRequirement.includes('sat') ||
    normalizedRequirement.includes('act') ||
    normalizedRequirement.includes('gre') ||
    normalizedRequirement.includes('gmat')
  ) {
    return 'standardized';
  }

  if (
    normalizedRequirement.includes('transcript') ||
    normalizedRequirement.includes('a-level') ||
    normalizedRequirement.includes('mathematics') ||
    normalizedRequirement.includes('math preparation')
  ) {
    return 'gpa';
  }

  return 'unmodeled';
}

function describeRequirement(requirement: string): string {
  return requirement.toLowerCase();
}

function scoreRequirement(
  requirement: string,
  gpaScore: number | undefined,
  standardizedScore: number | undefined,
): {
  score?: number;
  reason: string;
} {
  const requirementModel = classifyRequirement(requirement);
  const requirementText = describeRequirement(requirement);

  if (requirementModel === 'gpa') {
    if (gpaScore === undefined) {
      return {
        reason: `${requirement} is modeled by GPA, but no GPA was provided.`,
      };
    }

    return {
      score: gpaScore,
      reason:
        gpaScore >= 75
          ? `GPA is a strong fit for the ${requirementText} requirement.`
          : `GPA is a modest fit for the ${requirementText} requirement.`,
    };
  }

  if (requirementModel === 'standardized') {
    if (standardizedScore === undefined) {
      return {
        reason: `${requirement} is modeled by the standardized score, but no standardized score was provided.`,
      };
    }

    return {
      score: standardizedScore,
      reason:
        standardizedScore >= 75
          ? `Standardized score is a strong fit for the ${requirementText} requirement.`
          : `Standardized score is a modest fit for the ${requirementText} requirement.`,
    };
  }

  return {
    reason: `${requirement} is not modeled in this MVP, so it is treated as context only.`,
  };
}

function scoreProgram(
  profile: ProfileMatchInput,
  school: School,
  program: SchoolProgram,
): ProfileMatchResult {
  const gpaScore = normalizeGpa(profile.gpa);
  const standardizedScore = normalizeStandardizedScore(
    profile.standardizedScore,
  );
  const requirementEvaluations = program.requirements.map((requirement) =>
    scoreRequirement(requirement, gpaScore, standardizedScore),
  );
  const modeledRequirementScores = requirementEvaluations.flatMap((evaluation) =>
    evaluation.score === undefined ? [] : [evaluation.score],
  );
  const requirementScore =
    modeledRequirementScores.length > 0
      ? modeledRequirementScores.reduce((sum, value) => sum + value, 0) /
        modeledRequirementScores.length
      : 50;
  const countryScore =
    profile.targetCountry === undefined || profile.targetCountry === ''
      ? 80
      : profile.targetCountry === school.country
        ? 100
        : 45;
  const selectivityScore = clamp(20 + school.ranking * 2, 20, 100);

  const parts = [requirementScore, countryScore, selectivityScore];
  const score = Math.round(
    parts.reduce((sum, value) => sum + value, 0) / parts.length,
  );

  const reasons = [
    profile.targetCountry
      ? profile.targetCountry === school.country
        ? 'Target country matches this school.'
        : `Target country differs from this school's country.`
      : 'No target country was provided, so country fit is treated as neutral.',
    ...requirementEvaluations.map((evaluation) => evaluation.reason),
  ];

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

function scorePrograms(
  profile: ProfileMatchInput,
  school: School,
): ProfileMatchResult[] {
  return school.programs.map((program) => scoreProgram(profile, school, program));
}

export function scoreProfile(
  profile: ProfileMatchInput,
  schools: readonly School[],
): ProfileMatchResult[] {
  return [...schools]
    .flatMap((school) => scorePrograms(profile, school))
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
