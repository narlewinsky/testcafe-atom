'use babel';


import {
    testCafeRunnerBrowserAliases
} from './presets/testcafe-runner-browserAliases';

import {
    testCafeOptions
} from './testCafeRunnerParser';

import {
    testCafeRunnerParser
} from './testCafeRunnerParser';


export default {
    nodePath: testCafeRunnerNodePath.detect().path,

    testFile: {
        path:
            atom.workspace
                .getActiveTextEditor()
                .getPath(),
        name:
            atom.workspace
                .getActiveTextEditor()
                .getTitle()
    },

    selectedLine:
            atom.workspace
                .getActiveTextEditor()
                .getSelectedText(),

    parsedLine:
            testCafeRunnerParser.detectRunLine(this.selectedLine),

    notifications() {
        let browsers = testCafeOptions.browsers;

        if (!browsers) {
            atom.notifications.addError(`Check the package settings. Browsers is wrong: ${browsers}`)
        } else {
            browsers.forEach((browser) => {
                if (testCafeRunnerBrowserAliases.indexOf(browser) == -1) {
                    atom.notifications
                        .addWarning(`Browser ${browser} not found in browser aliases.`)
                }
            })
        }

        if (!hostname) {
            atom.notifications
                .addError(`Check the package settings. Hostname is wrong: ${this.hostname}`)
        }

        if (!ports) {
            atom.notifications
                .addError(`Check the package settings. Ports is wrong: ${this.ports}`)
        }

    }
}
