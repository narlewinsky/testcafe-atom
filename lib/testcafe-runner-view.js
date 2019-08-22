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

        this.closing.addEventListener('click', closeIt.bind(this));

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
        let child = this.console.lastElementChild;

        while (child) {
            this.console.removeChild(child);
            child = this.console.lastElementChild;
        }
    }
}
