import { ApiProperty } from '@nestjs/swagger';
import type {
  PrivacyTermsDocument,
  PrivacyTermsSection,
} from '../../domain/privacy-terms';

export class PrivacyTermsSectionResponseDto {
  @ApiProperty({ example: 'Qué datos personales recopilamos' })
  title: string;

  @ApiProperty({ type: [String] })
  paragraphs: string[];

  static from(section: PrivacyTermsSection): PrivacyTermsSectionResponseDto {
    const dto = new PrivacyTermsSectionResponseDto();
    dto.title = section.title;
    dto.paragraphs = [...section.paragraphs];

    return dto;
  }
}

export class PrivacyTermsResponseDto {
  @ApiProperty({ example: '1.0' })
  version: string;

  @ApiProperty({ example: '2026-11-12', description: 'Fecha de vigencia en formato ISO.' })
  effectiveDate: string;

  @ApiProperty({ example: 'Aviso de privacidad de Aprende Fácil' })
  title: string;

  @ApiProperty({ type: [PrivacyTermsSectionResponseDto] })
  sections: PrivacyTermsSectionResponseDto[];

  static from(source: PrivacyTermsDocument): PrivacyTermsResponseDto {
    const dto = new PrivacyTermsResponseDto();
    dto.version = source.version;
    dto.effectiveDate = source.effectiveDate;
    dto.title = source.title;
    dto.sections = source.sections.map((section) =>
      PrivacyTermsSectionResponseDto.from(section),
    );

    return dto;
  }
}
