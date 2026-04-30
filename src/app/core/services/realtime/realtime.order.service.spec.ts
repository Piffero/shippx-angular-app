import { TestBed } from '@angular/core/testing';

import { RealtimeOrderService } from './realtime.order.service';

describe('RealtimeOrderService', () => {
  let service: RealtimeOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
