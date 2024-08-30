export interface CreateMeasureDTO {
  measure_datetime: string;
  measure_type: string;
  image: string;
  customer_code: string;
}

export interface EditOrConfirmMeasureDTO {
  measure_uuid: string;
  confirmed_value: number;
}

export interface CreatedMeasureDTO {
  measure_uuid: string;
  measure_value: number;
  image_url: string;
}

export interface MeasureDTO {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  measure_value: number;
  has_confirmed: boolean;
  image_url: string;
}

export interface CustomerMeasuresDTO {
  customer_code: string;
  measures: MeasureDTO[];
}
