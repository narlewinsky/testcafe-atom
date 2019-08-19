'use babel';

import {
    CompositeDisposable
} from 'atom';
import TestCafeRunnerView from './testcafe-runner-view';

import {
    settings
} from './core/presets/settings';

import {
    testCafeRunnerSettingsWrapper
} from './core/testcafe-runner-settingsWrapper';

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

    config: settings,

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

        const browsers = testCafeRunnerSettingsWrapper.specificOptions.browsers;
        const hostname = testCafeRunnerSettingsWrapper.specificOptions.hostname;
        const ports = testCafeRunnerSettingsWrapper.specificOptions.ports;
        const isLiveMode = testCafeRunnerSettingsWrapper.specificOptions.isLiveMode;

        const launchingScript = new TestCafeRunnerLaunchingScript();
        const launchingLine = launchingScript.parse(launchingScript.file.selection)

        if (!launchingLine) {
            atom.notifications
                .addError(`Wrong or unavailable TestCafe launch line`);
            return;
        }

        const scriptFormat = launchingLine.format;
        const scriptDeclaration = launchingLine.declaration;

        const changeDirectoryProcess = process.chdir(launchingScript.workspace);

        const testCafeRunnerProcess = new TestCafeRunnerProcess([
                browsers,
                launchingScript.file.path,
                `--${scriptFormat} "${scriptDeclaration}"`,
                `--hostname ${hostname}`,
                `--ports ${ports}`,
                `${(isLiveMode) ? '--live' : ' '}`
            ]);

    }
};
