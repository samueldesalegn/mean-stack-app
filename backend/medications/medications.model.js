import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const MEDICATIONS_TABLE = 'Medications';

export const createMedication = async (medication) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        Item: medication,
    };
    await dynamoDb.put(params).promise();
    return medication;
};

export const getMedicationsByFirstLetter = async (firstLetter) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        FilterExpression: 'first_letter = :letter',
        ExpressionAttributeValues: { ':letter': firstLetter.toUpperCase() }
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items;
};

export const getMedicationById = async (medicationId) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        Key: { medicationId },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
};

export const updateMedicationById = async (medicationId, updateData) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        Key: { medicationId },
        UpdateExpression: 'set #name = :name, generic_name = :generic_name, medication_class = :medication_class, availability = :availability, first_letter = :first_letter',
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': updateData.name,
            ':generic_name': updateData.generic_name,
            ':medication_class': updateData.medication_class,
            ':availability': updateData.availability,
            ':first_letter': updateData.first_letter.toUpperCase(),
        },
        ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
};

export const deleteMedicationById = async (medicationId) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        Key: { medicationId },
    };
    await dynamoDb.delete(params).promise();
};

export const addReview = async (medicationId, review) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        Key: { medicationId },
        UpdateExpression: 'SET reviews = list_append(reviews, :review)',
        ExpressionAttributeValues: {
            ':review': [review],
        },
        ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
};

export const getReviews = async (medicationId) => {
    const params = {
        TableName: MEDICATIONS_TABLE,
        Key: { medicationId },
        ProjectionExpression: 'reviews',
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item.reviews;
};
