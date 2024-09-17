import { I18nService } from 'nestjs-i18n';

export const includeUserRelations = {
	city: {
		select: {
			id: true,
			name: true,
		},
	},
	skills: {
		include: {
			skill: {
				select: {
					id: true,
					name: true,
				},
			},
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
};

export const translateField = (i18n: I18nService, field: string, lang: string): string => {
	return i18n.t(`translation.${field}`, { lang });
};

export const formatSkills = (i18n: I18nService, skills: any[]): any[] => {
	return skills.map(({ skill, experience }) => ({
		id: skill.id,
		name: {
			en: translateField(i18n, `skill.${skill.name}`, 'en'),
			ua: translateField(i18n, `skill.${skill.name}`, 'ua'),
		},
		experience,
	}));
};

export const formatStyles = (styles: any[]): any[] => {
	return styles.map(({ style }) => ({
		id: style.id,
		name: style.name,
	}));
};
