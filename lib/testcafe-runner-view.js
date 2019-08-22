'use babel';


export default class TestCafeRunnerView {
    constructor(serializedState, closeIt) {
        this.element = document.createElement('div');
        this.element.classList
                    .add('testcafe-runner-view');

        this.console = document.createElement('div');
        this.console.classList
                    .add('testcafe-runner-view-terminal');

        this.closing = document.createElement('div');
        this.closing.classList
                    .add('testcafe-runner-view-close-button');

        this.closingaddEventListener('click', closeIt.bind(this));

        this.element.appendChild(this.console);
        this.element.appendChild(this.closing);
    }

    serialize() {}

    destroy() {
        this.element
            .remove();
    }

    getElement() {
        return this.element;
    }

    clear() {
        let child = this.terminal.lastElementChild;

        while (child) {
            this.terminal.removeChild(child);
            child = this.terminal.lastElementChild;
        }
    }
}
