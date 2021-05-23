import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';

const mockUserRepository = () => ({
  get: jest.fn(),
});
describe('VisitorsController', () => {
  let controller: VisitorsController;
  let service: VisitorsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitorsController],
      providers: [VisitorsService,
        { provide: HttpService, useFactory: mockUserRepository },],
    }).compile();

    controller = await module.get<VisitorsController>(VisitorsController);
    service = await module.get<VisitorsService>(VisitorsService);
    httpService = await module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test getMuseumVisitors method',() => {
    it('success response',async ()=>{
        const date = 1443637800000;
        const ignoredMuseum = 'avila_adobe';
        const result = {
          attendance: {
              month: 'Oct',
              year: 2015,
              highest: {
                  museum: 'america_tropical_interpretive_center',
                  visitors: 12524
              },
              lowest: {
                  museum: 'hellman_quon',
                  visitors: 750
              },
              ignored: {
                  museum: 'avila_adobe',
                  visitors: 29764
              },
              total: 31760
          }
      }
        jest.spyOn(service, 'getMuseumVisitors').mockImplementation(() => new Promise((resolve, reject) => resolve(result)));
        expect (await controller.getMuseumVisitors(date, ignoredMuseum)).toBe(result);
    });
  })
});
