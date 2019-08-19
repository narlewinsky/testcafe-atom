'use babel';


import {
    testCafeRunnerSettingsWrapper
} from './testcafe-runner-settingsWrapper';


export const testCafeRunnerTerminalPreset = {
    theme: {
            background:
                testCafeRunnerSettingsWrapper
                    .terminalPalette
                    .background,
            foreground:
                testCafeRunnerSettingsWrapper
                    .terminalPalette
                    .foreground,
            cursor:
                testCafeRunnerSettingsWrapper
                    .terminalPalette
                    .cursor,
            cursorAccent:
                testCafeRunnerSettingsWrapper
                    .terminalPalette
                    .cursorAccent
    },

    fontFamily:
        testCafeRunnerSettingsWrapper
                .terminalFont
                .fontFamily,
    fontSize:
        testCafeRunnerSettingsWrapper
                .terminalFont
                .fontSize,

    rendererType: 'dom',
    windowsMode: false,
    cursorBlink: false,
    screenReaderMode: true,
    disableStdin: true,
    convertEol: true
}
