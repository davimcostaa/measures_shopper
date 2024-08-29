import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
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

    const transformedResult = {
      measure_uuid: result.measureUuid,
      measure_value: result.measureValue,
      image_url: result.imageUrl
    };

    return response.status(201).json(transformedResult);
  }
}
