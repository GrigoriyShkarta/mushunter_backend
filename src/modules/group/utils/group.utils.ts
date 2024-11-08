export const includeGroupRelations = {
	city: {
		select: {
			id: true,
			name: true,
		},
	},
	styles: {
		include: {
			style: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	},
	members: true,
};
