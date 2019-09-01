'use babel';


import {
    CompositeDisposable
} from 'atom';
import TestCafeRunnerView from './testcafe-runner-view';

import {
    Detector
} from './testcafe-runner-detector';

import {
    Performer
} from './testcafe-runner-performer';

import {
    Config
} from './testcafe-runner-config';

import {
    configData
} from './testcafe-runner-configData';


export default {
    testCafeRunnerView: null,
    modalPanel: null,
    subscriptions: null,

    config: configData,

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

        const preset = new Config('preset');

        const launchingScript = new Detector();
        const launchingLine = launchingScript.parse(launchingScript.file.selection);

        if (!launchingLine) { return }

        const scriptFormat = launchingLine.format;
        const scriptDeclaration = launchingLine.declaration;

        try {
            process.chdir(launchingScript.workspace);
        } catch (error) {
            atom.notifications.addError(errors.incorrectPath, { detail: error });
            return
        }

        atom.notifications
            .addSuccess(`Prepare the ${launchingLine.format}`, { detail: `${launchingLine.declaration}` });

        const testCafeRunnerProcess = new Performer([
                preset.get(`browsers`).join(','),
                launchingScript.file.path,

                `--${scriptFormat.toString()}`, `"${scriptDeclaration.toString()}"`,

                `--hostname`, `${preset.get(`hostname`).toString()}`,
                `--ports`, `${preset.get(`ports`).toString()}`,
                `--speed`, `${preset.get(`speed`).toString()}`,

                `${(preset.get(`isColor`)) ? '--color' : '--no-color'}`,
                `${(preset.get(`isDebugOnFail`)) ? '--debug-on-fail' : ' '}`,
                `${(preset.get(`isSkipJSErrors`)) ? '--skip-js-errors' : ' '}`,
                `${(preset.get(`isSkipUncaughtErrors`)) ? '--skip-uncaught-errors' : ' '}`,
                `${(preset.get(`isStopOnFirstFail`)) ? '--stop-on-first-fail' : ' '}`,
                `${(preset.get(`isQRCode`)) ? '--qr-code' : ' '}`,
                `${(preset.get(`isDevMode`)) ? '--dev' : ' '}`,
                `${(preset.get(`isLive`)) ? '--live' : ' '}`,
            ]);

        testCafeRunnerProcess.prepare();
        testCafeRunnerProcess.showBanner();
        testCafeRunnerProcess.create();

    }
};
