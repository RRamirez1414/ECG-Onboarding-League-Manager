import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

const defaultOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true },
};

export function createDtoValidationPipe(
  options: ValidationPipeOptions = {},
): ValidationPipe {
  return new ValidationPipe({ ...defaultOptions, ...options });
}

export const memberCreateValidationPipe = createDtoValidationPipe();
export const memberUpdateValidationPipe = createDtoValidationPipe();
export const staffCreateValidationPipe = createDtoValidationPipe();
export const staffUpdateValidationPipe = createDtoValidationPipe();
export const teamCreateValidationPipe = createDtoValidationPipe();
export const teamUpdateValidationPipe = createDtoValidationPipe();
export const matchCreateValidationPipe = createDtoValidationPipe();
export const matchUpdateValidationPipe = createDtoValidationPipe();
