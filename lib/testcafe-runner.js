'use babel';

import {
    CompositeDisposable
} from 'atom';
import TestcafeRunnerView from './testcafe-runner-view';

import {
    spawn
} from 'child_process';
import process from 'process';

export default {
    testcafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

    config: {
        'browsers': {
            'title': 'Browsers',
            'description': 'Specifies the list of browsers where tests are run.',
            'type': 'array',
            'default': ['chrome', 'safari'],
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
        console.log('TestcafeRunner was toggled!');
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
            alert(`Browsers is wrong: ${browsers}`)
            return;
        }

        if (!hostname) {
            alert(`Hostname is wrong: ${hostname}`)
            return;
        }

        if (!ports) {
            alert(`Ports is wrong: ${ports}`)
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
            alert(`Wrong or unavailable TestCafe launch line`);
            return;
        }

        const toRun = {
            type: runLine[1],
            name: runLine[3]
        }

        // Get the project root folder
        let nodePath = null;
        atom.project.getPaths().forEach((path) => {
            if (atom.workspace.getActiveTextEditor().getPath().match([path])) {
                nodePath = path;
            }
        });

        if (!nodePath) {
            alert('Project folder was not found');
            return;
        }

        process.chdir(nodePath);
        this.modalPanel.show();

        // Run TestCafe in a child process
        const commandOptions = [
            browsers,
            filePath,
            `--${toRun.type} \"${toRun.name}\"`,
            `--hostname ${hostname}`,
            `--ports ${ports}`];

        let testCafeProcess = spawn('testcafe', commandOptions);

        this.testcafeRunnerView.insertMessage(`# testcafe ${commandOptions.join(' ')}`);
        this.testcafeRunnerView.insertMessage(`Running tests at: ${new Date().toLocaleString()}`);

        testCafeProcess.stdout.on('data', (data) => {
            this.testcafeRunnerView.insertMessage(data);
        });
    }

};
