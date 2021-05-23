import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { VisitorsService } from './visitors.service';

const mockUserRepository = () => ({
  get: jest.fn(),
});
describe('VisitorsService', () => {
  let service: VisitorsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [VisitorsService],
    }).compile();
    httpService = module.get<HttpService>(HttpService);
    service = module.get<VisitorsService>(VisitorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test getMuseumVisitors method', () => {
    it('success response', async () => {
      const date = 1443637800000;
      const ignoredMuseum = 'avila_adobe';
      const result = {
        attendance: {
          month: 'Oct',
          year: 2015,
          highest: {
            museum: 'america_tropical_interpretive_center',
            visitors: 12524,
          },
          lowest: {
            museum: 'hellman_quon',
            visitors: 750,
          },
          ignored: {
            museum: 'avila_adobe',
            visitors: 29764,
          },
          total: 31760,
        },
      };
      const response: AxiosResponse = {
        data: [
          {
            month: '2015-09-01T00:00:00.000',
            america_tropical_interpretive_center: '6608',
            avila_adobe: '20967',
            chinese_american_museum: '1398',
            firehouse_museum: '5746',
            hellman_quon: '125',
            pico_house: '700',
            visitor_center_avila_adobe: '3323',
          },
          {
            month: '2015-10-01T00:00:00.000',
            america_tropical_interpretive_center: '12524',
            avila_adobe: '29764',
            chinese_american_museum: '2237',
            firehouse_museum: '8882',
            hellman_quon: '750',
            pico_house: '4158',
            visitor_center_avila_adobe: '3209',
          },
        ],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));
      expect(await service.getMuseumVisitors(date, ignoredMuseum)).toEqual(
        result,
      );
    });
    it('internal server error response', async () => {
      const date = 1443637800000;
      const ignoredMuseum = 'avila_adobe';
      const response: AxiosResponse = {
        data: [
          {
            month: '2015-09-01T00:00:00.000',
            america_tropical_interpretive_center: '6608',
            avila_adobe: '20967',
            chinese_american_museum: '1398',
            firehouse_museum: '5746',
            hellman_quon: '125',
            pico_house: '700',
            visitor_center_avila_adobe: '3323',
          },
        ],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));
      expect(() =>
        service.getMuseumVisitors(date, ignoredMuseum),
      ).rejects.toThrow();
    });
    it('data not provided failed response', async () => {
      const date = '';
      const ignoredMuseum = 'avila_adobe';
      expect(() =>
        service.getMuseumVisitors(date, ignoredMuseum),
      ).rejects.toThrow();
    });
  });
});
