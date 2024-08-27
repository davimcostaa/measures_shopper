import { randomUUID } from "crypto"
import Customer from "../models/customer.js"
import Measure from "../models/measure.js"
import { createMeasureValidator } from "../validators/measure.js"

interface CreateMeasureDTO {
  measure_datetime: string
  measure_type: string
  image: string
  customer_code: string
}

interface ErrorResponse {
  error_status: number;
  error_code: string;
  error_description: string;
}


export default class MeasureService {

  public async handleMeasureCreation(data: CreateMeasureDTO): Promise<ErrorResponse | Measure> {
    const { measure_datetime, measure_type, image, customer_code } = data

    try {
      await createMeasureValidator.validate(data);

      const regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

      if (!regex.test(data.image)) {
        throw new Error('imagem fora do formato aceito. Inclua no início data:image/{formatoDaImagem};base64,');
      }

    } catch (error) {
      return {
        error_status: 400,
        error_code: 'INVALID_DATA',
        error_description: error.messages || error.message || 'Dados inválidos'
      };
    }

    let customer = await Customer.findBy('customer_code', customer_code)
    if (!customer) {
      customer = await Customer.create({ customerCode: customer_code })
    }

    const doubledMeasure = await Measure
      .findManyBy({ customerCode: customer_code, measureType: measure_type })

    const monthFromRequest = new Date(measure_datetime).getMonth()

    for (const measure of doubledMeasure) {

      const monthSavedInDb = new Date(measure.measureDatetime).getMonth()
      if (monthSavedInDb === monthFromRequest) {
        return { error_status: 409, error_code: 'DUPLICATE_MEASURE', error_description: 'Leitura do mês já realizada' }
      }
    }



    const measure = await Measure.create({
      measureUuid: randomUUID(),
      measureDatetime: measure_datetime,
      measureType: measure_type,
      imageUrl: image,
      customerCode: customer_code,
    })

    return measure
  }
}
