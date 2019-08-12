'use babel';

import { CompositeDisposable } from 'atom';
import TestcafeRunnerView from './testcafe-runner-view';

import { spawn } from 'child_process';
import process from 'process';

export default {
    testcafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

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
        let fileName = atom.workspace.getActiveTextEditor().getTitle();
        let filePath = atom.workspace.getActiveTextEditor().getPath();

        // Detect the run line for TestCafe
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
        let testCafeProcess = spawn('testcafe', ['chrome', filePath, `--${toRun.type} \"${toRun.name}\"`]);

        testCafeProcess.stdout.on('data', (data) => {
          this.testcafeRunnerView.insertMessage(data);
        });
    }

};
