import { School } from "./school";
import { TandemSchoolPaymentState } from "./tandem-school-payment-state";
import { User } from "./user";

export class TandemSchoolDataDto {
  paymentState?: TandemSchoolPaymentState | undefined;
  paymentAmount?: number | undefined;
  paymentComment?: string | undefined;
  instructor?: User | undefined;
  tandemSchool?: School | undefined;
}
