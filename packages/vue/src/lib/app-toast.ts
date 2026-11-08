export interface AppToastData {
	id: number;
	text: string;
	actionLabel?: string;
	onAction?: () => void;
}
