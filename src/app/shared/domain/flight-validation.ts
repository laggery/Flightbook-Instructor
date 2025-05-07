import { User } from "./user";
import { School } from "./school";

export class FlightValidation {
  instructor: User | undefined;
  school: School | undefined;
  timestamp: Date | undefined;
}
