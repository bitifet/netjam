"use strict";
const status = require("./status");
const net = require('net');
let connCount = 0;



module.exports = function handleClient(clientSocket) {
  ///console.log('Client connected:', clientSocket.remoteAddress, clientSocket.remotePort);

  const connId = connCount++;

  let closed = false;
  function flagClosed(hadError) {
      if (closed) return;
      status.stats.closed++;
      if (hadError) status.stats.withError++;
      status.allConnections.delete(connId);
      closed = true;
  };

  status.stats.waiting++;

  // Crear un socket per a connectar al servidor remot
  const remoteSocket = new net.Socket();


  status.allConnections.set(connId, {
      clientSocket,
      remoteSocket,
  });


  remoteSocket.connect(status.remotePort, status.remoteHost, (c) => {
    ///console.log('Connected to remote server');
    status.stats.open++;
    status.stats.waiting--;
  });

  // Manejar dades del client
  clientSocket.on('data', (data) => {

    ///console.log('Data from client:', data.toString());
    status.stats.tx++;

    // Implementar un retard de 1 segon abans d'enviar les dades al servidor remot
    setTimeout(() => {
      remoteSocket.write(data);
    }, status.cfg.outputDelay);
  });

  // Manejar dades del servidor remot
  remoteSocket.on('data', (data) => {

    ///console.log('Data from remote server:', data.toString());
    status.stats.rx++;

    // Implementar un retard de 1 segon abans d'enviar les dades al client
    setTimeout(() => {
      clientSocket.write(data);
    }, status.cfg.inputDelay);
  });

  // Manejar el tancament de la connexió del client
  clientSocket.on('close', (hadError) => {
    ///console.log('Client connection closed', hadError ? 'with error' : 'cleanly');
    flagClosed(hadError);
    remoteSocket.end();
  });

  // Manejar el tancament de la connexió remota
  remoteSocket.on('close', (hadError) => {
    ///console.log('Remote connection closed', hadError ? 'with error' : 'cleanly');
    flagClosed(hadError);
    clientSocket.end();
  });

  // Manejar errors de connexió del client
  clientSocket.on('error', (err) => {
    ///console.error('Client socket error:', err);
    flagClosed(true);
    remoteSocket.destroy();
  });

  // Manejar errors de connexió remota
  remoteSocket.on('error', (err) => {
    ///console.error('Remote socket error:', err);
    flagClosed(true);
    clientSocket.destroy();
  });
};
