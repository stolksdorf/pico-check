module.exports = {
	root          : true,
	parserOptions : {
		sourceType : 'module',
	},
	env : {
		node : true,
	},
	rules : {
		/** Errors **/
		camelcase              : ['error', { properties : 'never' }],
		'func-style'           : ['error', 'expression', { allowArrowFunctions : true }],
		'no-array-constructor' : 'error',
		'no-iterator'          : 'error',
		'no-nested-ternary'    : 'error',
		'no-new-object'        : 'error',
		'no-proto'             : 'error',

		/** Override-able Warnings **/
		'max-lines' : [
			'warn',
			{
				max            : 200,
				skipComments   : true,
				skipBlankLines : true,
			},
		],
		'max-depth'            : ['warn', { max : 4 }],
		'max-params'           : ['warn', { max : 4 }],
		'no-restricted-syntax' : ['warn', 'ClassDeclaration', 'SwitchStatement'],
		'no-unused-vars'       : [
			'warn',
			{
				vars              : 'all',
				args              : 'none',
				varsIgnorePattern : 'config|cx',
			},
		],

		/** Fixable **/
		'no-var'          : 'warn',
		'prefer-const'    : 'warn',
		'prefer-template' : 'warn',
		'indent'                : ['warn', 'tab'],
		'no-trailing-spaces'            : 'warn',
		'key-spacing'     : [
			'warn',
			{
				multiLine  : { beforeColon : true, afterColon : true, align : 'colon' },
				singleLine : { beforeColon : true, afterColon : true },
			},
		],
	},
};
