import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";

export class AuthCredentialsDto {
  @ApiProperty({ description: '플랫폼 구분', enum: ['apple', 'kakao', 'naver']})
  @IsNotEmpty()
  @IsIn(['apple', 'kakao', 'naver'])
  platform_type: string;

  @ApiProperty({ description: '플랫폼 사용자 구분자' })
  @IsNotEmpty()
  platform_key: string;

  @ApiProperty({ description: '푸시 메시지 토큰' })
  @IsNotEmpty()
  message_token: string;
}
