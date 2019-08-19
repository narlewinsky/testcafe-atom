'use babel';


import {
    settings
} from './presets/settings';


export const testCafeRunnerSettingsWrapper = {
    specificOptions: {
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
    },

    terminalFont: {
        fontFamily:
            atom.config
                .get('testcafe-runner.terminalFont.fontFamily'),

        fontSize:
            atom.config
                .get('testcafe-runner.terminalFont.fontSize'),
    },

    terminalPalette: {
        background:
            atom.config
                .get('testcafe-runner.terminalPalette.background'),

        foreground:
            atom.config
                .get('testcafe-runner.terminalPalette.foreground'),

        cursor:
            atom.config
                .get('testcafe-runner.terminalPalette.cursor'),

        cursorAccent:
            atom.config
                .get('testcafe-runner.terminalPalette.cursorAccent')
    }
}
