import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  message_token: string;
}
