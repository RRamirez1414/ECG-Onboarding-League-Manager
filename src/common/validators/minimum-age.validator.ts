import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LEAGUE_MANAGER_LIMITS } from '../constants/league-manager-limits';
import { isAtLeastAge } from '../utils/age.util';

@ValidatorConstraint({ name: 'MinimumAge', async: false })
export class MinimumAgeConstraint implements ValidatorConstraintInterface {
  validate(dob: string): boolean {
    if (!dob) {
      return true;
    }
    return isAtLeastAge(dob, LEAGUE_MANAGER_LIMITS.MIN_AGE);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must indicate an age of at least ${LEAGUE_MANAGER_LIMITS.MIN_AGE}`;
  }
}

export function MinimumAge(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: MinimumAgeConstraint,
    });
  };
}
