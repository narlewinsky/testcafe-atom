'use babel';

export default class Config {
	constructor(serie) {
		this.serie = serie;
        console.log(this.serie);
        console.log(atom.config.get(`testcafe-runner.preset.hostname`));
        console.log(atom.config.get(`testcafe-runner.theme.common.background`));
	}

	get(config, sub = '') {
		return atom.config.get(`testcafe-runner.${this.serie}.${config}${sub != '' ? '.' + sub : ''}`);
	}
}
