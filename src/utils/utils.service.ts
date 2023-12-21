import { Injectable } from '@nestjs/common';

export interface IUtilsService {
  stripNullValues(value: unknown): unknown;
}

@Injectable()
export class UtilsService implements IUtilsService {
  public stripNullValues(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(this.stripNullValues.bind(this));
    }

    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, this.stripNullValues(value)]));
    }

    if (value !== null) {
      return value;
    }
  }
}
