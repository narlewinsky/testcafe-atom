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
