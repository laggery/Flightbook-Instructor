import { Appointment } from "./appointment";
import { User } from "./user";

export class Subscription {
    id: number | undefined;
    comment: string | undefined;
    user: User | undefined;
    appointment: Appointment | undefined;
}
