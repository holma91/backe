import beepCommand from './beep.js';
import pingCommand from './ping.js';
import kickCommand from './kick.js';
import optionsInfoCommand from './options-info.js';
import pruneCommand from './prune.js';
import serverCommand from './server.js';
import userInfoCommand from './user-info.js';

const commands = [
    beepCommand,
    pingCommand,
    kickCommand,
    optionsInfoCommand,
    pruneCommand,
    serverCommand,
    userInfoCommand,
];

export default commands;
