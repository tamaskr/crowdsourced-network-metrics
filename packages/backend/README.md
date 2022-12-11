# CMNM - Backend

> 🗄️ The backend coordinates storing and serving measurements.

## Technologies
The backend is built entirely on Firebase. It uses the Firestore database for storing measurement and queries, Cloud Functions to run code in a serverless environment, and Cloud Storage to serve files for network measurements.

## Setup and running
1. After setting up the repository navigate to the `/packages/backend` directory
2. Install the [firebase-tools](https://www.npmjs.com/package/firebase-tools) CLI and log in
3. Create a Firebase project, and enter its ID in the `.firebaserc` file at `projects.default`
4. Start the development server by running
   ```bash
   npm run serve
   ```
