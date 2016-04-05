# Streams

Streams one or more device motion data to an external app: [pd](https://puredata.info/), [Max](https://cycling74.com/products/max/), etc.

The Node.js app serves a single static web page which, on load, establishes a WebSocket connection back to the app, sending realtime device motion data. The app in turn relays this data via TCP to an external app of the user's choice.

- HTTP port: 8000
- Relay port: 9999
