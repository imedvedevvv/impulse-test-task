import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import { CryptoConstants } from './constants';

export interface ICryptoService {
  generateSaltAndHash(value: string): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}

@Injectable()
export class CryptoService implements ICryptoService {
  public async generateSaltAndHash(value: string): Promise<string> {
    const salt = await bcryptjs.genSalt(Number(CryptoConstants.saltWorkFactor));

    return bcryptjs.hash(value.toString(), salt);
  }

  public async compare(data: string, encrypted: string): Promise<boolean> {
    return bcryptjs.compare(data, encrypted);
  }
}
