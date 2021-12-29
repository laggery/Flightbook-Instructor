import { FlightStatistic } from './flightStatistic'
import { Flight } from './flight'
import { User } from "./user";

export class Student {
    public user: User | undefined;
    public statistic: FlightStatistic | undefined;
    public lastFlight: Flight | undefined;
}
