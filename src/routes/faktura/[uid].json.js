import { api } from './_api'

// PATCH /faktura/:uid.json
export const patch = async (request) => {
  return api(
    request,
    `faktura/${request.locals.userid}/${request.params.uid}`,
    {
      fakturanr: request.body.get('fakturanr'),
      lines: request.body.get('lines'),
      kunde: request.body.get('kunde'),
      forfall: request.body.get('forfall'),
    }
  )
}

// DELETE /faktura/:uid.json
export const del = async (request) => {
  return api(request, `faktura/${request.locals.userid}/${request.params.uid}`)
}
