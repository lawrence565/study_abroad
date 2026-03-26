export type SchoolCountry = 'US' | 'UK';

export type SchoolProgramLevel = 'undergraduate' | 'graduate';

export type SchoolProgram = {
  code: string;
  name: string;
  level: SchoolProgramLevel;
  requirements: string[];
};

export type School = {
  id: string;
  name: string;
  country: SchoolCountry;
  city: string;
  ranking: number;
  emailDomain: string;
  website: string;
  programs: SchoolProgram[];
};

export type SchoolSeedFile = {
  schools: School[];
};

