// scripts/seed-utils.ts
import { faker } from '@faker-js/faker';

// Ghanaian-specific data
const GHANAIAN_REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 
  'Volta', 'Northern', 'Upper East', 'Upper West', 'Brong Ahafo'
];

const GHANAIAN_TOWNS = [
  'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 
  'Sunyani', 'Ho', 'Bolgatanga', 'Wa', 'Tema'
];

const GHANAIAN_TRIBES = [
  'Akan', 'Ewe', 'Ga-Adangbe', 'Dagomba', 'Asante', 
  'Fante', 'Gonja', 'Dagaaba', 'Kusasi', 'Mole-Dagbon'
];

const LANGUAGES = [
  'Twi', 'Ga', 'Ewe', 'Dagbani', 'Fante', 
  'Hausa', 'English', 'French'
];

export function generateGhanaianStudent() {
  const gender = faker.person.sex().toUpperCase() as 'MALE' | 'FEMALE';
  const firstName = faker.person.firstName(gender.toLowerCase() as 'male' | 'female');
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    gender,
    DOB: faker.date.past({ years: 10 }).toISOString(),
    address: faker.location.streetAddress(),
    town: faker.helpers.arrayElement(GHANAIAN_TOWNS),
    phoneNumber: `+233${faker.string.numeric(9)}`,
    tribe: faker.helpers.arrayElement(GHANAIAN_TRIBES),
    prevalentDisability: faker.helpers.maybe(() => faker.lorem.word(), { probability: 1 }),
    medicalInfo: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 1 }),
    healthStatus: faker.helpers.arrayElement(['GOOD', 'FAIR', 'POOR']),
    languagesSpoken: faker.helpers.arrayElements(LANGUAGES, { min: 1, max: 3 }),
    maritalStatus: 'SINGLE',
    mothersName: faker.person.fullName({ sex: 'female' }),
    mothersEmail: faker.internet.email(),
    mothersPhone: `+233${faker.string.numeric(9)}`,
    mothersOccupation: faker.person.jobTitle(),
    mothersMaritalStatus: faker.helpers.arrayElement(['MARRIED', 'SINGLE', 'DIVORCED']),
    fathersName: faker.person.fullName({ sex: 'male' }),
    fathersEmail: faker.internet.email(),
    fathersPhone: `+233${faker.string.numeric(9)}`,
    fathersOccupation: faker.person.jobTitle(),
    fathersMaritalStatus: faker.helpers.arrayElement(['MARRIED', 'SINGLE', 'DIVORCED']),
    guardiansName: faker.person.fullName(),
    guardiansEmail: faker.internet.email(),
    guardiansPhone: `+233${faker.string.numeric(9)}`,
    guardiansOccupation: faker.person.jobTitle(),
    guardiansMaritalStatus: faker.helpers.arrayElement(['MARRIED', 'SINGLE', 'DIVORCED'])
  };
}

export function generateGhanaianStaff() {
  const gender = faker.person.sex() as 'MALE' | 'FEMALE';
  const firstName = faker.person.firstName(gender.toLowerCase() as 'male' | 'female');
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    gender,
    DOB: faker.date.past({ years: 23 }).toISOString(),
    email: faker.internet.email({ firstName, lastName }),
    phoneNumber: `+233${faker.string.numeric(9)}`,
    address: faker.location.streetAddress(),
    town: faker.helpers.arrayElement(GHANAIAN_TOWNS),
    tribe: faker.helpers.arrayElement(GHANAIAN_TRIBES),
    qualifications: faker.helpers.arrayElements([
      'Bachelor of Education', 
      'Master of Science', 
      'PhD', 
      'Diploma in Teaching', 
      'Bachelor of Arts'
    ], { min: 1, max: 2 }),
    specialization: faker.person.jobTitle(),
    employmentDate: faker.date.past({ years: 10 }).toISOString(),
    maritalStatus: faker.helpers.arrayElement(['MARRIED', 'SINGLE', 'DIVORCED']),
    languagesSpoken: faker.helpers.arrayElements(LANGUAGES, { min: 1, max: 3 }),
    healthStatus: faker.helpers.arrayElement(['GOOD', 'FAIR', 'POOR']),
    medicalInfo: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
  };
}
