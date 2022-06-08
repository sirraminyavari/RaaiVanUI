type FormElementType =
  | 'Binary'
  | 'Checkbox'
  | 'Date'
  | 'File'
  | 'Form'
  | 'MultiLevel'
  | 'Node'
  | 'Numeric'
  | 'Select'
  | 'Separator'
  | 'Text'
  | 'User';

export interface IFormFilter {
  Type?: FormElementType;
  Exact?: boolean;
  Or?: boolean;
  Bit?: boolean;
  FloatFrom?: number;
  FloatTo?: number;
  DateFrom?: string;
  DateTo?: string;
  Compulsory?: boolean;
  TextItems?: string[];
  GuidItems?: string[];
  SubFilters?: IFormFilters;
}

export interface IFormFilters {
  [name: string]: IFormFilter;
}
