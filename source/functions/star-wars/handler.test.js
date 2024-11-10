const { main } = require('./handler');
const { exportData, changeKeyObjects } = require('../../utils/helpers');
const { saveDynamoDB } = require('./service/save-star-wars.service');

jest.mock('../../utils/helpers', () => ({
  BASE_URL_DEFAULT: 'https://api.example.com/',
  REPLACE_KEYS: {
    name: 'nombre',
  },
  exportData: jest.fn(),
  changeKeyObjects: jest.fn()
}));

jest.mock('./service/save-star-wars.service', () => ({
  saveDynamoDB: jest.fn()
}));

describe('main handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process and save data successfully', async () => {
    const mockApiResponse = {
      name: 'Luke Skywalker',
      height: '172',
    };

    const mockTransformedData = {
      nombre: 'Luke Skywalker',
      height: '172',
    };

    exportData.mockResolvedValue(mockApiResponse);
    changeKeyObjects.mockReturnValue([mockTransformedData]);
    saveDynamoDB.mockResolvedValue(undefined);

    const event = { page: '1' };
    const result = await main(event);

    expect(exportData).toHaveBeenCalledWith('https://api.example.com/1');
    expect(changeKeyObjects).toHaveBeenCalledWith([mockApiResponse], expect.any(Object));
    expect(saveDynamoDB).toHaveBeenCalledWith(mockTransformedData);
    expect(result).toEqual(mockTransformedData);
  });

  it('should handle API errors properly', async () => {
    const apiError = new Error('API Error');
    exportData.mockRejectedValue(apiError);

    const event = { page: '1' };
    
    await expect(main(event)).rejects.toEqual(JSON.stringify(apiError));
    expect(saveDynamoDB).not.toHaveBeenCalled();
  });

  it('should handle transformation errors', async () => {
    const mockApiResponse = {
      name: 'Luke Skywalker',
      height: '172'
    };

    const transformError = new Error('Transform Error');
    exportData.mockResolvedValue(mockApiResponse);
    changeKeyObjects.mockImplementation(() => {
      throw transformError;
    });

    const event = { page: '1' };
    
    await expect(main(event)).rejects.toEqual(JSON.stringify(transformError));
    expect(saveDynamoDB).not.toHaveBeenCalled();
  });

  it('should handle DynamoDB save errors', async () => {
    const mockApiResponse = {
      name: 'Luke Skywalker',
      height: '172'
    };

    const mockTransformedData = {
      nombre: 'Luke Skywalker',
      height: '172'
    };

    const dbError = new Error('Database Error');
    
    exportData.mockResolvedValue(mockApiResponse);
    changeKeyObjects.mockReturnValue([mockTransformedData]);
    saveDynamoDB.mockRejectedValue(dbError);

    const event = { page: '1' };
    
    await expect(main(event)).rejects.toEqual(JSON.stringify(dbError));
  });

  it('should handle missing page parameter', async () => {
    const event = {};
    
    const mockApiResponse = {
      name: 'Luke Skywalker',
      height: '172'
    };

    const mockTransformedData = {
      nombre: 'Luke Skywalker',
      height: '172'
    };

    exportData.mockResolvedValue(mockApiResponse);
    changeKeyObjects.mockReturnValue([mockTransformedData]);
    saveDynamoDB.mockResolvedValue(undefined);

    const result = await main(event);
    
    expect(exportData).toHaveBeenCalledWith('https://api.example.com/undefined');
    expect(result).toEqual(mockTransformedData);
  });

  it('should handle empty response from API', async () => {
    exportData.mockResolvedValue(null);
    changeKeyObjects.mockReturnValue([null]);

    const event = { page: '1' };
    
    const result = await main(event);
    
    expect(saveDynamoDB).toHaveBeenCalledWith(null);
    expect(result).toBeNull();
  });

  it('should verify the complete flow with actual data structure', async () => {
    const mockApiResponse = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair'
    };

    const mockTransformedData = {
      nombre: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair'
    };

    exportData.mockResolvedValue(mockApiResponse);
    changeKeyObjects.mockReturnValue([mockTransformedData]);
    saveDynamoDB.mockResolvedValue(undefined);

    const event = { page: '1' };
    const result = await main(event);

    expect(exportData).toHaveBeenCalledWith('https://api.example.com/1');
    expect(changeKeyObjects).toHaveBeenCalledWith(
      [mockApiResponse],
      expect.objectContaining({
        name: 'nombre'
      })
    );
    expect(saveDynamoDB).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Luke Skywalker'
      })
    );
    expect(result).toEqual(mockTransformedData);
  });
});