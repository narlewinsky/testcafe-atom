'use babel';


export class Config {
	contructor(serie) {
		this.serie = serie;
	}

	get(config, sub = '') {
		return atom.config.get(`testcafe-runner.${this.serie}.${config}.${sub}`);
	}
}
