/** Demo record of the sample list and table pages. */
export interface SampleRecord {
  id: number;
  name: string;
  department: string;
  status: "active" | "archived";
  /** ISO date. */
  updated: string;
}

export type RecordStatus = SampleRecord["status"];
