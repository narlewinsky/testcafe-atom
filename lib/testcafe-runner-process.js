'use babel';

import {
    version
} from './../package.json';

import {
    spawn
} from 'child_process';
import process from 'process';

import {
    Terminal
} from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

Terminal.applyAddon(fit);

import colors from 'colors';


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
        this.terminal
            .writeln(
            `
    *   )             )   (         (
  \` )  /(   (      ( /(   )\\      ) )\\ )    (
   ( )(_)) ))\\ (   )\\())(((_)  ( /((()/(   ))\\
  (_(_()) /((_))\\ (_))/ )\\___  )(_))/(_)) /((_)
  |_   _|(_)) ((_)| |_ ((/ __|((_)_(_) _|(_))
    | |  / -_)(_-<|  _| | (__ / _\` ||  _|/ -_)
    |_|  \\___|/__/ \\__|  \\___|\\__,_||_|  \\___|
            `.america);

        this.terminal
            .writeln(`\t\t\thttps://devexpress.github.io/testcafe`.blue.underline);
        this.terminal
            .writeln(`\t\t\t+++ Runner v${version}`.white.bold);

        this.insertEmptyLine();
        this.insertEmptyLine();

        this.terminal
            .writeln(` # testcafe ${this.options.join('\r\n            ')}`);

        this.insertEmptyLine();

        this.terminal
            .writeln(` Running tests at: ${new Date().toLocaleString()} `.white.inverse);

        this.insertEmptyLine();
    }

    create() {
        this.testCafeProcess = spawn('testcafe', this.options);

        this.testCafeProcess
            .stdout
            .on('data', (data) => {
                console.log(data);
                let formated;

                if (data.includes(' passed (') ||
                    data.includes('✓')) {
                    formated = `${data}`.green;
                } else if (data.includes(' failed (') ||
                           data.includes('✖') ) {
                    formated = `${data}`.red;
                } else if (data.includes('Skipped: ')) {
                    formated = `${data}`.yellow;
                } else {
                    formated = `${data}`;
                }

                this.terminal
                    .write(`${formated}`);
            });

        this.testCafeProcess
            .stderr
            .on('data', (data) => {
                this.terminal
                    .write(`${data}`);
            });
    }

    insertEmptyLine() {
        this.terminal.writeln(` `);
    }
}
