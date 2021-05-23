import { Controller, Get, Query } from '@nestjs/common';
import { VisitorsService } from './visitors.service';

@Controller('api/visitors')
export class VisitorsController {
  constructor(private visitorsService: VisitorsService) {}
  @Get()
  /*  *  Function that is called to fetch the api response
   *  @date - Query param passed to the function denoting a date in milliseconds.
   *  @ignoredMuseum - Query param passed to the function denoting a museum to ignore
   */
  async getMuseumVisitors(
    @Query('date') date,
    @Query('ignore') ignoredMuseum,
  ): Promise<any> {
    const result = await this.visitorsService.getMuseumVisitors(
      date,
      ignoredMuseum,
    );
    return result;
  }
}
