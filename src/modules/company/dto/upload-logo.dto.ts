import { ApiProperty } from "@nestjs/swagger";

export class UploadLogo {

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar: string
}