const { dynamodb } = require('../../../config/dynamodb');
const { getList } = require('./get-star-wars.service');

jest.mock('../../../config/dynamodb', () => ({
  dynamodb: {
    scan: jest.fn()
  },
  TABLE_NAME: 'StarWarsTable'
}));

describe('getList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of items successfully', async () => {
    const mockItems = [
      { id: '1', nombre: 'Luke Skywalker' },
      { id: '2', nombre: 'Darth Vader' }
    ];

    dynamodb.scan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockItems })
    });

    const result = await getList();

    expect(dynamodb.scan).toHaveBeenCalledWith({
      TableName: 'StarWarsTable'
    });

    expect(result).toEqual(mockItems);
  });

  it('should return empty array when no items exist', async () => {
    dynamodb.scan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [] })
    });

    const result = await getList();

    expect(dynamodb.scan).toHaveBeenCalledWith({
      TableName: 'StarWarsTable'
    });
    expect(result).toEqual([]);
  });

  it('should handle DynamoDB errors properly', async () => {
    const mockError = new Error('DynamoDB error');
    mockError.code = 'InternalServerError';

    dynamodb.scan.mockReturnValue({
      promise: jest.fn().mockRejectedValue(mockError)
    });

    try {
      await getList();
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error.httpStatus).toBe(500);
      expect(error.errorType).toBe('InternalServerError');
      expect(error.message).toBe('DynamoDB error');
    }
  });

  it('should handle DynamoDB errors with async/await syntax', async () => {
    const mockError = new Error('DynamoDB error');
    mockError.code = 'InternalServerError';

    dynamodb.scan.mockReturnValue({
      promise: jest.fn().mockRejectedValue(mockError)
    });

    await expect(getList()).rejects.toMatchObject({
      httpStatus: 500,
      errorType: 'InternalServerError',
      message: 'DynamoDB error'
    });
  });
});