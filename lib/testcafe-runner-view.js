'use babel';


export default class TestCafeRunnerView {
    constructor(serializedState, closeIt) {
        this.element = document.createElement('div');
        this.element.classList.add('testcafe-runner-view');

        this.terminal = document.createElement('div');
        this.terminal.classList.add('testcafe-runner-terminal');

        this.closeButton = document.createElement('div');
        this.closeButton.classList.add('testcafe-runner-view-close-button');
        this.closeButton.addEventListener('click', closeIt.bind(this));

        this.element.appendChild(this.terminal);
        this.element.appendChild(this.closeButton);
    }

    serialize() {}

    destroy() {
        this.element.remove();
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
