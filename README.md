# Websocket Benchmark

#### Report
WebSocket message size doesn't seem to affect performance, at least for payloads in the order 100 KB or less, which is within the bounds of our simulated device orientation data. However, there is a marked performance dip when the message frequency is increased to over 200 times a second (or interval periods of less than 5 ms.) This may be indicative of the limits of TCP itself. For localhost communications, not surprisingly, latency is minimal (in the order 1 ms. or less), increasing to an average of 6.2 ms over WiFi, which is within the expected range.

For reference, pings to the router averaged 1.8 ms., naively suggesting an end-to-end delay of about 0.9 ms. Perhaps performance closer to this order can be achieved with HTTP/2 and [QUIC](https://en.wikipedia.org/wiki/QUIC), an experimental UDP protocol over browsers.

In conclusion, optimal WebSocket performance can be expected for payloads of 100 KB or less at a message frequency of 100 times per second (or intervals of 10 ms.)

#### Data
- **Localhost**
  - Empty text frames:
    - 50/50 sent at 20 ms. intervals over a duration of 1000 ms.
    - 66/66 sent at 15 ms. intervals over a duration of 998 ms.
    - 100/100 sent at 10 ms. intervals over a duration of 1009 ms.
    - 200/200 sent at 5 ms. intervals over a duration of 1003 ms.
    - 333/333 sent at 3 ms. intervals over a duration of 1335 ms.
  - Text frames with simulated device orientation data (average 83 characters per payload):
    - 50/50 sent at 20 ms. intervals over a duration of 1009 ms.
    - 66/66 sent at 15 ms. intervals over a duration of 1000 ms.
    - 100/100 sent at 10 ms. intervals over a duration of 1007 ms.
    - 200/200 sent at 5 ms. intervals over a duration of 1007 ms.
    - 333/333 sent at 3 ms. intervals over a duration of 1342 ms.
  - Latency test: 20/20 echo responses were received with an average RTT of 1.8 ms or a calculated average latency time of 0.9 ms.
- **iPhone 6 via WiFi**
  - Empty text frames:
    - 50/50 sent at 20 ms. intervals over a duration of 1058 ms.
    - 66/66 sent at 15 ms. intervals over a duration of 1081 ms.
    - 100/100 sent at 10 ms. intervals over a duration of 1143 ms.
    - 200/200 sent at 5 ms. intervals over a duration of 1159 ms.
    - 333/333 sent at 3 ms. intervals over a duration of 1558 ms.
  - Text frames with simulated device orientation data (average 83 characters per payload):
    - 50/50 sent at 20 ms. intervals over a duration of 1062 ms.
    - 66/66 sent at 15 ms. intervals over a duration of 1081 ms.
    - 100/100 sent at 10 ms. intervals over a duration of 1123 ms.
    - 200/200 sent at 5 ms. intervals over a duration of 1162 ms.
    - 333/333 sent at 3 ms. intervals over a duration of 1560 ms.
  - Latency test: 20/20 echo responses were received with an average RTT of 12.4 ms or a calculated average latency time of 6.2 ms.
