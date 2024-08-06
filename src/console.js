
const readline = require('readline');

const status = require("./status");

function getStatus() {
    return {
        timestamp: (new Date()).toISOString(),
        ...status.stats,
        ...status.cfg,
    };
};

let refresh = null;
function logInterval(msecs) {
    if (!isNaN(msecs)) {
        msecs = Number(msecs);
        if (! msecs) {
            clearInterval(refresh);
            refresh = null;
        } else {
            refresh = setInterval(
                ()=>console.error(JSON.stringify(getStatus()))
                , msecs
            );
        };
    };
    return refresh?._repeat || "0 (Disabled)";
};


function inputDelay(n) {
    if (! isNaN(n)) status.cfg.inputDelay = Number(n);
};

function outputDelay(n) {
    if (! isNaN(n)) status.cfg.outputDelay = Number(n);
};

// Readline commandline interface:
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



function quit() {
    rl.close();
    [...status.allConnections].map(c=>{
        c.clientSocket.destroy();
        c.remoteSocket.destroy();
    });
    process.exit(0);
};



function help() {
    const {remoteHost, remotePort, listenPort} = status;
    console.log("");
    console.log("STATUS:");
    console.table({
        remoteHost,
        remotePort,
        listenPort,
        ...getStatus(),
        logInterval: logInterval(),
    });
    console.log("");
    console.log('AVAILABLE COMMANDS:');
    console.log('  inputDelay    - Sets input delay to specified value');
    console.log('  outputDelay   - Sets output delay to specified value');
    console.log('  delay         - Sets overall balanced delay to specified value');
    console.log('  logInterval   - Show/Set status (stderr) logging interval in msecs');
    console.log('  quit          - Quit the program');
    console.log("");
};



rl.on('line', (input) => {
  const args = input.trim().split(' ');
  const command = args.shift();

  switch (command) {
    case "inputDelay":
      inputDelay(...args);
      break;
    case "outputDelay":
      outputDelay(...args);
      break;
    case "delay":
      const d = args[0] / 2;
      inputDelay(d);
      outputDelay(d);
      break;
    case "logInterval":
      console.log(
          `Log Interval set to ${logInterval(...args)}.`
      );
      break;
    case 'quit':
      quit();
      break;
    case '':
      break; // Do nothing
    default:
      console.log(`Unknown command: ${command}`);
  }
  help();
  rl.prompt();
});

module.exports = {
    welcome() {
        help();
        rl.prompt();
    },
};
