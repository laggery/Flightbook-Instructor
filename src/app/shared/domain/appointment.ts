import { School } from "./school";
import { State } from "./state";
import { User } from "./user";

export class Appointment {
    id: number | undefined;
    scheduling: Date | undefined;
    meetingPoint: string | undefined;
    maxPeople: number | undefined;
    description: string | undefined;
    state: State | undefined;
    school: School | undefined;
    instructor: User | undefined;
    takeOffCoordinator: User | undefined;
}
