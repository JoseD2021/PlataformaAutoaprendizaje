import { ApiProperty } from '@nestjs/swagger';
import type { ListUsersResult } from '../../application/use-cases/list-users.use-case';
import { UserResponseDto } from './user-response.dto';

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  items: UserResponseDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  static from(result: ListUsersResult): PaginatedUsersResponseDto {
    const dto = new PaginatedUsersResponseDto();
    dto.items = result.items.map((item) => UserResponseDto.from(item));
    dto.total = result.total;
    dto.page = result.page;
    dto.limit = result.limit;

    return dto;
  }
}
