'use babel';

import * as $ from 'jquery';
import TestcafeRunnerView from './testcafe-runner-view';

import {
	CompositeDisposable
}
from 'atom';

const browserTools = require('testcafe-browser-tools');

const createTestCafe = require('testcafe');
const process = require('process');

export default {

	testcafeRunnerView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.testcafeRunnerView = new TestcafeRunnerView(state.testcafeRunnerViewState);
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.testcafeRunnerView.getElement(),
			visible: false
		});

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'testcafe-runner:runSelectedTest': () => this.runSelectedTest()
		}));

	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.testcafeRunnerView.destroy();
	},

	serialize() {
		return {
			testcafeRunnerViewState: this.testcafeRunnerView.serialize()
		};
	},

	toggle() {
		console.log('TestcafeRunner was toggled!');
		return (
			this.modalPanel.isVisible() ?
			this.modalPanel.hide() :
			this.modalPanel.show()
		);
	},

	runSelectedTest() {
		// const currentPath = activeTextEditor.getPath();
		// alert(atom.workspace.getActiveTextEditor().getPath());
		let activePath = atom.workspace.getActiveTextEditor().getPath();
		let activeTest = atom.workspace.getActiveTextEditor().getSelectedText().match(new RegExp(`.+\\((\\\"|\\\'|\\\`)(.+)(\\\"|\\\'|\\\`)`))[2];
		//
		// alert(activeTest);
		createTestCafe('localhost', 1248, 1249)
			.then((testCafe) => {
				let createdRunner = testCafe.createRunner()
					.browsers(["chrome"])
					.src(activePath);
				// .src([`${atom.workspace.getActiveTextEditor().getPath()}`]);

				if (activeTest) {
					createdRunner.filter(name => name === activeTest);
				}

				return createdRunner.run({
					quarantineMode: false
				});
			})
			.then((failedCount) => {
				testCafe.close();
				if (failedCount !== 0) {
					process.exit(failedCount);
				}
			});
	}

};