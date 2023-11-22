export interface Event {
	id: string;
	name: string;
	description: string;
	start_date: string;
	end_date: string | null;
	is_all_day: boolean;
	is_official: boolean;
	author_id: string;
	created_at: string;
}
