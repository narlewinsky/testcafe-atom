'use babel';


export class TestCafeRunnerLaunchingScript {
    constructor() {
        this.file = {
            name:
                atom.workspace
                    .getActiveTextEditor()
                    .getTitle(),
            path:
                atom.workspace
                    .getActiveTextEditor()
                    .getPath(),

            selection:
                atom.workspace
                    .getActiveTextEditor()
                    .getSelectedText()
        }

        this.workspace = atom.project
                             .relativizePath(this.file.path)[0];

    }

    parse(scriptLine) {
        try {
            if (atom.workspace.getActiveTextEditor().isBufferRowCommented()) {
                atom.notifications
                    .addError(`The selected row is commented! Please, try again...`);
                return false
            }

            const parsed = scriptLine.match(new RegExp(/\s*(test|fixture)\s*\(?\s*['"`]\s*(.+)['"`]\s*\,?\s*\S*/m));

            return {
                format: parsed[1],
                declaration: parsed[2]
            }

        } catch(error) {
            atom.notifications
                .addError(`The selected declaration line is wrong or unavailable!`, {detail: `Detail: ${error}`});
            return false
        }
    }
}
