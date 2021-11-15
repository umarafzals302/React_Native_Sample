// export interface ReOccurenceInput {
//   type: ReOccurenceType;
//   endDate?: any | null;
//   months?: Month[] | null;
//   weekIndex?: ReOccurenceWeekIndex | null;
//   day?: Day | null;
// }
export enum FormContentType {
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  MULTIVALUE = 'MULTIVALUE',
  NUMERIC = 'NUMERIC',
  FILES = 'FILES',
  SIGNATURE = 'SIGNATURE',
  FREQUENCY = 'FREQUENCY',
  MULTISELECT = 'MULTISELECT',
}

export interface FormContentText {
  parameterName: string;
  type: FormContentType.TEXT;
  value?: string;
  comply?: boolean;
  note: string;
  mandatory: boolean;
  assets: string[];
}

export interface FormContentMultiValue {
  parameterName: string;
  type: FormContentType.MULTIVALUE;
  values: [{ value: string; comply: boolean }];
  note: string;
  mandatory: boolean;
  assets: string[];
}

export interface FormContentBoolean {
  parameterName: string;
  type: FormContentType.BOOLEAN;
  values: [{ value: string; comply: boolean }];
  note: string;
  mandatory: boolean;
  assets: string[];
}

export interface FormContentNumeric {
  parameterName: string;
  type: FormContentType.NUMERIC;
  minValue: string;
  maxValue: string;
  comply: boolean;
  note: string;
  mandatory: boolean;
  assets: string[];
}

export interface FormContentFiles {
  parameterName: string;
  type: FormContentType.FILES;
  mandatory: boolean;
  assets: string[];
}

export interface FormContentSignature {
  parameterName: string;
  type: FormContentType.SIGNATURE;
  mandatory: boolean;
  assets: string[];
}

export interface FormContentFrequency {
  parameterName: string;
  type: FormContentType.FREQUENCY;
  deadline?: string;
  documentDeadline?: string;
  // reOccurence?: ReOccurenceInput; // default value can be empty
}

export interface FormContentMultiSelect {
  parameterName: string;
  type: FormContentType.MULTISELECT;
  values: [{ value: string; comply: boolean }];
  note: string;
  mandatory: boolean;
  assets: string[];
}

export type FormContent = Array<
  | FormContentText
  | FormContentMultiValue
  | FormContentBoolean
  | FormContentNumeric
  | FormContentFiles
  | FormContentSignature
  | FormContentFrequency
  | FormContentMultiSelect
>;
