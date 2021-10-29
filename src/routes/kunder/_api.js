import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function api(request, resource, data) {
  let body = {}
  let status = 500
  switch (request.method.toUpperCase()) {
    case 'DELETE':
      await prisma.kunde.delete({
        where: {
          uid: resource.split('/').pop(),
        },
      })
      status = 200
      break
    case 'GET':
      body = await prisma.kunde.findMany()
      status = 200
      break
    case 'PATCH':
      body = await prisma.kunde.update({
        data: {
          name: data.name,
          orgnr: data.orgnr,
          address: data.address,
          fakturaer: data.fakturaer,
        },
        where: {
          uid: resource.split('/').pop(),
        },
      })
      status = 200
      break
    case 'POST':
      body = await prisma.kunde.create({
        data: {
          created_at: new Date(),
          name: data.name,
          orgnr: data.orgnr,
          address: data.address,
          fakturaer: data.fakturaer,
        },
      })
      status = 201
      break
  }

  // if the request came from a <form> submission, the browser's default
  // behaviour is to show the URL corresponding to the form's "action"
  // attribute. in those cases, we want to redirect them back to the
  // /kundes page, rather than showing the response
  if (
    request.method !== 'GET' &&
    request.headers.accept !== 'application/json'
  ) {
    return {
      status: 303,
      headers: {
        location: '/kunder',
      },
    }
  }

  return {
    status,
    body,
  }
}
