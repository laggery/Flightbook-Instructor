export class Theory {
  public id: number | undefined;
  public fluglehre: boolean | undefined;
  public wetterkunde: boolean | undefined;
  public flugpraxis: boolean | undefined;
  public gesetzgebung: boolean | undefined;
  public materialkunde: boolean | undefined;
  [key: string]: boolean | number | undefined;
}
