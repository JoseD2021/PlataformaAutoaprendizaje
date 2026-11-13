import { Injectable } from '@nestjs/common';
import {
  CURRENT_PRIVACY_TERMS,
  type PrivacyTermsDocument,
} from '../../domain/privacy-terms';

@Injectable()
export class GetPrivacyTermsUseCase {
  execute(): PrivacyTermsDocument {
    return CURRENT_PRIVACY_TERMS;
  }
}
