'use babel';


import {
    Terminal
} from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

Terminal.applyAddon(fit);

import colors from 'colors';

import {
    testCafeRunnerSettingsWrapper
} from './testcafe-runner-settingsWrapper';

import {
    testCafeRunnerTerminalPreset
} from './testcafe-runner-terminalPreset';


class TestCafeRunnerTerminal {
    constructor() {
        this.terminal = new Terminal(testCafeRunnerTerminalPreset);

        this.terminal.clear();
        this.terminal.fit();

        this.terminal
            .open(document.querySelector('.testcafe-runner-terminal'));
    }

    write(data) {
        this.terminal.write(`${data}`);
    }

    writeEmptyLine() {
        this.terminal.writeln(` `)
    }
}
