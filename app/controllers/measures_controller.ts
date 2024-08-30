import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import Measure from "../models/measure.js";
import MeasureService from "../services/Measures.js";

@inject()
export default class MeasuresController {

  constructor(protected measure: MeasureService) {}

  async store({ request, response }: HttpContext) {
    const result = await this.measure.createMeasure(request.only([
      'measure_datetime', 'measure_type', 'image', 'customer_code'
    ]));

    if ('error_status' in result) {
      const { error_code, error_description } = result;
      return response.status(result.error_status).json({ error_code, error_description });
    }

    return response.status(201).json(result);
  }

  async update({ request, response }: HttpContext) {
    const result = await this.measure.updateOrConfirmMeasure(request.only([
      'measure_uuid', 'confirmed_value']));

      if ('error_status' in result) {
        const { error_code, error_description } = result;
        return response.status(result.error_status).json({ error_code, error_description });
      }

    return response.status(200).json(result);
  }

  public async show({ request, response }: HttpContext) {
    const customerCode = request.param('customer_code');
    const measureType = request.qs().measure_type;

    const result = await this.measure.getCustomerMeasures(customerCode, measureType);

    if ('error_status' in result) {
      const { error_code, error_description } = result;
      return response.status(result.error_status).json({ error_code, error_description });
    }

    return response.status(200).json(result);
  }


}
