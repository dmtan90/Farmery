module.exports = {
    'root':true,
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'node': true,
        'jquery': true
    },
	'extends': [
		'eslint:recommended',
		// 'plugin:vue/essential',
		'plugin:vue/recommended'
	],
	'plugins': [
        'vue'
    ],
	'parserOptions': {
		'parser': 'babel-eslint',
        'sourceType': 'module',
        'ecmaVersion': 2018,
		'ecmaFeatures': {
			'jsx': true,
			'modules':true,
			'arrowFunctions':true,
			'classes':true,
			'spread': true,
			'forOf': true,
			'blockBindings': true,
			'defaultParams': true,
            'destructuring': true,
            'generators': true,
            'restParams': true,
            'superInFunctions': true,
            'templateStrings': true,
            'experimentalObjectRestSpread': true
        }
	},
    'rules': {
        'linebreak-style': 0,
        'no-unused-vars': 0,
        'no-console': 0,
        'no-debugger': 0,
        'no-cond-assign': 1,
        'no-dupe-args': 1,
        'no-dupe-keys': 1,
        'no-duplicate-case': 1,
        'no-empty': 0,
        'no-ex-assign': 1,
        'no-extra-boolean-cast': 1,
        'no-extra-parens': 1,
        'no-extra-semi': 1,
        'no-func-assign': 1,
        'no-obj-calls': 1,
        'no-inner-declarations': 0,
        'no-template-curly-in-string': 1,
        'no-unexpected-multiline': 1,
        'no-unreachable': 0,
        'no-unsafe-finally': 1,
        'no-unsafe-negation': 1,
        'use-isnan': 1,
        'no-constant-condition': 0,
        'accessor-pairs': 1,
        'curly': 1,
        'eqeqeq': 1,
        'guard-for-in': 1,
        'no-caller': 1,
        'no-div-regex': 1,
        'no-else-return': 1,
        'no-eval': 1,
        'no-fallthrough': 1,
        'no-floating-decimal': 1,
        'no-global-assign': 0,
        'no-multi-spaces': 1,
        'no-multi-str': 1,
        'no-new-func': 1,
        'no-new-wrappers': 1,
        'no-proto': 1,
        'no-redeclare': 1,
        'no-return-await': 1,
        'no-script-url': 1,
        'no-self-assign': 1,
        'no-self-compare': 1,
        'no-sequences': 1,
        'no-unused-labels': 1,
        'no-useless-concat': 1,
        'no-useless-escape': 0,
        'no-with': 1,
        'vars-on-top': 1,
        'wrap-iife': 1,
        'yoda': 1,
        'strict': 1,
        'no-delete-var': 1,
        'no-label-var': 1,
        'no-shadow': 1,
        'no-shadow-restricted-names': 1,
        'no-undef': 1,
        'no-undef-init': 1,
        'no-undefined': 1,
        'no-use-before-define': 1,
        'handle-callback-err': 1,
        'no-new-require': 1,
        'camelcase': 1,
        'comma-dangle': 1,
        'new-parens': 1,
        'no-multi-assign': 0,
        'no-multiple-empty-lines': 1,
        'no-nested-ternary': 0,
        'no-trailing-spaces': 0,
        'no-whitespace-before-property': 1,
        'space-infix-ops': 1,
        'wrap-regex': 1,
        'no-var': 1,
        'prefer-numeric-literals': 1,
        'prefer-spread': 1,
        'prefer-template': 1,
        'no-compare-neg-zero': 1,
        'quotes': [
            'warn',
            'single'
        ],
        'semi': [
            'warn',
            'never'
        ]
    }
}
