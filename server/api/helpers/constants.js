// eslint-disable-next-line import/prefer-default-export
export const Constants = {
  response: {
    ok: 200,
    found: 302,
    created: 201,
    deletedOrModified: 200,
    unauthorized: 401,
    serverError: 500,
    exists: 409,
    forbidden: 403,
    notFound: 404,
  },
  jwtOptions: {
    expiresIn: '2d',
    issuer: process.env.JWT_ISSUER,
    algorithm: 'HS256',
  },
};
