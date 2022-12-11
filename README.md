# Crowdsourced Mobile Network Metrics

> 📡 CMNM provides crowdsourced, geographically distributed network quality information.

## Concept
This project is a proof of concept aiming to help mobile network providers understand the quality of their service by measuring a number of key performance indicators on the end users' mobile devices. Volunteers can download the **metrics app** to their devices, where after a brief tutorial they can opt in to metrics collection and provide the app with the necessary permissions. Network operators can use the **operator app** running on the web to query geographic regions, following which the metrics apps there will perform their measurements and report them back. Operators can see the results of their queries in the form of charts and tables, where they can filter by time, area, as well as network provider.

## Setup
1. Clone the [main repository](https://github.com/tamaskr/crowdsourced-network-metrics)
   ```bash
   git clone https://github.com/tamaskr/crowdsourced-network-metrics.git
   ```
2. Install dependencies
   ```bash
   npm instal
   ```
3. See the [backend](/packages/backend), [metrics-app](/packages/metrics-app) and [operator-app](/packages/operator-app) packages for individual instructions

## Contributing
Pull requests are welcome. For major changes please open an issue first to discuss what you would like to change.

## License
[MIT License](https://choosealicense.com/licenses/mit/)
