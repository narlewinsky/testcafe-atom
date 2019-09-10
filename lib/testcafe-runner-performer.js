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
    terminalMessages
} from './testcafe-runner-notifications';

import {
    errors
} from './testcafe-runner-errors';

import {
    base
} from './testcafe-runner-theme';

import Config from './testcafe-runner-config';

export default class Performer {
    constructor(options) {
        const font = new Config('font');

        this.options = options;
        this.terminal = new Terminal({
            // theme: base,
            fontFamily: font.get(`family`),
            fontSize: font.get(`size`),
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
        this.terminal.open(document.querySelector('.testcafe-runner-view-terminal'));

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
            this.terminal.write(data.toString());
        });

        this.testCafeProcess.stderr.on('data', (data) => {
            this.terminal.write(data.toString());
        });

        this.testCafeProcess.on('exit', (code) => {
            this.testCafeProcess.kill();
        })
    }

    insertEmptyLine() {
        this.terminal.writeln(` `);
    }
}
