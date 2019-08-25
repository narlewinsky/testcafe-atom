'use babel';


import {
    version
} from './../package.json';


export const terminalMessages = {
    banner:
    `
    *   )             )   (         (
  \` )  /(   (      ( /(   )\\      ) )\\ )    (
   ( )(_)) ))\\ (   )\\())(((_)  ( /((()/(   ))\\
  (_(_()) /((_))\\ (_))/ )\\___  )(_))/(_)) /((_)
  |_   _|(_)) ((_)| |_ ((/ __|((_)_(_) _|(_))
    | |  / -_)(_-<|  _| | (__ / _\` ||  _|/ -_)
    |_|  \\___|/__/ \\__|  \\___|\\__,_||_|  \\___|
    `,

    link:
        `\t\t\thttps://devexpress.github.io/testcafe`,

    buildInfo:
        `\t\t\t+++ Runner v${version}`
}

export const testCafeMessages = {
    error: [
        `✖`,
        `failed`,
        `ERROR`,
        `An error has occurred while`,
        `Was unable to `,
        `Unable to`,
        `not supported`,
        `cannot`
    ],
    warning: [
        `DEPRECATION-WARNING`,
        `Using locally installed version of TestCafe`,
        `documentation for more info`,
        `Help us spread the word about TestCafe Studio`,
        `Warnings \\(`
    ],
    success: [
        `✓`,
        `passed`
    ]
}
