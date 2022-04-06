export class TrainingHill {
  public id: number | undefined;
  public auslegen: boolean | undefined;
  public aufziehen: boolean | undefined;
  public slalom: boolean | undefined;
  public laufenAngebremst: boolean | undefined;
  public vorbereitung: boolean | undefined;
  public startphasen: boolean | undefined;
  public richtungsaenderungen: boolean | undefined;
  public startabbruch: boolean | undefined;
  public seitenwindstart: boolean | undefined;
  public schlechtAusgelegt: boolean | undefined;
  public starts: boolean | undefined;
  public landungen: boolean | undefined;
  public notlandung: boolean | undefined;
  public notschirm: boolean | undefined;
  public kurven: boolean | undefined;
  public entwirren: boolean | undefined;
  public faltmethoden: boolean | undefined;
  public theorietest: boolean | undefined;
  [key: string]: boolean | number | undefined;
}
