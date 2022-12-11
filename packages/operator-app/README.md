# CMNM - Operator App

> 🌐 The operator app can be used to query geopgraphic locations and view the results in detail.

## Technologies
The Operator App is a [Next.js](https://nextjs.org/) web application, which is one part of the Crowdsourced Mobile Network Metrics project.

## User interface
This web app provides a user interface that allows communication with the cloud functions in the project's [backend service](https://github.com/tamaskr/crowdsourced-network-metrics/tree/main/packages/backend) in order to make queries and visualise data from all the past queries. The raw data is visualised on charts, tables and maps as well.

![operator-app](https://user-images.githubusercontent.com/91802386/206851835-0afa137f-7c18-49f8-9047-4f32d6385524.png)

## Setup
1. Clone the [main repository](https://github.com/tamaskr/crowdsourced-network-metrics) and navigate to `/packages/operator-app` folder
2. Install dependencies
   ```bash
   npm i
   ```
3. In the same folder, create a `.env.local` file and add your [Mapbox API key](https://docs.mapbox.com/help/getting-started/access-tokens/) like below
   ``` bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
   ```
4. Start your local development server
   ``` bash
   npm run dev
   ```
5. Visit [localhost:3000](http://localhost:3000) to view your application
