'use babel';

export default class TestcafeRunnerView {

    constructor(serializedState) {
        this.element = document.createElement('div');
        this.element.classList.add('testcafe-runner');
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

    insertMessage(message) {
        const infoContainer = document.createElement('p');

        convertedMessage = message.toString().replace(new RegExp(/\n/g), '<br />');

        infoContainer.classList.add('testcafe-message');
        infoContainer.innerHTML = convertedMessage;

        this.element.appendChild(infoContainer);
    }

}
