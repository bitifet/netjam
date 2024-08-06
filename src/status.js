"use strict";

const DEFAULT_PORT = 5000;
const path = require("path");

// CommandLine handling:
const [
    , cmdLine
    , remoteHost
    , remotePort
    , listenPort = DEFAULT_PORT
] = process.argv;
if (
    ! remoteHost?.length
    || ! remotePort || isNaN(remotePort)
    || ! listenPort || isNaN(listenPort)
) (console.error(`
${path.basename(cmdLine)} - Network (TCP) traffic jam simulator.

SYNTAX: npx ${path.basename(cmdLine)} <remoteHost> <remotePort> [listenPort]
Where:
    <remoteHost>  Network name or IP of remote host.
    <remotePort>  Destination port number
    [ListenPort]  Sourece port number to forward (default = ${DEFAULT_PORT}
`), process.exit(1));


module.exports = {
    remotePort,
    remoteHost,
    listenPort,
    cfg: {
        iputDelay: 0,
        outputDelay: 0,
    },
    stats: {
      waiting: 0,      // Client connections awaiting for server.
      open: 0,         // Currently opened connections.
      closed: 0,       // Currently closed connections.
      withError: 0,    // Closed with errors.
      tx: 0,           // Transmitted packages
      rx: 0,
    },
    allConnections: new Map(),
};
