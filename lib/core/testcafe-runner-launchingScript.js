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
        if (!scriptLine) {
            return
        }

        const parsed = scriptLine.match(new RegExp(/.*(test|fixture).*(\'|\"|\`)(.+)(\'|\"|\`).*/m));

        if (!parsed) {
            return
        }

        return {
            format: parsed[1],
            declaration: parsed[3]
        }
    }
}
