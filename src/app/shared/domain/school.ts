import { SchoolConfiguration } from "./school-configuration";

export class School {
    id: number | undefined;
    name: string | undefined;
    address1: string | undefined;
    address2: string | undefined;
    plz: string | undefined;
    city: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    language: string | undefined;
    configuration: SchoolConfiguration | undefined;
}
