import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'HasContact', async: false })
export class HasContactConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const obj = args.object as { phone?: string; email?: string };
    const phone = obj.phone?.trim();
    const email = obj.email?.trim();
    return Boolean(phone || email);
  }

  defaultMessage(): string {
    return 'At least one form of contact is required (phone or email)';
  }
}

export function HasContact(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: HasContactConstraint,
    });
  };
}
