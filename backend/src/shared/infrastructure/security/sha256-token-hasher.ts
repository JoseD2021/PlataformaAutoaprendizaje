import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import { TokenHasher } from '../../application/ports/token-hasher.port';

@Injectable()
export class Sha256TokenHasher extends TokenHasher {
  hash(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }

  matches(token: string, tokenHash: string): boolean {
    const expected = Buffer.from(this.hash(token), 'hex');
    const received = /^[a-f0-9]{64}$/i.test(tokenHash) ? Buffer.from(tokenHash, 'hex') : null;

    return received !== null && received.length === expected.length && timingSafeEqual(received, expected);
  }
}
