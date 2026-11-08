import { computed, inject, provide, ref, type InjectionKey, type Ref } from "vue";
import { useMediaQuery } from "@vueuse/core";

export interface SidebarContext {
	state: Ref<"expanded" | "collapsed">;
	open: Ref<boolean>;
	setOpen: (open: boolean) => void;
	isMobile: Ref<boolean>;
	toggleSidebar: () => void;
}

export const sidebarKey: InjectionKey<SidebarContext> = Symbol("ktb-sidebar");

export function useSidebar(): SidebarContext {
	const ctx = inject(sidebarKey);
	if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
	return ctx;
}

export function createSidebarContext(opts: {
	open?: boolean;
	defaultOpen?: boolean;
	openMobile?: boolean;
	defaultOpenMobile?: boolean;
}) {
	const isMobile = useMediaQuery("(max-width: 767px)");
	const open = ref(opts.open ?? opts.defaultOpen ?? true);
	const openMobile = ref(opts.openMobile ?? opts.defaultOpenMobile ?? false);
	const state = computed(() => (open.value ? "expanded" : "collapsed"));
	const effectiveOpen = computed(() => (isMobile.value ? openMobile.value : open.value));
	const setOpen = (v: boolean) => {
		if (isMobile.value) openMobile.value = v;
		else open.value = v;
	};
	const toggleSidebar = () => setOpen(!effectiveOpen.value);
	const ctx: SidebarContext = {
		state: state as Ref<"expanded" | "collapsed">,
		open: effectiveOpen as Ref<boolean>,
		setOpen,
		isMobile,
		toggleSidebar,
	};
	return ctx;
}
