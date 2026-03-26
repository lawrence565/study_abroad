import type { School, SchoolCountry, SchoolProgram } from '@/types/schools';

export type ProfileMatchBand = 'Reach' | 'Match' | 'Safety';

export type ProfileMatchInput = {
  gpa?: number;
  testScore?: number;
  targetCountry?: SchoolCountry | '';
};

export type ProfileMatchResult = {
  schoolId: School['id'];
  schoolName: School['name'];
  schoolCountry: SchoolCountry;
  programCode: SchoolProgram['code'];
  programName: SchoolProgram['name'];
  programRequirements: SchoolProgram['requirements'];
  score: number;
  band: ProfileMatchBand;
  reasons: string[];
};
