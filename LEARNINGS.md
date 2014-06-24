SSDP
---

### XBMC and discovery:

SSDP supports clients asking at any time if there are any services on the network (SSDP Discovery Requests). All services that match the service type given should reply to the client. This is useful when the client is first run and wants to quickly show a UI of available services.

Secondly, servers can notify everyone that they're available (SSDP Presence Announcements). Servers send `keepalive` messages periodically or `byebye` messages to let clients know what's going on.

[XBMC](http://xbmc.org/) seems to send presence announcements on start-up and shutdown only and doesn't respond to discovery requests at all.

### 1 port for announcements

All announcements must be sent to a single port (1900). This means that only 1 process on a device can listen for these announcements. This means that multiple services on a single device must all share that port. This implies that some sort of system service would manage SSDP on behalf of services.