import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdatePrivacyTermsSectionDto {
  @ApiProperty({ maxLength: 160 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(1000, { each: true })
  paragraphs: string[];
}

export class UpdatePrivacyTermsDto {
  @ApiProperty({ example: '1.1', maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  version: string;

  @ApiProperty({ example: '2026-11-26', description: 'Formato YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  effectiveDate: string;

  @ApiProperty({ maxLength: 160 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  @ApiProperty({ type: [UpdatePrivacyTermsSectionDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => UpdatePrivacyTermsSectionDto)
  sections: UpdatePrivacyTermsSectionDto[];
}
