import { FlightStatistic } from './flightStatistic'
import { Flight } from './flight'
import { User } from "./user";
import { Note } from './note';
import { ControlSheet } from './control-sheet';

export class Student {
    public id: number | undefined;
    public user: User | undefined;
    public statistic: FlightStatistic | undefined;
    public lastFlight: Flight | undefined;
    public isArchived: boolean | undefined;
    public lastNote: Note | undefined;
    public controlSheet: ControlSheet | undefined;
}
