import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('scraper')
export class ScraperController {
  constructor(private scraperService: ScraperService) {}

  @Get()
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async search() {
    return this.scraperService.search();
  }
}
