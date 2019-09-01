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

import * as fit from 'xterm/lib/addons/fit/fit';
Terminal.applyAddon(fit);

import colors from 'colors';

import {
    testCafeMessages,
    terminalMessages
} from './testcafe-runner-notifications';

import {
    Config
} from './testcafe-runner-config';


export class Performer {
    constructor(options) {
        const font = new Config('font');
        const theme = new Config('theme');

        this.options = options;
        this.terminal = new Terminal({
            theme: {
                background:
                    theme.get(`common`, `background`)
                         .toHexString(),
				foreground:
					theme.get(`common`, `foreground`)
                        .toHexString(),
				cursor:
					theme.get(`common`, `cursor`)
                        .toHexString(),
				cursorAccent:
					theme.get(`common`, `cursorAccent`)
                        .toHexString(),
				selection:
					theme.get(`common`, `selection`)
                        .toHexString(),
				black:
					theme.get(`normal`, `black`)
                         .toHexString(),
				red:
					theme.get(`normal`, `red`)
                        .toHexString(),
				green:
					theme.get(`normal`, `green`)
                         .toHexString(),
				yellow:
					theme.get(`normal`, `yellow`)
                         .toHexString(),
				blue:
					theme.get(`normal`, `blue`)
                         .toHexString(),
				magenta:
					theme.get(`normal`, `magenta`)
                         .toHexString(),
				cyan:
					theme.get(`normal`, `cyan`)
                         .toHexString(),
				white:
					theme.get(`normal`, `white`)
                         .toHexString(),
				brightBlack:
					theme.get(`bright`, `black`)
                         .toHexString(),
				brightRed:
					theme.get(`bright`, `red`)
                        .toHexString(),
				brightGreen:
					theme.get(`bright`, `green`)
                         .toHexString(),
				brightYellow:
					theme.get(`bright`, `yellow`)
                         .toHexString(),
				brightBlue:
					theme.get(`bright`, `blue`)
                         .toHexString(),
				brightMagenta:
					theme.get(`bright`, `magenta`)
                         .toHexString(),
				brightCyan:
					theme.get(`bright`, `cyan`)
                         .toHexString(),
				brightWhite:
					theme.get(`bright`, `white`)
            			 .toHexString()
            },

            fontFamily:
                font.get(`family`),
            fontSize:
                font.get(`size`),

            rendererType: 'dom',
            windowsMode: false,
            cursorBlink: false,
            tabStopWidth: 8,
            enableBold: false,
            screenReaderMode: true,
            disableStdin: true,
            convertEol: true,
        });
    }

    prepare() {
        this.terminal
            .open(document.querySelector('.testcafe-runner-view-terminal'));

        this.terminal
            .loadAddon(new WebLinksAddon());

        this.terminal.fit();
        this.terminal.clear();
    }

    showBanner() {
        this.terminal.writeln(terminalMessages.banner.toString().america);
        this.terminal.writeln(terminalMessages.link.toString().blue.underline);
        this.terminal.writeln(terminalMessages.buildInfo.toString().white);

        this.insertEmptyLine();
        this.insertEmptyLine();

        this.terminal.writeln(` # testcafe ${this.options.join(' ')}`.toString().white);

        this.insertEmptyLine();

        this.terminal.writeln(` Running tests at: ${new Date().toLocaleString()} `.white.inverse);

        this.insertEmptyLine();
    }

    create() {
        this.testCafeProcess = spawn('testcafe', this.options, { shell: true });

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
