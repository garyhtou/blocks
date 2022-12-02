import { useEffect, useState } from 'react';
import { Box, Spinner } from '@primer/react';
import mermaid from 'mermaid';

export default function renderMermaid({
	mmd,
	config,
}: {
	mmd: string;
	config?: object;
}) {
	const [svg, setSvg] = useState('');

	useEffect(() => {
		mermaid.initialize({
			startOnLoad: true,
			...config,
		});
	}, [config]);

	useEffect(() => {
		if (!mmd) return;
		mermaid.mermaidAPI.render('mermaid', mmd, setSvg);
	}, [mmd, config]);

	return <div dangerouslySetInnerHTML={{ __html: svg }}></div>;
}
