import { Test, TestingModule } from '@nestjs/testing';
import { CloudfrontService } from './cloudfront.service';

describe('CloudfrontService', () => {
  let service: CloudfrontService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudfrontService],
    }).compile();

    service = module.get<CloudfrontService>(CloudfrontService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
