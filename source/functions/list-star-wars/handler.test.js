const { main } = require('./handler');
const { getList } = require('./service/get-star-wars.service');


jest.mock('./service/get-star-wars.service');

describe('main handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return results and count when getList succeeds', async () => {
    const mockResults = [
      { id: '1', nombre: 'Luke Skywalker' },
      { id: '2', nombre: 'Darth Vader' }
    ];

    getList.mockResolvedValue(mockResults);

    const response = await main();

    expect(getList).toHaveBeenCalled();

    expect(response).toEqual({
      count: 2,
      results: mockResults
    });
  });

  it('should return empty results with count 0 when no items exist', async () => {
    getList.mockResolvedValue([]);

    const response = await main();

    expect(getList).toHaveBeenCalled();
    expect(response).toEqual({
      count: 0,
      results: []
    });
  });

  it('should handle errors from getList service', async () => {
    const mockError = {
      message: 'Service error',
      httpStatus: 500,
      errorType: 'InternalServerError'
    };

    getList.mockRejectedValue(mockError);

    await expect(main()).rejects.toEqual(JSON.stringify(mockError));
  });
});