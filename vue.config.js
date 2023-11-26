module.exports = {
	lintOnSave: true,

	css: {
		loaderOptions: {
			sass: {
				additionalData: `@import "@/assets/style/_variables.scss";`
			}
		}
	},

	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: false
		}
	}
}
