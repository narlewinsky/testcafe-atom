'use babel';


import {
    CompositeDisposable
} from 'atom';
import TestCafeRunnerView from './testcafe-runner-view';

import {
    TestCafeRunnerLaunchingScript
} from './testcafe-runner-launchingScript';

import {
    TestCafeRunnerProcess
} from './testcafe-runner-process';

import {
    testCafeRunnerSettings
} from './testcafe-runner-settings';


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

        const launchingScript = new TestCafeRunnerLaunchingScript();
        const launchingLine = launchingScript.parse(launchingScript.file.selection);
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
            thisColorMode:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisColorMode'),
            thisDebugOnFail:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisDebugOnFail'),
            thisSkipJSErrors:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisSkipJSErrors'),
            thisSkipUncaughtErrors:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisSkipUncaughtErrors'),
            thisStopOnFirstFail:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisStopOnFirstFail'),
            thisQRCode:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisQRCode'),
            thisDevMode:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisDevMode'),
            thisLiveMode:
                atom.config
                    .get('testcafe-runner.testCafeOptions.thisLiveMode')
        }

        if (!launchingLine) { return }

        const scriptFormat = launchingLine.format;
        const scriptDeclaration = launchingLine.declaration;

        try {
            process.chdir(launchingScript.workspace);
        } catch (error) {
            atom.notifications
                .addError(`Cannot prepare tests due to an error. Check the working directory!`, { detail: error });
                return
        }

        atom.notifications
            .addSuccess(`Prepare the ${launchingLine.format}`, { detail: `${launchingLine.declaration}` });

        const testCafeRunnerProcess = new TestCafeRunnerProcess([
                launchingConfiguration.browsers.join(','),
                launchingScript.file.path,
                `--${scriptFormat} "${scriptDeclaration}"`,
                `--hostname ${launchingConfiguration.hostname}`,
                `--ports ${launchingConfiguration.ports}`,
                `${(launchingConfiguration.thisColorMode) ? '--color' : '--no-color'}`,
                `${(launchingConfiguration.thisDebugOnFail) ? '--debug-on-fail' : ' '}`,
                `${(launchingConfiguration.thisSkipJSErrors) ? '--skip-js-errors' : ' '}`,
                `${(launchingConfiguration.thisSkipUncaughtErrors) ? '--skip-uncaught-errors' : ' '}`,
                `${(launchingConfiguration.thisStopOnFirstFail) ? '--stop-on-first-fail' : ' '}`,
                `${(launchingConfiguration.thisQRCode) ? '--qr-code' : ' '}`,
                `${(launchingConfiguration.thisDevMode) ? '--dev' : ' '}`,
                `${(launchingConfiguration.thisLiveMode) ? '--live' : ' '}`,
            ]);

        testCafeRunnerProcess.prepare();
        testCafeRunnerProcess.showBanner();
        testCafeRunnerProcess.create();

    }
};
