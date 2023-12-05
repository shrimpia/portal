// TODO: プロジェクト間で型を共有する
export type EventDto = {
	id: string;
	name: string;
	description: string;
	startDate: string;
	endDate: string | null;
	isAllDay: boolean;
	isOfficial: boolean;
	authorId: string;
	authorName: string | null;
	createdAt: string;
};

export type EventDraft = {
	name: string;
	startDate: Date;
	endDate: Date;
	isAllDay: boolean;
	description: string;
	isOfficial?: boolean;
};
