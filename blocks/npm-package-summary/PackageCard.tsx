import { useEffect, useState } from 'react';
import { Pack } from './index';
import { Box, Heading, Text, BranchName } from '@primer/react';

export default function PackageCard({
	packKey,
	pack,
}: {
	packKey: string;
	pack: Pack;
}) {
	return (
		<Box key={packKey} mb={2}>
			<Box display='flex' alignItems='center'>
				<Box flexShrink={1} pr={2}>
					<Heading>{pack.name}</Heading>
				</Box>
				<Box>
					<BranchName>{pack.usingVersion}</BranchName>
				</Box>
			</Box>
			<Text>{pack.description}</Text>
		</Box>
	);
}
