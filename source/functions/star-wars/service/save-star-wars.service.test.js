const { dynamodb } = require('../../../config/dynamodb');
const { saveDynamoDB } = require('./save-star-wars.service.js');

jest.mock('../../../config/dynamodb', () => ({
  dynamodb: {
    query: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [] })
    }),
    batchWrite: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    })
  },
  TABLE_NAME: 'StarWarsTable'
}));

describe('saveDynamoDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dynamodb.query.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [] })
    });
    
    dynamodb.batchWrite.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });
  });

  it('should save a new item to DynamoDB when the name does not exist', async () => {
    const mockData = { id: '123', nombre: 'Luke Skywalker' };

    await saveDynamoDB(mockData);

    expect(dynamodb.query).toHaveBeenCalledWith({
      TableName: 'StarWarsTable',
      KeyConditionExpression: 'nombre = :nombre',
      ExpressionAttributeValues: {
        ':nombre': 'Luke Skywalker'
      }
    });

    expect(dynamodb.batchWrite).toHaveBeenCalledWith({
      RequestItems: {
        StarWarsTable: [
          {
            PutRequest: {
              Item: mockData
            }
          }
        ]
      }
    });
  });

  it('should throw an error when the name already exists', async () => {
    const mockData = { id: '123', nombre: 'Luke Skywalker' };
    
    dynamodb.query.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [{ nombre: 'Luke Skywalker' }] })
    });

    await expect(saveDynamoDB(mockData)).rejects.toThrow(
      'The record with name "Luke Skywalker" already exists in the database.'
    );
    expect(dynamodb.batchWrite).not.toHaveBeenCalled();
  });

  it('should generate UUID when id is not provided', async () => {
    const mockData = { nombre: 'Luke Skywalker' };

    await saveDynamoDB(mockData);

    const callArgs = dynamodb.batchWrite.mock.calls[0][0];
    expect(callArgs.RequestItems.StarWarsTable[0].PutRequest.Item.id).toBeDefined();
    expect(callArgs.RequestItems.StarWarsTable[0].PutRequest.Item.nombre).toBe('Luke Skywalker');
  });

  it('should handle DynamoDB errors properly', async () => {
    const mockData = { id: '123', nombre: 'Luke Skywalker' };
    const mockError = new Error('DynamoDB error');
    
    dynamodb.batchWrite.mockReturnValue({
      promise: jest.fn().mockRejectedValue(mockError)
    });

    await expect(saveDynamoDB(mockData)).rejects.toThrow('DynamoDB error');
  });
});