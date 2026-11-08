export interface TurnstileApi {
	render: (
		el: HTMLElement,
		opts: {
			sitekey: string;
			theme?: string;
			size?: string;
			tabindex?: number;
			action?: string;
			cData?: string;
			callback?: (token: string) => void;
			"expired-callback"?: () => void;
			"error-callback"?: () => void;
		},
	) => string;
	remove: (id: string) => void;
}

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}
