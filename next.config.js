/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	swcMinify: true,
};
// const withPlugins = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');
const path = require('path');
const withSass = require('@zeit/next-sass');
module.exports = withSass({
	/* bydefault config  option Read For More Optios
here https://github.com/vercel/next-plugins/tree/master/packages/next-sass
*/
	cssModules: true,
});
module.exports = {
	/* Add Your Scss File Folder Path Here */
	sassOptions: {
		includePaths: [path.join(__dirname, 'assets')],
	},
};


let config = {
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},

	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
};

if (process.env.NEXT_PUBLIC_APP_ENV == 'production') {
	module.exports = withOptimizedImages({...config, images: {
		unoptimized: true,
	}});
} else {
	module.exports = config;
}

