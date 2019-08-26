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
