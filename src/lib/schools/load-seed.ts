import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  School,
  SchoolCountry,
  SchoolProgram,
  SchoolProgramLevel,
  SchoolSeedFile,
} from '@/types/schools';

type RawSchoolSeedFile = {
  schools: Array<{
    id: unknown;
    name: unknown;
    country: unknown;
    city: unknown;
    ranking: unknown;
    emailDomain: unknown;
    website: unknown;
    programs: Array<{
      code: unknown;
      name: unknown;
      level: unknown;
      requirements: unknown;
    }>;
  }>;
};

const seedFilePath = resolve(process.cwd(), 'data/schools.seed.json');

function parseCountry(country: unknown): SchoolCountry {
  if (country === 'US' || country === 'UK') {
    return country;
  }

  throw new Error(`Unsupported school country: ${String(country)}`);
}

function parseProgramLevel(level: unknown): SchoolProgramLevel {
  if (level === 'undergraduate' || level === 'graduate') {
    return level;
  }

  throw new Error(`Unsupported school program level: ${String(level)}`);
}

function parseRequirements(requirements: unknown): string[] {
  if (
    Array.isArray(requirements) &&
    requirements.every((requirement) => typeof requirement === 'string')
  ) {
    return requirements;
  }

  throw new Error('School program requirements must be strings.');
}

function parseProgram(program: RawSchoolSeedFile['schools'][number]['programs'][number]): SchoolProgram {
  if (
    typeof program.code !== 'string' ||
    typeof program.name !== 'string' ||
    typeof program.level !== 'string'
  ) {
    throw new Error('School program records must include code, name, and level.');
  }

  return {
    code: program.code,
    name: program.name,
    level: parseProgramLevel(program.level),
    requirements: parseRequirements(program.requirements),
  };
}

function parseSchool(school: RawSchoolSeedFile['schools'][number]): School {
  if (
    typeof school.id !== 'string' ||
    typeof school.name !== 'string' ||
    typeof school.country !== 'string' ||
    typeof school.city !== 'string' ||
    typeof school.ranking !== 'number' ||
    typeof school.emailDomain !== 'string' ||
    typeof school.website !== 'string'
  ) {
    throw new Error('School records are missing required fields.');
  }

  return {
    id: school.id,
    name: school.name,
    country: parseCountry(school.country),
    city: school.city,
    ranking: school.ranking,
    emailDomain: school.emailDomain,
    website: school.website,
    programs: school.programs.map(parseProgram),
  };
}

export function loadSchoolSeed(): SchoolSeedFile['schools'] {
  const seedFile = readFileSync(seedFilePath, 'utf8');
  const parsedSeed = JSON.parse(seedFile) as RawSchoolSeedFile;

  if (!parsedSeed || !Array.isArray(parsedSeed.schools)) {
    throw new Error('School seed file must include a schools array.');
  }

  return parsedSeed.schools.map(parseSchool);
}

