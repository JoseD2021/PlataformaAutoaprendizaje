import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '../../domain/enums/role.enum';

export interface UserResponseSource {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'usuario@clena.local' })
  email: string;

  @ApiProperty({ example: 'María Pérez' })
  fullName: string;

  @ApiProperty({ example: 'usuario' })
  role: Role;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  static from(source: UserResponseSource): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = source.id;
    dto.email = source.email;
    dto.fullName = source.fullName;
    dto.role = source.role;
    dto.isActive = source.isActive;
    dto.createdAt = source.createdAt;
    dto.updatedAt = source.updatedAt;

    return dto;
  }
}
