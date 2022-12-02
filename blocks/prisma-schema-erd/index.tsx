import { FileBlockProps } from '@githubnext/blocks';
import { useState, useEffect } from 'react';
import { Box, Heading, Text, ActionMenu, ActionList } from '@primer/react';
import axios from 'axios';
import Mermaid from './Mermaid';

const THEMES = ['default', 'base', 'forest', 'dark', 'neutral'];

// https://github.com/skn0tt/prisma-erd
const TRANSLATOR_URL =
	'https://prisma-erd.simonknott.de/api/render-dml-to-mermaid';
// This is kinda sketchy, but there doesn't seem to be an easy way to convert
// Prisma's schema DML to mermaid syntax in the browser. Existing tools run on
// Node.js
const cors = (url: string) => `https://cors-anywhere.herokuapp.com/${url}`;

export default function (props: FileBlockProps) {
	const { content: dml } = props;

	const [mmd, setMmd] = useState('');
	const [error, setError] = useState();

	const [theme, setTheme] = useState(THEMES[0]);

	useEffect(() => {
		axios
			.post(cors(TRANSLATOR_URL), dml, {
				headers: {
					'Content-Type': 'text/plain',
				},
			})
			.then((res) => {
				console.log(res.data);
				setMmd(res.data);
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data || 'Whoops, something went wrong');
			});
	}, [dml]);

	return (
		<Box p={4}>
			<Box
				borderColor='border.default'
				borderWidth={1}
				borderStyle='solid'
				borderRadius={6}
				overflow='hidden'
			>
				<Box
					bg='canvas.subtle'
					p={3}
					borderBottomWidth={1}
					borderBottomStyle='solid'
					borderColor='border.default'
				>
					{/* THEME SELECTOR */}
					<ActionMenu>
						<ActionMenu.Button sx={{ textTransform: 'capitalize' }}>
							{theme} theme
						</ActionMenu.Button>
						<ActionMenu.Overlay>
							<ActionList selectionVariant='single'>
								{THEMES.map((t) => (
									<ActionList.Item
										key={t}
										onClick={() => setTheme(t)}
										selected={t === theme}
									>
										{t}
									</ActionList.Item>
								))}
							</ActionList>
						</ActionMenu.Overlay>
					</ActionMenu>
				</Box>

				<Box p={4} textAlign='center'>
					{error ? (
						<Box>
							<Heading>Error</Heading>
							<Text>{error}</Text>
						</Box>
					) : (
						<Mermaid mmd={mmd} config={{ theme }} />
					)}
				</Box>
			</Box>
		</Box>
	);
}
