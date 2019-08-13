'use babel';

import {
    CompositeDisposable
} from 'atom';
import TestcafeRunnerView from './testcafe-runner-view';

import {
    spawn
} from 'child_process';

import process from 'process';
import { Terminal } from 'xterm';

import * as fit from 'xterm/lib/addons/fit/fit';

import {
    version
} from '../package.json';

const testcafeBanner = `
    *   )             )   (         (
  \` )  /(   (      ( /(   )\\      ) )\\ )    (
   ( )(_)) ))\\ (   )\\())(((_)  ( /((()/(   ))\\
  (_(_()) /((_))\\ (_))/ )\\___  )(_))/(_)) /((_)
  |_   _|(_)) ((_)| |_ ((/ __|((_)_(_) _|(_))
    | |  / -_)(_-<|  _| | (__ / _\` ||  _|/ -_)
    |_|  \\___|/__/ \\__|  \\___|\\__,_||_|  \\___|

`

const TESTCAFE_REGEXP = /.*(test|fixture).*(\'|\"|\`)(.+)(\'|\"|\`).*/m;

const browserAliases = [
    'chromium',
    'chrome',
    'chrome-canary',
    'ie',
    'edge',
    'firefox',
    'opera',
    'safari'
]

export default {
    testcafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

    config: {
        'browsers': {
            'title': 'Browsers',
            'description': 'Specifies the list of browsers where tests are run.',
            'type': 'array',
            'default': ['chrome'],
            'items': {
                'type': 'string'
            }
        },
        'hostname': {
            'title': 'Hostname',
            'description': 'Specifies your computer`s hostname. It is used when running tests in remote browsers.',
            'type': 'string',
            'default': 'localhost'
        },
        'ports': {
            'title': 'Ports',
            'description': 'Specifies custom port numbers TestCafe uses to perform testing.',
            'type': 'array',
            'default': ['1488', '1489'],
            'items': {
                'type': 'string'
            }
        },
        'testInLiveMode': {
            'title': 'TestCafe in live mode',
            'description': 'Watches for changes you make in the test files and all files referenced in them',
            'type': 'boolean',
            'default': false
        },
        'fontFamily': {
            'title': 'Font Family',
            'description': 'The name of the font family used for TextCafe output panel text.',
            'type': 'string',
            'default': 'monospace',
            'items': {
                'type': 'string'
            }
        },
        'fontSize': {
            'title': 'Font Size',
            'description': 'Height in pixels of TestCafe output panel text.',
            'type': 'number',
            'default': 13
        },
        'colorScheme': {
            'title': 'Color Scheme',
            'description': 'Color settings of output',
            'type': 'object',
            'properties': {
                'backgroundColor': {
                    'title': 'Background',
                    'type': 'color',
                    'default': '#21252b'
                },
                'foregroundColor': {
                    'title': 'Foreground',
                    'type': 'color',
                    'default': '#9da5b4'
                }
            }
        }
    },

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

    runSelectedTest() {
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
            if (browserAliases.indexOf(browser) == -1) {
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
            .match(new RegExp(TESTCAFE_REGEXP));

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

        // Run TestCafe in a child process
        const commandOptions = [
            browsers,
            filePath,
            `--${runType} \"${runName}\"`,
            `--hostname ${hostname}`,
            `--ports ${ports}`,
            `${testInLiveMode ? '--live' : ' '}`
        ];

        let testCafeProcess = spawn('testcafe', commandOptions);

        Terminal.applyAddon(fit);

        let terminal = new Terminal({
            windowsMode: false,
            convertEol: true,
            fontFamily: atom.config.get('testcafe-runner.fontFamily'),
            fontSize: atom.config.get('testcafe-runner.fontSize'),
            rendererType: 'dom',
            // screenReaderMode: true,
            // disableStdin: true,
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

        terminal.write(testcafeBanner);
        terminal.write(`                          https://devexpress.github.io/testcafe\r\n`);
        terminal.write(`                          +++ Runner v${version}\r\n\r\n`);

        terminal.write(` # testcafe ${commandOptions.join('\r\n\t')}\r\n`);
        terminal.write(` Running tests at: ${new Date().toLocaleString()}\r\n`);

        testCafeProcess.stdout.on('data', (data) => {
            terminal.write(`${data}`);
        });
    }

};
