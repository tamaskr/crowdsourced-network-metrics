import { faker } from '@faker-js/faker'
import * as uuid from 'uuid';
import { IMeasurement } from '../types/measurement';

// function that generate fake measurements
export const GenerateMeasurement = (limit: number): Array<IMeasurement> => {
    if (limit < 1) return [];
    const list: Array<IMeasurement> = [];
    for (let i = 0; i < limit; i++) {
        list.push({
            id: uuid.v4(),
            queryId: uuid.v4(),
            coordinates: [
                faker.address.latitude(60.3, 60.15, 6),
                faker.address.longitude(24.6, 24.2, 6)
            ],
            signalStrength: faker.datatype.number({min: 0, max: 4}),
            latency: faker.datatype.number(faker.datatype.number({min: 1, max: 500000})),
            bandwidth: faker.datatype.number(faker.datatype.number({min: 1, max: 500000}))
        })
    }
    return list
}
