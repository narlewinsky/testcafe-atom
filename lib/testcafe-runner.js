'use babel';

import * as $ from 'jquery';

import TestcafeRunnerView from './testcafe-runner-view';

import {
    CompositeDisposable
}
from 'atom';

const process = require('process');
const { spawn, exec } = require('child_process');
const browserTools = require('testcafe-browser-tools');
const createTestCafe = require('testcafe');

export default {

    testcafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.testcafeRunnerView = new TestcafeRunnerView(state.testcafeRunnerViewState);
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
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.testcafeRunnerView.destroy();
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
                console.log('match: ', path)
            } else {
                console.log('paths: ', path)
            }
        });

        if (!nodePath) {
            alert('Project folder was not found');
            return;
        }

        // console.log(spawn('cd', [nodePath]));

        // Change a current directory to the projects root folder
        let dir = spawn('cd', [nodePath]);
        process.chdir(nodePath);

        dir.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        dir.stderr.on('data', (data) => {
          alert(`Directory doesn't changed with error: ${data}`);
        });

        // let ls = spawn('ls', ['-la']);
        // process.chdir(nodePath);
        //
        // ls.stdout.on('data', (data) => {
        //   console.log(`stdout: ${data}`);
        // });
        //
        // ls.stderr.on('data', (data) => {
        //   alert(`Directory doesn't changed with error: ${data}`);
        // });
        //
        // let pwd = spawn('pwd', []);
        // process.chdir(nodePath);
        //
        // pwd.stdout.on('data', (data) => {
        //   console.log(`stdout: ${data}`);
        // });
        //
        // pwd.stderr.on('data', (data) => {
        //   alert(`Directory doesn't changed with error: ${data}`);
        // });

        // Run TestCafe in a child process
        this.modalPanel.show();
        let testCafeProcess = spawn('testcafe', ['chrome', filePath, `--${toRun.type} \"${toRun.name}\"`]);

        testCafeProcess.stdout.on('data', (data) => {
          this.testcafeRunnerView.insertMessage(data);
        });

        testCafeProcess.stderr.on('data', (data) => {
          alert(`TestCafe child process exited with error: ${data}`);
        });
    }

};
