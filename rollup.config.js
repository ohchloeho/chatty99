// rollup.config.js
import copy from 'rollup-plugin-copy';

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/app.js',
		format: 'cjs'
	},
	plugins: [
		copy({
			targets: [
				{
					src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
					dest: 'public/vendor/bootstrap/css'
				},
				{
					src: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
					dest: 'public/vendor/bootstrap/js'
				}
			]
		})
	]
};
