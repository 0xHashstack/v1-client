import { useState, useCallback } from 'react';

const useCopyToClipboard = () => {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = useCallback((text: string) => {
		if (!navigator.clipboard) {
			console.warn('Clipboard not supported');
			return;
		}

		navigator.clipboard
			.writeText(text)
			.then(() => {
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), 2000);
			})
			.catch((error) => console.error('Copy failed', error));
	}, []);

	return { isCopied, copyToClipboard };
};

export default useCopyToClipboard;
