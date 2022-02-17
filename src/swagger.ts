import fs from 'fs'
import { load } from 'js-yaml'
import { JsonObject } from 'swagger-ui-express'

export const documentation = load(
  fs.readFileSync('./docs/docs.yaml', 'utf-8'),
) as JsonObject

documentation.host =
  process.env.NODE_ENV === 'production' ? '' : `localhost:${process.env.PORT}`

documentation.schemes =
  process.env.NODE_ENV === 'production' ? ['https'] : ['http']
