import SearchController from './search.controller';
import HealthCheckController from './healthcheck.controller';
import EntryController from './entry.controller';
import AuthController from './auth.controller';
import OnboardController from './onboard.controller';
import ConsentController from './consent.controller';

const controllers: any = [
  new SearchController(),
  new HealthCheckController(),
  new EntryController(),
  new AuthController(),
  new OnboardController(),
  new ConsentController(),
]

export default controllers
