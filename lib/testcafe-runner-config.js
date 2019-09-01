'use babel';

export class Config {
	constructor(serie) {
		this.serie = serie;
	}

	get(config, sub = '') {
		return atom.config.get(`testcafe-runner.${this.serie}.${config}${sub != '' ? '.' + sub : ''}`);
	}
}
