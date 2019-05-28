export const environment = {
	production: true,
	locales: ['ja-JP', 'en-US'],
	get languages() {
		return this.locales.map((locale) => locale.substr(0, 2));
	},
};
