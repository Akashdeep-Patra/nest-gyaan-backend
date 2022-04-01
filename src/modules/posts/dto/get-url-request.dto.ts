import { ApiProperty } from "@nestjs/swagger";

export class GetUrlRequestDto {

  @ApiProperty({ description: 'A standard MIME type describing the format of the file contents.' })
  fileContentType: string;

  @ApiProperty({ description: 'A name of the file.' })
  fileName: string;
}