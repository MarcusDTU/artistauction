// File: backend/__tests__/model/BidModelTest.mjs
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();

vi.mock('../../dbConfig.js', () => ({
  supabase: { from: mockFrom },
}));

let bidModel;
beforeEach(async () => {
  mockFrom.mockReset();
  // import after mock is set up so the model gets the mocked supabase
  bidModel = await import('../../model/bidModel.js');
});

describe('bidModel', () => {
  it('getAllBids calls supabase.from and returns data', async () => {
    const fakeBids = [{ bid_id: 1, bid_amount: 50 }];
    const select = vi.fn().mockResolvedValue({ data: fakeBids, error: null });
    mockFrom.mockReturnValueOnce({ select });

    const result = await bidModel.getAllBids();

    expect(mockFrom).toHaveBeenCalledWith('Bid');
    expect(select).toHaveBeenCalledWith('*');
    expect(result).toEqual({ data: fakeBids, error: null });
  });

  it('getBidPrice calls chain and returns single bid amount', async () => {
    const fakeData = { bid_amount: 200 };
    const single = vi.fn().mockResolvedValue({ data: fakeData, error: null });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    mockFrom.mockReturnValueOnce({ select });

    const result = await bidModel.getBidPrice(42);

    expect(mockFrom).toHaveBeenCalledWith('Bid');
    expect(select).toHaveBeenCalledWith('bid_amount');
    expect(eq).toHaveBeenCalledWith('bid_id', 42);
    expect(result).toEqual({ data: fakeData, error: null });
  });
});