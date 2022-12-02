import { FileBlockProps } from '@githubnext/blocks';
import { useState, useEffect } from 'react';
import { Box, Heading, Text, BranchName } from '@primer/react';
import axios from 'axios';
import PackageCard from './PackageCard';

export default function (props: FileBlockProps) {
	const { metadata, content, context } = props;

	const [error, setError] = useState();
	const [dep, setDep] = useState<StringKeyObject>({});
	const [devDep, setDevDep] = useState<StringKeyObject>({});

	useEffect(() => {
		try {
			const pack = JSON.parse(content);
			const { dependencies, devDependencies } = pack;
			setDep(dependencies);
			setDevDep(devDependencies);
		} catch (err: any) {
			setError(err.message);
		}
	}, [content]);

	const [packs, setPacks] = useState<{ [key: string]: Pack }>({});
	const packageKey = (name: string, version: string) => `${name}|${version}`;

	useEffect(() => {
		const barePacks = [];
		for (const name in dep) {
			const version = dep[name];
			barePacks.push({ name, usingVersion: version });
		}
		for (const name in devDep) {
			const version = devDep[name];
			barePacks.push({ name, usingVersion: version });
		}

		for (const barePack of barePacks) {
			const { name, usingVersion: version } = barePack;
			const packKey = packageKey(name, version);
			if (packs[packKey]) continue;

			getPack(name, version)
				.then((res) => res.data)
				.then((rawPack) => {
					const pack: Pack = { ...rawPack, usingVersion: version };
					setPacks((prev) => ({ ...prev, [packKey]: pack }));
				})
				.catch((err) => {
					setError(err.message);
				});
		}
	}, [dep, devDep]);

	console.log(packs);

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
					{/* <ActionMenu>
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
					</ActionMenu> */}
				</Box>

				<Box p={4} textAlign='center'>
					{error ? (
						<Box>
							<Heading>Error</Heading>
							<Text>{error}</Text>
						</Box>
					) : (
						<p>hi</p>
					)}
				</Box>
				{Object.keys(packs).map((packKey: string) => (
					<PackageCard packKey={packKey} pack={packs[packKey]} />
				))}
				<pre>{JSON.stringify({ metadata, context, dep }, null, 2)}</pre>
			</Box>
		</Box>
	);
}

const cors = (url: string) => `https://cors-anywhere.herokuapp.com/${url}`;

const getPack = async (name: string, version: string) => {
	const cleanVersion = version.replace(/[^\d.]/g, '');
	const url = `https://registry.npmjs.org/${name}/${cleanVersion}`;
	return axios.get<RawPack>(cors(url));
};

export interface StringKeyObject {
	[key: string]: any;
}

export interface Pack extends RawPack {
	usingVersion: string;
}

// from npm
export interface RawPack {
	name: string;
	version: string;
	description: string;
	keywords: string[];
	homepage: string;
	license: string;
	dependencies: StringKeyObject;
	devDependencies: StringKeyObject;
	peerDependencies: StringKeyObject;
}
