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
            const parsed = scriptLine.match(new RegExp(/ *(test|fixture) *\(? *['"`] *(.+)['"`] *\,? *.+/m));

            return {
                format: parsed[1],
                declaration: parsed[2]
            }

        } catch(error) {
            atom.notifications
                .addError(`The selected test declaration line is wrong or unavailable!`);
            return false
        }
    }
}
