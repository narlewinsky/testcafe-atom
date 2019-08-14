'use babel';

import {
    CompositeDisposable
} from 'atom';
import TestcafeRunnerView from './testcafe-runner-view';

import {
    spawn
} from 'child_process';

import process from 'process';
import {
    Terminal
} from 'xterm';

import * as fit from 'xterm/lib/addons/fit/fit';

import colors from 'colors';

import {
    version
} from '../package.json';

import {
    testCafeBrowserAliases
} from './data/testcafe-runner.data';

import {
    testCafeBanner
} from './data/testcafe-runner.local';

import {
    testcafeRunnerConfig
} from './data/testcafe-runner.config';

export default {
    testcafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

    config: testcafeRunnerConfig,

    activate(state) {
        this.testcafeRunnerView = new TestcafeRunnerView(state.testcafeRunnerViewState, () => {
            this.modalPanel.hide();
        });

        this.modalPanel = atom.workspace.addBottomPanel({
            item: this.testcafeRunnerView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'testcafe-runner:toggle': () => this.toggle(),
            'testcafe-runner:runSelectedTest': () => this.runSelectedTest()
        }));
    },

    deactivate() {
        this.testcafeRunnerView.destroy();
        this.modalPanel.destroy();
        this.subscriptions.dispose();
    },

    serialize() {
        return {
            testcafeRunnerViewState: this.testcafeRunnerView.serialize()
        };
    },

    toggle() {
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    },
    //
    //  function deleteChild() {
    //     var e = document.querySelector("ul");
    //
    //     //e.firstElementChild can be used.
    //     var child = e.lastElementChild;
    //     while (child) {
    //         e.removeChild(child);
    //         child = e.lastElementChild;
    //     }
    // },

    runSelectedTest() {
        this.testcafeRunnerView.clear();

        let browsers = atom.config.get('testcafe-runner.browsers');

        let hostname = atom.config.get('testcafe-runner.hostname');
        let ports = atom.config.get('testcafe-runner.ports');

        let testInLiveMode = atom.config.get('testcafe-runner.testInLiveMode');

        // Check setting
        if (!browsers) {
            atom.notifications.addError(`Check a package settings. Browsers is wrong: ${browsers}`)
            return;
        }

        browsers.forEach((browser) => {
            if (testCafeBrowserAliases.indexOf(browser) == -1) {
                atom.notifications.addWarning(`Browser ${browser} not found in browser aliases.`)
            }
        })

        if (!hostname) {
            atom.notifications.addError(`Check a package settings. Hostname is wrong: ${hostname}`)
            return;
        }

        if (!ports) {
            atom.notifications.addError(`Check a package settings. Ports is wrong: ${hostname}`)
            return;
        }

        // Detect the run line for TestCafe
        let fileName = atom.workspace.getActiveTextEditor().getTitle();
        let filePath = atom.workspace.getActiveTextEditor().getPath();

        let runLine = atom.workspace
            .getActiveTextEditor()
            .getSelectedText()
            .match(new RegExp(/.*(test|fixture).*(\'|\"|\`)(.+)(\'|\"|\`).*/m));

        if (!runLine) {
            atom.notifications.addError(`Wrong or unavailable TestCafe launch line: ${runLine}`)
            return;
        }

        const runType = runLine[1];
        const runName = runLine[3];

        // Get the project root folder
        let nodePath = null;
        atom.project.getPaths().forEach((path) => {
            if (atom.workspace.getActiveTextEditor().getPath().match([path])) {
                nodePath = path;
            }
        });

        if (!nodePath) {
            atom.notifications.addError(`Project folder was not found: ${nodePath}`)
            return;
        }

        process.chdir(nodePath);
        this.modalPanel.show();

        this.createTestCafeProcess([
            browsers,
            filePath,
            `--${runType} \"${runName}\"`,
            `--hostname ${hostname}`,
            `--ports ${ports}`,
            `${testInLiveMode ? '--live' : ' '}`
        ]);
    },

    createTestCafeProcess(options) {
        let testCafeProcess = spawn('testcafe', options);

        Terminal.applyAddon(fit);

        let terminal = new Terminal({
            windowsMode: false,
            convertEol: true,
            fontFamily: atom.config.get('testcafe-runner.fontFamily'),
            fontSize: atom.config.get('testcafe-runner.fontSize'),
            rendererType: 'dom',
            screenReaderMode: true,
            disableStdin: true,
            cursorBlink: true,
            theme: {
                background: atom.config.get('testcafe-runner.colorScheme.backgroundColor').toHexString(),
                foreground: atom.config.get('testcafe-runner.colorScheme.foregroundColor').toHexString()
            }
        });

        terminal.setOption('fontFamily', atom.config.get('testcafe-runner.fontFamily'));
        terminal.setOption('fontSize', atom.config.get('testcafe-runner.fontSize'));

        terminal.open(document.querySelector('.testcafe-runner-terminal'));

        terminal.clear();
        terminal.fit();

        terminal.write(testCafeBanner.white.bold);
        terminal.write(`                          https://devexpress.github.io/testcafe\r\n`.underline.blue);
        terminal.write(`                          +++ Runner v${version}\r\n\r\n`.white.bold);

        terminal.write(` # testcafe ${options.join('\r\n            ')}\r\n`);
        terminal.write(` Running tests at: ${new Date().toLocaleString()}\r\n`.white.inverse);

        testCafeProcess.stdout.on('data', (data) => {
            let formatData;
            if (data.includes('✖') || data.includes(' failed (')) {
                formatData = `${data}`.red;
            } else if (data.includes('✓') || data.includes(' passed (')) {
                formatData = `${data}`.green;
            } else if (data.includes('    > ')) {
                formatData = `${data}`.white;
            } else {
                formatData = `${data}`;
            }

            terminal.write(`\r\n${formatData}`);
        });

        testCafeProcess.stderr.on('data', (data) => {
            terminal.write(`\r\n ${data}`.red);
        });
    }

};
