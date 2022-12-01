import * as admin from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'


// Initialize Firebase application
admin.initializeApp({ credential: applicationDefault() })
admin.firestore().settings({ ignoreUndefinedProperties: true })

// Export Cloud Functions
export { generate } from './functions/generate'
export { measurements } from './functions/measurements'
export { query } from './functions/query'
export { report } from './functions/report'
