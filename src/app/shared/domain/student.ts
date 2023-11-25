import { FlightStatistic } from './flightStatistic'
import { Flight } from './flight'
import { User } from "./user";

export class Student {
    public id: number | undefined;
    public user: User | undefined;
    public statistic: FlightStatistic | undefined;
    public lastFlight: Flight | undefined;
}
