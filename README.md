Service Discovery Tool
===

This tool wraps multiple service discovery protocol libraries. It's an investigation of using these libraries.

This code's provided as-is and we don't intend to develop it further. We've published it because we think it might be useful for others.

Requirements
---
  
- [node.js](http://nodejs.org/) - tested with v0.10.24

Installation
---

1. Clone or download this repository
2. Change into the directory on the command line
3. Run `npm install` in this directory

Usage
---

Start the app by running the following on the command line:

    $ PORT=2000 npm start

A web page will be available at `http://localhost:2000` of available [SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol) and [DNS-SD](http://www.dns-sd.org/)/[mDNS](http://www.multicastdns.org/)services.

Press the `Scan` button to start a scan of services.