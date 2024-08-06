
ＮｅｔＪａｍ 🕸️
===============

> Network congestion simulator for TCP connections.


Usage
-----


```sh
user@host:~$ npx netjam --help

netjam - Network (TCP) traffic jam simulator.

SYNTAX: npx netjam <remoteHost> <remotePort> [listenPort]
Where:
    <remoteHost>  Network name or IP of remote host.
    <remotePort>  Destination port number
    [ListenPort]  Sourece port number to forward (default = 5000
```


Example
-------

Create a *jamable* TCP tunnel to local PostgreSQL Server listening in its
default port (5432):

```sh
user@host:~$ npx netjam localhost 5432
Server listening on port 5000

STATUS:
┌─────────────┬────────────────────────────┐
│   (index)   │           Values           │
├─────────────┼────────────────────────────┤
│ remoteHost  │        'localhost'         │
│ remotePort  │           '5432'           │
│ listenPort  │            5000            │
│  timestamp  │ '2024-08-06T18:52:11.042Z' │
│   waiting   │             0              │
│    open     │             0              │
│   closed    │             0              │
│  withError  │             0              │
│     tx      │             0              │
│     rx      │             0              │
│  iputDelay  │             0              │
│ outputDelay │             0              │
│ logInterval │       '0 (Disabled)'       │
└─────────────┴────────────────────────────┘

AVAILABLE COMMANDS:
  inputDelay    - Sets input delay to specified value
  outputDelay   - Sets output delay to specified value
  delay         - Sets overall balanced delay to specified value
  logInterval   - Show/Set status (stderr) logging interval in msecs
  quit          - Quit the program

>
```

> 📌 Now, every time you hit the `Enter` key, you will get an updated *Status
> Report* and a list of available commands.
> 
> Additionally, if you set logInterval to a non zero value, it will start
> periodically logging status data in JSON format to *stderr*. You can use below
> command instead of the previous one to keep it apart to a file:
> 
> ```sh
> user@host:~$ npx netjam localhost 5432 2> netjam_log.json
> ```


Now you can open another terminal and connect to your local Postgres database
throug port 5000:

```sh
user@host:~$ psql -h localhost -p 5000
Contraseña para usuario user:
user@constructor:~/112/mnt (master)$ LANG=C psql -h localhost -p 5000
Password for user user:
psql (15.7 (Ubuntu 15.7-1.pgdg22.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
Type "help" for help.

user=>
```

This is a fully working conection with almost no penalty.

Now, at netjam console, you can, for instance, set a 1 second delay for every
round-trip (tx+rx) connection:



```
> delay 1000
STATUS:
┌─────────────┬────────────────────────────┐
│   (index)   │           Values           │
├─────────────┼────────────────────────────┤
│ remoteHost  │        'localhost'         │
│ remotePort  │           '5432'           │
│ listenPort  │            5000            │
│  timestamp  │ '2024-08-06T19:02:33.886Z' │
│   waiting   │             0              │
│    open     │             3              │
│   closed    │             3              │
│  withError  │             0              │
│     tx      │             20             │
│     rx      │             21             │
│  iputDelay  │             0              │
│ outputDelay │            500             │
│ inputDelay  │            500             │
│ logInterval │       '0 (Disabled)'       │
└─────────────┴────────────────────────────┘

AVAILABLE COMMANDS:
  inputDelay    - Sets input delay to specified value
  outputDelay   - Sets output delay to specified value
  delay         - Sets overall balanced delay to specified value
  logInterval   - Show/Set status (stderr) logging interval in msecs
  quit          - Quit the program

> 
```

Now your PostgreSQL connection still works, but a little bit slower... 😉


<a name="contributing"></a>Contributing
---------------------------------------

If you are interested in contributing with this project, you can do it in many ways:

  * Creating and/or mantainig documentation.

  * Implementing new features or improving code implementation.

  * Reporting bugs and/or fixing it.
  
  * Sending me any other feedback.

  * Whatever you like...
    
Please, contact-me, open issues or send pull-requests thought [this project GIT repository](https://github.com/bitifet/netjam)


License
-------

  [GPLv3](LICENSE)
