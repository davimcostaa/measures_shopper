/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import MeasuresController from '../app/controllers/measures_controller.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('upload', [MeasuresController, 'store']);
router.patch('confirm', [MeasuresController, 'update']);
router.get('/:customer_code/list', [MeasuresController, 'show']);

