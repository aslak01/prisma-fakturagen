import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function api(request, resource, data) {
  let body = {}
  let status = 500
  switch (request.method.toUpperCase()) {
    case 'DELETE':
      await prisma.faktura.delete({
        where: {
          id: resource.split('/').pop(),
        },
      })
      status = 200
      break
    case 'GET':
      body = await prisma.faktura.findMany()
      status = 200
      break
    case 'PATCH':
      console.log(body)
      body = await prisma.faktura.update({
        data: {
          created_at: new Date(),
          lines: data.lines,
          kunde: { connect: { uid: data.kunde } },
          kundeId: data.kunde,
          forfall: new Date(data.forfall),
        },
        where: {
          id: resource.split('/').pop(),
        },
      })
      status = 200
      break
    case 'POST':
      body = await prisma.faktura.create({
        data: {
          created_at: new Date(),
          lines: data.lines,
          kunde: { connect: { uid: data.kunde } },
          kundeId: data.kunde,
          forfall: data.forfall,
        },
        include: {
          kunde: true,
        },
      })
      status = 201
      break
  }

  // if the request came from a <form> submission, the browser's default
  // behaviour is to show the URL corresponding to the form's "action"
  // attribute. in those cases, we want to redirect them back to the
  // /fakturas page, rather than showing the response
  if (
    request.method !== 'GET' &&
    request.headers.accept !== 'application/json'
  ) {
    return {
      status: 303,
      headers: {
        location: '/faktura',
      },
    }
  }

  return {
    status,
    body,
  }
}
