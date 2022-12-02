import { z } from 'zod'
import { MeasurementType } from '../types/types'


// Schema for validating measurements
export const measurementSchema = z.object({
  id: z.string().uuid(),
  queryId: z.string().uuid(),
  coordinates: z.object({
    latitude: z.number().nonnegative(),
    longitude: z.number().nonnegative()
  }).strict(),
  area: z.string().nullable().default(null),
  bandwidth: z.number().int().nullable().default(null),
  latency: z.number().int().nullable().default(null),
  signalStrength: z.number().int().nullable().default(null),
  timestamp: z.number().int().nonnegative()
}).strict()

// Schema for validating queries
export const querySchema = z.object({
  id: z.string().uuid(),
  measurements: z.array(z.nativeEnum(MeasurementType)).min(1).max(3),
  coordinates: z.object({
    latitude: z.number().nonnegative(),
    longitude: z.number().nonnegative()
  }).strict(),
  range: z.number().nonnegative(),
  responseCount: z.number().int().nonnegative(),
  timestamp: z.number().int().nonnegative()
}).strict()
