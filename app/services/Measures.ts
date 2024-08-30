import { inject } from "@adonisjs/core";
import { randomUUID } from "crypto";
import { CreatedMeasureDTO, CreateMeasureDTO, CustomerMeasuresDTO, EditOrConfirmMeasureDTO } from "../dtos/index.js";
import Customer from "../models/customer.js";
import Measure from "../models/measure.js";
import { isBase64 } from "../validators/base64.js";
import { createMeasureValidator, patchMeasureValidator } from "../validators/measure.js";
import GeminiService from "./Gemini.js";

interface ErrorResponse {
  error_status: number;
  error_code: string;
  error_description: string;
}

type SuccessResponse = {
  success: true;
};


@inject()
export default class MeasureService {
  constructor(private gemini: GeminiService) {}

  public async createMeasure(data: CreateMeasureDTO): Promise<CreatedMeasureDTO | ErrorResponse> {
    const validationError = await this.validateMeasureData(data);
    if (validationError) return validationError;

    await this.findOrCreateCustomer(data.customer_code);

    const duplicateError = await this.checkForDuplicateMeasure(data.measure_datetime, data.measure_type, data.customer_code);
    if (duplicateError) return duplicateError;

    try {
      const { result, imgUri } = await this.gemini.getGeminiValue(data.image);
      const measureValue = parseInt(result);
      const measureUuid = randomUUID();

      await Measure.create({
        measureUuid,
        measureDatetime: data.measure_datetime,
        measureType: data.measure_type,
        imageUrl: imgUri,
        hasConfirmed: false,
        measureValue,
        customerCode: data.customer_code,
      });

      return {
        measure_uuid: measureUuid,
        measure_value: measureValue,
        image_url: imgUri,
      };
    } catch (error) {
      return this.createErrorResponse(500, 'INTERNAL_ERROR', 'Erro ao criar a medida');
    }
  }

  public async updateOrConfirmMeasure(data: EditOrConfirmMeasureDTO): Promise<SuccessResponse | ErrorResponse> {

    const validationError = await this.validateMeasurePatchData(data);
    if (validationError) return validationError;

    const measureFound = await this.checkIfMeasureExists(data.measure_uuid);
    if ('error_status' in measureFound) {
      return measureFound;
    }

    const alreadyConfirmed = await this.checkIfMeasureIsConfirmed(data.measure_uuid);
    if (alreadyConfirmed) return alreadyConfirmed;

    try {
      measureFound.hasConfirmed = true;
      measureFound.measureValue = data.confirmed_value;
      await measureFound.save()

      return { "success": true }
    } catch (error) {
      return this.createErrorResponse(500, 'INTERNAL_ERROR', 'Erro ao atualizar a medida');
    }
  }

  public async getCustomerMeasures(customerCode: string, measureType?: string) {
    if (measureType) {
      const measureTypeCase = measureType.toUpperCase();
      const validTypes = ['WATER', 'GAS'];
      if (!validTypes.includes(measureTypeCase)) {
        return this.createErrorResponse(400, "INVALID_TYPE", "Tipo de medição não permitida");
      }

      const measures = await Measure.query()
        .where('customer_code', customerCode)
        .andWhere('measure_type', measureTypeCase);

      if (measures.length === 0) {
        return this.createErrorResponse(404, "MEASURES_NOT_FOUND", "Nenhuma leitura encontrada");
      }

      return this.transformToCustomerMeasuresDTO(measures);
    } else {

      const measures = await Measure.query().where('customer_code', customerCode);
      if (measures.length === 0) {
        return this.createErrorResponse(404, "MEASURES_NOT_FOUND", "Nenhuma leitura encontrada");
      }

      return this.transformToCustomerMeasuresDTO(measures);

    }
  }

  private async validateMeasureData(data: CreateMeasureDTO): Promise<ErrorResponse | null> {
    try {
      await createMeasureValidator.validate(data);
      if (!isBase64(data.image)) {
        return this.createErrorResponse(400, 'INVALID_DATA', 'Formato de imagem inválido');
      }

      const measureDateTime = new Date(data.measure_datetime);
      if (isNaN(measureDateTime.getTime())) {
        return this.createErrorResponse(400, 'INVALID_DATA', 'Data e hora inválidas');
      }
      return null;
    } catch (error) {
      return this.createErrorResponse(400, 'INVALID_DATA', error.messages || 'Dados inválidos');
    }
  }


  private async validateMeasurePatchData(data: EditOrConfirmMeasureDTO): Promise<ErrorResponse | null> {
    try {
      await patchMeasureValidator.validate(data);
      return null;
    } catch (error) {
      return this.createErrorResponse(400, 'INVALID_DATA', error.messages || 'Dados inválidos');
    }
  }

  private async findOrCreateCustomer(customer_code: string): Promise<Customer> {
    let customer = await Customer.findBy('customer_code', customer_code);
    if (!customer) {
      customer = await Customer.create({ customerCode: customer_code });
    }
    return customer;
  }

  private async checkForDuplicateMeasure(measure_datetime: string, measure_type: string, customer_code: string): Promise<ErrorResponse | null> {
    const doubledMeasure = await Measure.findManyBy({ customerCode: customer_code, measureType: measure_type })

    const monthFromRequest = new Date(measure_datetime).getMonth()
    const yearFromRequest = new Date(measure_datetime).getFullYear()

    for (const measure of doubledMeasure) {
      const monthSavedInDb = new Date(measure.measureDatetime).getMonth()
      const yearSavedInDb = new Date(measure.measureDatetime).getFullYear()

      if (monthSavedInDb === monthFromRequest && yearFromRequest === yearSavedInDb) {
        return { error_status: 409, error_code: 'DUPLICATE_MEASURE', error_description: 'Leitura do mês já realizada' }
      }}

    return null
  }

  private async checkIfMeasureExists(measure_uuid: string):Promise<ErrorResponse | Measure>  {
    try{
      const measure = await Measure.findOrFail(measure_uuid);
      return measure;
    } catch(error){
      return { error_status: 404, error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura do mês já realizada' }
    }
    ;
  }

  private async transformToCustomerMeasuresDTO(data: Measure[]):Promise<CustomerMeasuresDTO> {

  const customer_code = data[0].customerCode;

  return {
    customer_code,
    measures: data.map(item => ({
      measure_uuid: item.measureUuid,
      measure_datetime: item.measureDatetime,
      measure_type: item.measureType,
      measure_value: item.measureValue,
      has_confirmed: item.hasConfirmed,
      image_url: item.imageUrl
    }))
  };
  }

  private async checkIfMeasureIsConfirmed(measure_uuid: string):Promise<ErrorResponse | null>  {
      const measure = await Measure.find(measure_uuid);
      if(measure?.hasConfirmed === true) {
        return { error_status: 409, error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura do mês já realizada' }
      }
      return null
  }

  private createErrorResponse(status: number, code: string, description: string): ErrorResponse {
    return { error_status: status, error_code: code, error_description: description };
  }
}
