'use babel';

export default class TestcafeRunnerView {

    constructor(serializedState, closeIt) {
        this.element = document.createElement('div');
        this.element.classList.add('testcafe-runner-view');

        this.element.innerHTML = '';

        this.closeButton = document.createElement('div');
        this.closeButton.classList.add('testcafe-runner-view-close-button');
        this.closeButton.addEventListener('click', closeIt.bind(this));

        this.element.appendChild(this.closeButton);

        this.clearLog();
        this.insertTime();
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    clearLog() {
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
    }

    insertTime() {
        const infoContainer = document.createElement('p');

        infoContainer.classList.add('testcafe-message');
        infoContainer.innerHTML = `Running tests at: ${new Date().toLocaleString()}`;

        this.element.appendChild(infoContainer);
    }

    insertMessage(message) {
        const infoContainer = document.createElement('p');

        convertedMessage = message.toString().replace(new RegExp(/\n/g), '<br />');

        infoContainer.classList.add('testcafe-message');
        infoContainer.innerHTML = convertedMessage;

        this.element.appendChild(infoContainer);
    }

}
