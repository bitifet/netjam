#!/usr/bin/env node
"use strict";

const net = require('net');

const status = require("./src/status");
const handleClient = require("./src/clientHandler");
const {welcome} = require("./src/console");




// Crear el servidor TCP
const server = net.createServer(handleClient);

server.listen(status.listenPort, () => {
  console.log(`Server listening on port ${status.listenPort}`);
  welcome();
});

