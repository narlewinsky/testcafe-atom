'use babel';

import {
    spawn
} from 'child_process';

import {
    Terminal
} from 'xterm';

import * as fit from 'xterm/lib/addons/fit/fit';
Terminal.applyAddon(fit);

import colors from 'colors';
import process from 'process';

import {
    testCafeMessages,
    terminalMessages
} from './testcafe-runner-notifications';

export class TestCafeRunnerProcess {
    constructor(options) {
        this.options = options;
        this.terminal = new Terminal({
            theme: {
                background:
                    atom.config
                        .get('testcafe-runner.terminalPalette.background')
                        .toHexString(),
                foreground:
                    atom.config
                        .get('testcafe-runner.terminalPalette.foreground')
                        .toHexString(),
                cursor:
                    atom.config
                        .get('testcafe-runner.terminalPalette.cursor')
                        .toHexString(),
                cursorAccent:
                    atom.config
                        .get('testcafe-runner.terminalPalette.cursorAccent')
                        .toHexString(),
            },

            fontFamily:
                atom.config
                    .get('testcafe-runner.terminalFont.fontFamily'),
            fontSize:
                atom.config
                    .get('testcafe-runner.terminalFont.fontSize'),

            rendererType: 'dom',
            windowsMode: false,
            cursorBlink: false,
            screenReaderMode: true,
            disableStdin: true,
            convertEol: true
        });
    }

    prepare() {
        this.terminal
            .open(document.querySelector('.testcafe-runner-view-terminal'));

        this.terminal.clear();
        this.terminal.fit();
    }

    showBanner() {
        // linkify(this.terminal);

        this.terminal.writeln(terminalMessages.banner.toString().america);
        this.terminal.writeln(terminalMessages.link.toString().blue.underline);
        this.terminal.writeln(terminalMessages.buildInfo.toString().white);

        this.insertEmptyLine();
        this.insertEmptyLine();

        this.terminal.writeln(` # testcafe\t\t${this.options.join('\r\n\t\t\t')}`.toString().white);

        this.insertEmptyLine();

        this.terminal.writeln(` Running tests at: ${new Date().toLocaleString()} `.white.inverse);

        this.insertEmptyLine();
    }

    create() {
        this.testCafeProcess = spawn('testcafe', this.options);

        this.testCafeProcess.stdout.setEncoding('utf8');
        this.testCafeProcess.stderr.setEncoding('utf8');

        this.testCafeProcess.stdout.on('data', (data) => {
            this.showNotification(data);
        });

        this.testCafeProcess.stderr.on('data', (data) => {
            this.showNotification(data);
        });

        this.testCafeProcess.on('exit', (code) => {
            this.testCafeProcess.kill();
        })

    }

    showNotification(data) {
        let found;

        for (let type in testCafeMessages) {
            testCafeMessages[type].forEach((item) => {
                if (data.match(new RegExp(item))) {
                    switch(type) {
                        case 'error':
                            this.terminal
                                .write(data.toString()
                                           .red);
                            found = !found;
                            break;
                        case 'warning':
                            this.terminal
                                .writeln(data.toString()
                                             .yellow
                                             .bold);
                            found = !found;
                            break;
                        case 'success':
                            this.terminal
                                .write(data.toString()
                                           .green);
                            found = !found;
                            break;
                    }
                }
            });
        }

        if (!found) {
            this.terminal
                .write(data.toString());
        }
    }

    insertEmptyLine() {
        this.terminal.writeln(` `);
    }
}
