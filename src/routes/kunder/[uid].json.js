import { api } from './_api'

// PATCH /kunder/:uid.json
export const patch = async (request) => {
  return api(request, `kunder/${request.locals.userid}/${request.params.uid}`, {
    name: request.body.get('name'),
    orgnr: request.body.get('orgnr'),
    address: request.body.get('address'),
    fakturaer: request.body.get('fakturaer'),
  })
}

// DELETE /kunder/:uid.json
export const del = async (request) => {
  return api(request, `kunder/${request.locals.userid}/${request.params.uid}`)
}
