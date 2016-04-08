# Websocket Benchmark

How many text frames a second can we send? What's the latency for a text frame?

#### Report
Text frame size doesn't seem to affect performance, at least with payloads in the order of less than 100 KB. Marked performance dip is seen when interval length dips below 5 ms. Not surprisingly, latency is minimal (in the order 1 ms.) for intra-machine communications, with it increasing to an average of 6.2 ms over WiFi, which is expected.

In conclusion, reasonable performance can be expected for payloads of 100 KB or less at a transmission frequency of 100 times per second (i.e. intervals of 10 ms.)

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
  - Latency test: 20/20 echo responses were received with an average echo time of 1.8 ms or an average latency time of 0.9 ms.
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
  - Latency test: 20/20 echo responses were received with an average echo time of 12.4 ms or an average latency time of 6.2 ms.
