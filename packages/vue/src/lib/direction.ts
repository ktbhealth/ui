import { inject, provide, ref, type InjectionKey, type Ref } from "vue";
import { useDirection as useRekaDirection } from "reka-ui";

export type Direction = "ltr" | "rtl";

const directionKey: InjectionKey<Ref<Direction>> = Symbol("ktb:direction");

/** Provide text direction to descendants (Vue equivalent of direction provider). */
export function provideDirection(dir: Direction = "ltr"): Ref<Direction> {
	const direction = ref<Direction>(dir);
	provide(directionKey, direction);
	return direction;
}

/** Consume the nearest provided direction, falling back to reka-ui's direction or `fallback`. */
export function useDirection(fallback: Direction = "ltr"): Ref<Direction> {
	const local = inject(directionKey, null);
	const reka = useRekaDirection();
	return local ?? reka ?? ref(fallback);
}
