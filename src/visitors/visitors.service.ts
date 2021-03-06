import {
  BadRequestException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { VisitorsResponse } from './visitors-response.model';

@Injectable()
export class VisitorsService {
  constructor(private httpService: HttpService) {}

  /*  *  Function that is called to fetch the api response
   *  @date - param passed to the function denoting a date in milliseconds.
   *  @ignoredMuseum - Optional param passed to the function denoting a museum to ignore
   */
  async getMuseumVisitors(date: string, ignoredMuseum?: string): Promise<VisitorsResponse>{
    if (date) {
      date = this.convertDateFormat(parseInt(date));
      const result = await this.fetchApiData();
      if (result) {
        const response = this.fetchRecordForDateProvided(result, date);
        return this.mapResponse(response, date, ignoredMuseum);
      } else {
        throw new NotFoundException('data not found');
      }
    } else {
      throw new BadRequestException('date not provided');
    }
  }

  //  *  Function that helps to fetch the record from external API
  async fetchApiData(): Promise<any> {
    let result = this.httpService
      .get('https://data.lacity.org/resource/trxm-jn3c.json')
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
    result = await result.toPromise();
    return result;
  }

  /*  *  Function that helps to fetch the data for particular date provided
   *  @result - param passed to the function denoting the result received from the external api
   *  @date - param passed to the function denoting a date in milliseconds.
   */
  fetchRecordForDateProvided(result: any, date: string): any {
    let response;
    result.forEach((res) => {
      if (date === this.convertDateFormat(res.month)) {
        response = res;
      }
    });
    if (!response) {
      throw new NotFoundException(
        'data not found for the date it is searching for',
      );
    }
    return response;
  }

  /*  *  Function that helps to map the result to the actual response structure
   *  @result - param passed to the function denoting the result received from the external api
   *  @date - param passed to the function denoting a date in milliseconds.
   *  @ignoredMuseum - Optional param passed to the function denoting a museum to ignore
   */
  mapResponse(result: any, date: string, ignoredMuseum?: string): VisitorsResponse {
    const response = this.calculateResponseValues(result, ignoredMuseum);
    const res: VisitorsResponse = {
      attendance: {
        month: date.split(' ')[1],
        year: parseInt(date.split(' ')[3]),
        highest: {
          museum: response.highMuseumName,
          visitors: response.highestVisitor,
        },
        lowest: {
          museum: response.lowMuseumName,
          visitors: response.lowestVisitor,
        },
        total: response.totalVisitors,
      },
    };
    if (ignoredMuseum) {
      res.attendance.ignored = {
        museum: ignoredMuseum,
        visitors: response.ignoredVisitor,
      };
    }
    return res;
  }

  /*  *  Function that helps to calculate some values w.r.t the response
   *  @result - param passed to the function denoting the result received from the external api
   *  @ignoredMuseum - Optional param passed to the function denoting a museum to ignore
   */
  calculateResponseValues(result: any, ignoredMuseum?: string): any {
    let computedValue = {
      highestVisitor: 0,
      highMuseumName: '',
      lowMuseumName: '',
      ignoredVisitor: 0,
      totalVisitors: 0,
      lowestVisitor: Number.MAX_SAFE_INTEGER,
    };
    for (let i in result) {
      if (i != 'month' && i != ignoredMuseum) {
        computedValue.totalVisitors += parseInt(result[i]);
        if (parseInt(result[i]) > computedValue.highestVisitor) {
          computedValue.highestVisitor = parseInt(result[i]);
          computedValue.highMuseumName = i;
        }
        if (parseInt(result[i]) < computedValue.lowestVisitor) {
          computedValue.lowestVisitor = parseInt(result[i]);
          computedValue.lowMuseumName = i;
        }
      } else if (ignoredMuseum && i == ignoredMuseum) {
        computedValue.ignoredVisitor = parseInt(result[i]);
      }
    }
    if (ignoredMuseum && !result[ignoredMuseum]) {
      throw new NotFoundException('ignored museum not found');
    }
    return computedValue;
  }

  /*  *  Function that helps to convert date format
   *  @input - param passed to the function denoting the date
   */
  convertDateFormat(input: number): string {
    let date = new Date(input);
    return date.toDateString();
  }
}
