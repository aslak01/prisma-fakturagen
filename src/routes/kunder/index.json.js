import { api } from './_api'

// GET /todos.json
export const get = async (request) => {
  // request.locals.userid comes from src/hooks.js
  const response = await api(request, `kunder/${request.locals.userid}`)

  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return { body: [] }
  }

  return response
}

// POST /todos.json
export const post = async (request) => {
  const response = await api(request, `kunder/${request.locals.userid}`, {
    // because index.svelte posts a FormData object,
    // request.body is _also_ a (readonly) FormData
    // object, which allows us to get form data
    // with the `body.get(key)` method
    name: request.body.get('name'),
    orgnr: request.body.get('orgnr'),
    address: request.body.get('address'),
    fakturaer: request.body.get('fakturaer'),
  })

  return response
}
