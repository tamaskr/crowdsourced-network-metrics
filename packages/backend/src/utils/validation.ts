// Valid regex pattern for uuid v4
const uuidPattern = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'

// Validation constraints for a measurement object
export const measurementValidationConstraints = {
  bandwidth: {
    type: 'number',
    numericality: {
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 500000
    }
  },
  'coordinates.latitude': {
    type: 'number',
    presence: true,
    numericality: {
      greaterThanOrEqualTo: 60.15,
      lessThanOrEqualTo: 60.3,
      message: 'is outside of Helsinki area'
    }
  },
  'coordinates.longitude': {
    type: 'number',
    presence: true,
    numericality: {
      greaterThanOrEqualTo: 24.6,
      lessThanOrEqualTo: 25.2,
      message: 'is outside of Helsinki area'
    }
  },
  latency: {
    type: 'number',
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 5000
    }
  },
  queryId: {
    type: 'string',
    presence: true,
    format: {
      pattern: uuidPattern,
      message: 'is not a valid uuid'
    }
  },
  signalStrength: {
    type: 'number',
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 4
    }
  },
  timestamp: {
    type: 'number',
    presence: true,
    numericality: {
      onlyInteger: true
    }
  }
}
