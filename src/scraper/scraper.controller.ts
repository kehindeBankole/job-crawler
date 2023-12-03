import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private scraperService: ScraperService) {}

  @Get()
  async search() {
    return this.scraperService.search();
  }
}
