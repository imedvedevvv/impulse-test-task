enum Service {
  Prisma = 'PrismaService',
  Users = 'UsersService',
  Crypto = 'CryptoService',
  Utils = 'UtilsService',
  Auth = 'AuthService',
}

enum ResponseMessage {
  UserNotFound = 'User not found',
  EmailAlreadyExists = 'User with the specified email already exists',
  JwtExpired = 'Jwt expired',
  OK = '200 OK',
  RefreshTokenAlreadyDeleted = 'User has already signed out',
}

export { Service, ResponseMessage };
