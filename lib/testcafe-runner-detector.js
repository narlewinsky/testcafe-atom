'use babel';

import {
    errors
} from './testcafe-runner-errors';

export default class Detector {
    constructor() {
        this.file = {
            name:
                atom.workspace.getActiveTextEditor().getTitle(),
            path:
                atom.workspace.getActiveTextEditor().getPath(),
            selection:
                atom.workspace.getActiveTextEditor().getSelectedText()
        }

        this.workspace = atom.project.relativizePath(this.file.path)[0];
    }

    parse(line) {
        const editor = atom.workspace.getActiveTextEditor();
        const regexp = new RegExp(/\s*(test|fixture)\s*\(?\s*['"`]\s*(.+)['"`]\s*\,?\s*\S*/m);

        try {
            if (editor.isBufferRowCommented()) {
                atom.notifications.addError(errors.lineIsComment, { detail: line });
                return
            } else {
                const parsed = line.match(regexp);
                return {
                    format: parsed[1],
                    declaration: parsed[2]
                }
            }

        } catch(error) {
            atom.notifications.addError(errors.lineIsWrong, { detail: line });
            return
        }
    }
}
