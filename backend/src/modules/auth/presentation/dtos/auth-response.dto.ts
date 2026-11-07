import { ApiProperty } from '@nestjs/swagger';
import type { AuthResult, AuthTokens } from '../../application/models/auth-result.model';
import { UserResponseDto } from '../../../users/presentation/dtos/user-response.dto';

export class AuthTokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: 'Bearer';

  @ApiProperty({ example: 900, description: 'Vigencia del access token en segundos.' })
  accessTokenExpiresIn: number;

  @ApiProperty({ example: 604800, description: 'Vigencia del refresh token en segundos.' })
  refreshTokenExpiresIn: number;

  static from(tokens: AuthTokens): AuthTokensDto {
    const dto = new AuthTokensDto();
    dto.accessToken = tokens.accessToken;
    dto.refreshToken = tokens.refreshToken;
    dto.tokenType = tokens.tokenType;
    dto.accessTokenExpiresIn = tokens.accessTokenExpiresIn;
    dto.refreshTokenExpiresIn = tokens.refreshTokenExpiresIn;

    return dto;
  }
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;

  static from(result: AuthResult): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.user = UserResponseDto.from(result.user);
    dto.tokens = AuthTokensDto.from(result.tokens);

    return dto;
  }
}
