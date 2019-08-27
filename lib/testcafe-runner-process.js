'use babel';


import {
    spawn
} from 'child_process';

import {
    Terminal
} from 'xterm';

import {
    WebLinksAddon
} from 'xterm-addon-web-links';

import {
    FitAddon
} from 'xterm-addon-fit';

// import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
// Terminal.applyAddon(webLinks);

import colors from 'colors';

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
                selection:
                    atom.config
                        .get('testcafe-runner.terminalPalette.selection')
                        .toHexString(),

                black:
            		atom.config
            			.get('testcafe-runner.terminalPalette.black')
            			.toHexString(),
                red:
                    atom.config
                        .get('testcafe-runner.terminalPalette.red')
                        .toHexString(),
                green:
            		atom.config
            			.get('testcafe-runner.terminalPalette.green')
            			.toHexString(),
                yellow:
            		atom.config
            			.get('testcafe-runner.terminalPalette.yellow')
            			.toHexString(),
                blue:
            		atom.config
            			.get('testcafe-runner.terminalPalette.blue')
            			.toHexString(),
                magenta:
            		atom.config
            			.get('testcafe-runner.terminalPalette.magenta')
            			.toHexString(),
                cyan:
            		atom.config
            			.get('testcafe-runner.terminalPalette.cyan')
            			.toHexString(),
                white:
            		atom.config
            			.get('testcafe-runner.terminalPalette.white')
            			.toHexString(),
                brightBlack:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightBlack')
            			.toHexString(),
                brightRed:
                    atom.config
                        .get('testcafe-runner.terminalPalette.foreground')
                        .toHexString(),
                brightGreen:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightGreen')
            			.toHexString(),
                brightYellow:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightYellow')
            			.toHexString(),
                brightBlue:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightBlue')
            			.toHexString(),
                brightMagenta:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightMagenta')
            			.toHexString(),
                brightCyan:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightCyan')
            			.toHexString(),
                brightWhite:
            		atom.config
            			.get('testcafe-runner.terminalPalette.brightWhite')
            			.toHexString()
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
            tabStopWidth: 8,
            enableBold: false,
            screenReaderMode: true,
            disableStdin: true,
            convertEol: true
        });
    }

    prepare() {
        this.terminal
            .loadAddon(new WebLinksAddon());
        this.terminal
            .loadAddon(new FitAddon());

        this.terminal
            .open(document.querySelector('.testcafe-runner-view-terminal'));

        this.terminal.clear();
        // this.terminal.fit();
    }

    showBanner() {
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
            this.terminal
                .write(data.toString());
        });

        this.testCafeProcess.stderr.on('data', (data) => {
            this.terminal
                .write(data.toString());
        });

        this.testCafeProcess.on('exit', (code) => {
            this.testCafeProcess.kill();
        })

    }

    insertEmptyLine() {
        this.terminal.writeln(` `);
    }
}
