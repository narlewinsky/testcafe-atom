'use babel';

import {
    version
} from '../../package.json';

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
                        .get('testcafe-runner.terminalPalette.background'),
                foreground:
                    atom.config
                        .get('testcafe-runner.terminalPalette.foreground'),
                cursor:
                    atom.config
                        .get('testcafe-runner.terminalPalette.cursor'),
                cursorAccent:
                    atom.config
                        .get('testcafe-runner.terminalPalette.cursorAccent'),
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
            .open(document.querySelector('.testcafe-runner-terminal'));

        this.terminal.clear();
        this.terminal.fit();
    }

    showBanner() {
        this.terminal.writeln(
            `
    *   )             )   (         (
  \` )  /(   (      ( /(   )\\      ) )\\ )    (
   ( )(_)) ))\\ (   )\\())(((_)  ( /((()/(   ))\\
  (_(_()) /((_))\\ (_))/ )\\___  )(_))/(_)) /((_)
  |_   _|(_)) ((_)| |_ ((/ __|((_)_(_) _|(_))
    | |  / -_)(_-<|  _| | (__ / _\` ||  _|/ -_)
    |_|  \\___|/__/ \\__|  \\___|\\__,_||_|  \\___|

            `.white.bold);

        this.terminal.writeln(`\t\t\thttps://devexpress.github.io/testcafe`.blue.underline);
        this.terminal.writeln(`\t\t\t+++ Runner v${version}`.white.bold);

        this.terminal.writeln(` `);
        this.terminal.writeln(` `);

        this.terminal.writeln(` # testcafe ${this.options.join('\r\n            ')}`);

        this.terminal.writeln(` `);

        this.terminal.writeln(` Running tests at: ${new Date().toLocaleString()} `.white.inverse);

        this.terminal.writeln(` `);
    }

    create() {
        this.testCafeProcess = spawn('testcafe', this.options);

        this.testCafeProcess.stdout.on('data', (data) => {
            this.terminal.write(`${data}`);
        });

        this.testCafeProcess.stderr.on('data', (data) => {
            this.terminal.write(`${data}`);
        });
    }
}
