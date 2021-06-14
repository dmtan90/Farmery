const path = require('path')

module.exports = {
	configureWebpack: config => {
		// Modify the configuration for the production environment...
		if (process.env.NODE_ENV === 'production') {
			//html file import absolute address
			// config.output.publicPath =''//Do not generate .map file
			// config.devtool = false
		} else {
			// Modify the configuration for the development environment...
		}
		return {
			resolve: {
				extensions: ['.vue', '.js', '.ts', '.css', '.styl', '.json','.jsx','.mjs'],
				alias: {
					'@': path.resolve('src'),
					'~': '@/components',
					img: '@/assets/img',
					plugins: '@/plugins',
					server: path.resolve('server'),
					config: path.resolve('config'),
					api: 'server/api',
					model:'./server/model'
				}
			}
		}
	},

	// vue-loader option
	// See https://vue-loader.vuejs.org/zh-cn/options.html
	// vueLoader: {},

	// Is a source map generated for the production environment?
	// productionSourceMap: false,

	// CSS related options
	css: {
		// Extract the CSS in the component to a separate CSS file (only used in the production environment)
		// extract: true,

		// Whether to open the CSS source map?
		// sourceMap: false,

		// Pass custom options for the loader of the preprocessor. Such as passing to
		// For sass-loader, use `{ sass: {...} }`.
		loaderOptions: {
			stylus: {
				'resolve url': true,
				import: [
					path.resolve(__dirname, './src/assets/css/func.styl'),
					path.resolve(__dirname, './src/assets/css/variables.styl'),
					path.resolve(__dirname, './src/assets/css/animation.styl')
				]// point to a custom theme file
			}
		}

		// Turn on CSS Modules for all CSS and preprocessed files.
		// This option does not affect `*.vue` files.
		// modules: false
	},

	// Use `thread-loader` for Babel and TypeScript in production
	// It will be enabled by default on multi-core machines.
	parallel: require('os').cpus().length > 1,
	// Do you use `autoDLLPlugin` to split the supplied package?
	// It can also be an explicit array of dependencies introduced in the DLL package.
	// See https://cli.vuejs.org/guide/cli-service.html#cli-service
	// dll: false,
	// Options of PWA plugin.
	// https://cli.vuejs.org/core-plugins/pwa.html#configuration
	pwa: {
		name: 'Farmery',
		themeColor: '#2e54a5',
		msTileColor: '#00aba9'
	},

	// // Configure webpack-dev-server behavior.
	devServer: {
		// open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 8080,
		// https: false,
		hotOnly: true,
		disableHostCheck: true,
		hot: true,
		open: true
		// See https://cli.vuejs.org/config/
		// proxy: {
		//'/api': {
		// target:'http://127.0.0.1:3000/',
		// changeOrigin: true,
		// secure: false,
		//}
		// }, // string | Object
		// before: app => {
		// `app` is an express instance
		//}
	},

	// Three-party plugin options
	pluginOptions: {
		// ...
	}
}
