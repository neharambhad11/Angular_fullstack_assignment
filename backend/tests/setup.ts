import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

if (process.env.NODE_ENV !== 'test') {
  throw new Error(
    'Tests stopped: NODE_ENV must be test. Check backend/.env.test.'
  );
}

if (process.env.MONGO_DATABASE !== 'angular_assignment_test') {
  throw new Error(
    'Tests stopped: refusing to run against a non-test MongoDB database.'
  );
}

if (process.env.SQL_DATABASE !== 'AngularAssignmentTest') {
  throw new Error(
    'Tests stopped: refusing to run against a non-test SQL database.'
  );
}