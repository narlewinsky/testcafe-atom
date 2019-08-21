'use babel';

import {
    CompositeDisposable
} from 'atom';
import TestCafeRunnerView from './testcafe-runner-view';

import {
    testCafeRunnerSettings
} from './testcafe-runner-settings';

import {
    TestCafeRunnerLaunchingScript
} from './core/testcafe-runner-launchingScript';

import {
    TestCafeRunnerProcess
} from './core/testcafe-runner-process';


export default {
    testCafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

    config: testCafeRunnerSettings,

    activate(state) {
        this.testCafeRunnerView = new TestCafeRunnerView(state.testCafeRunnerViewState, () => {
            this.modalPanel.hide();
        });

        this.modalPanel = atom.workspace.addBottomPanel({
            item: this.testCafeRunnerView.getElement(),
            visible: false
        });

        this.subscriptions = new CompositeDisposable();

        this.subscriptions
            .add(atom.commands
                .add('atom-workspace', {
                    'testcafe-runner:toggle': () => this.toggle(),
                    'testcafe-runner:runIt': () => this.runIt()
                }));
    },

    deactivate() {
        this.testCafeRunnerView.destroy();
        this.modalPanel.destroy();
        this.subscriptions.dispose();
    },

    serialize() {
        return {
            testCafeRunnerViewState: this.testCafeRunnerView.serialize()
        };
    },

// test('Drag-and-drop appointments in day', async t => {
// test('Drag-and-drop appointments in timelineDay', async t => {

    toggle() {
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    },

    runIt() {
        this.modalPanel.show();
        this.testCafeRunnerView.clear();

        const launchingConfiguration = {
            browsers:
                atom.config
                    .get('testcafe-runner.testCafeOptions.browsers'),
            hostname:
                atom.config
                    .get('testcafe-runner.testCafeOptions.hostname'),
            ports:
                atom.config
                    .get('testcafe-runner.testCafeOptions.ports'),
            isLiveMode:
                atom.config
                    .get('testcafe-runner.testCafeOptions.isLiveMode')
        }

        const launchingScript = new TestCafeRunnerLaunchingScript();
        const launchingLine = launchingScript.parse(launchingScript.file.selection)

        if (!launchingLine) {
            atom.notifications
                .addError(`The selected test declaration line is wrong or unavailable!`);
            return
        } else {
            atom.notifications
                .addSuccess(`TestCafe prepare: ${launchingLine.format} ${launchingLine.declaration}`);
        }

        const scriptFormat = launchingLine.format;
        const scriptDeclaration = launchingLine.declaration;

        const changeDirectoryProcess = process.chdir(launchingScript.workspace);

        const testCafeRunnerProcess = new TestCafeRunnerProcess([
                launchingConfiguration.browsers,
                launchingScript.file.path,
                `--${scriptFormat} "${scriptDeclaration}"`,
                `--hostname ${launchingConfiguration.hostname}`,
                `--ports ${launchingConfiguration.ports}`,
                `${(launchingConfiguration.isLiveMode) ? '--live' : ' '}`
            ]);

        testCafeRunnerProcess.prepare();
        testCafeRunnerProcess.showBanner();
        testCafeRunnerProcess.create();

    }
};
