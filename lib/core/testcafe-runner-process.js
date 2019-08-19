'use babel';


import {
    spawn
} from 'child_process';
import process from 'process';

import colors from 'colors';

import {
    messages
} from './presets/messages';

import {
    TestCafeRunnerTerminal
} from './testcafe-runner-terminal';

export class TestCafeRunnerProcess {
    constructor(options) {
        this.options = options;
        this.terminal = new TestCafeRunnerTerminal();
    }

    prepare() {
        this.terminal.write(messages.banner.white.bold);
        this.terminal.write(messages.linkTo.blue.underline);
        this.terminal.write(messages.versionInfo.white.bold);

        this.terminal.writeEmptyLine();
        this.terminal.writeEmptyLine();

        this.terminal.write(` # testcafe ${this.options.join('\r\n            ')}`);

        this.terminal.writeEmptyLine();

        this.terminal.write(` Running tests at: ${new Date().toLocaleString()} `.white.inverse);

        this.terminal.writeEmptyLine();
    }

    create() {
        this.testCafeProcess = spawn('testcafe', this.options);

        this.testCafeProcess.stdout.on('data', (data) => {
            this.terminal.write(data);
        });

        this.testCafeProcess.stderr.on('data', (data) => {
            this.terminal.write(data);
        });
    }
}
