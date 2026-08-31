import { c as useComponentProps, e as useAppConfig, j as useFieldGroup, k as useComponentIcons, t as tv, P as Primitive, b as _sfc_main$6, l as _sfc_main$4, f as useForwardProps, o as usePortal, i as useFormField, p as isArrayOfArray, F as FieldGroupReset, q as get, r as _sfc_main$5, s as defineKeyedFunctionFactory, v as dataDiagnostics, w as fetchDefaults, x as useAsyncData, y as useRequestFetch, z as isNullish, A as useCollection, n as looseToNumber, g as useForwardExpose, B as useId$1, C as getDisplayValue, T as Teleport_default, D as Presence_default, $ as $fetch$2, E as injectConfigProviderContext, m as createContext, V as VisuallyHidden_default, G as useForwardProps$1, H as useEmitAsProps, I as useBodyScrollLock, J as useHideOthers, K as FocusScope_default, L as DismissableLayer_default, M as getActiveElement, N as handleAndDispatchCustomEvent, O as focusFirst } from '../virtual/entry.mjs';
import { useSlots, computed, unref, mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, toRef, useTemplateRef, onScopeDispose, createTextVNode, Fragment, renderList, createVNode, resolveDynamicComponent, toValue, reactive, defineComponent, toRefs, ref, createElementBlock, withModifiers, normalizeProps, guardReactiveProps, watch, Teleport, createElementVNode, watchPostEffect, watchEffect, nextTick, normalizeStyle, withMemo, mergeDefaults, useSSRContext } from 'vue';
import { isPlainObject } from '@vue/shared';
import { C as defu, D as isEqual } from '../nitro/nitro.mjs';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { reactivePick, useVModel, unrefElement, useResizeObserver } from '@vueuse/core';
import { refAutoReset, isClient } from '@vueuse/shared';
import { offset, flip, shift, limitShift, size, arrow, hide, useFloating, autoUpdate } from '@floating-ui/vue';
import { fnv1a64Base36 } from 'fnv1a-64';
import { identify } from 'object-identity';

//#region node_modules/reka-ui/dist/shared/clamp.js
/**
* The `clamp` function restricts a number within a specified range by returning the value itself if it
* falls within the range, or the closest boundary value if it exceeds the range.
* @param {number} value - The `value` parameter represents the number that you want to clamp within
* the specified range defined by `min` and `max` values.
* @param {number} min - If the `value` parameter is less than the `min` value, the
* function will return the `min` value.
* @param {number} max - If the `value` parameter is greater than the `max` value,
* the function will return `max`.
* @returns The `clamp` function returns the value of `value` constrained within the range defined by
* `min` and `max`.
*/
function clamp(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useDirection.js
/**
* The `useDirection` function provides a way to access the current direction in your application.
* @param {Ref<Direction | undefined>} [dir] - An optional ref containing the direction (ltr or rtl).
* @returns  computed value that combines with the resolved direction.
*/
function useDirection(dir) {
	const context = injectConfigProviderContext({ dir: ref("ltr") });
	return computed(() => dir?.value || context.dir?.value || "ltr");
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useFocusGuards.js
/** Number of components which have requested interest to have focus guards */
var count = 0;
/**
* Injects a pair of focus guards at the edges of the whole DOM tree
* to ensure `focusin` & `focusout` events can be caught consistently.
*/
function useFocusGuards() {
	watchEffect((cleanupFn) => {
		if (!isClient) return;
		const edgeGuards = (void 0).querySelectorAll("[data-reka-focus-guard]");
		(void 0).body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
		(void 0).body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
		count++;
		cleanupFn(() => {
			if (count === 1) (void 0).querySelectorAll("[data-reka-focus-guard]").forEach((node) => node.remove());
			count--;
		});
	});
}
function createFocusGuard() {
	const element = (void 0).createElement("span");
	element.setAttribute("data-reka-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useFormControl.js
function useFormControl(el) {
	return computed(() => toValue(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useForwardPropsEmits.js
function useForwardPropsEmits(props, emit) {
	const parsedProps = useForwardProps$1(props);
	const emitsAsProps = emit ? useEmitAsProps(emit) : {};
	return computed(() => ({
		...parsedProps.value,
		...emitsAsProps
	}));
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useSize.js
function useSize(element) {
	const size = ref();
	return {
		width: computed(() => size.value?.width ?? 0),
		height: computed(() => size.value?.height ?? 0)
	};
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useTypeahead.js
function useTypeahead(callback) {
	const search = refAutoReset("", 1e3);
	const handleTypeaheadSearch = (key, items) => {
		search.value = search.value + key;
		{
			const currentItem = getActiveElement();
			const itemsWithTextValue = items.map((item) => ({
				...item,
				textValue: item.value?.textValue ?? item.ref.textContent?.trim() ?? ""
			}));
			const currentMatch = itemsWithTextValue.find((item) => item.ref === currentItem);
			const nextMatch = getNextMatch(itemsWithTextValue.map((item) => item.textValue), search.value, currentMatch?.textValue);
			const newItem = itemsWithTextValue.find((item) => item.textValue === nextMatch);
			if (newItem) newItem.ref.focus();
			return newItem?.ref;
		}
	};
	const resetTypeahead = () => {
		search.value = "";
	};
	return {
		search,
		handleTypeaheadSearch,
		resetTypeahead
	};
}
/**
* Wraps an array around itself at a given start index
* Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
*/
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
/**
* This is the "meat" of the typeahead matching logic. It takes in all the values,
* the search and the current match, and returns the next match (or `undefined`).
*
* We normalize the search because if a user has repeatedly pressed a character,
* we want the exact same behavior as if we only had that one character
* (ie. cycle through options starting with that character)
*
* We also reorder the values by wrapping the array around the current match.
* This is so we always look forward from the current match, and picking the first
* match will always be the correct one.
*
* Finally, if the normalized search is exactly one character, we exclude the
* current match from the values because otherwise it would be the first to match always
* and focus would never move. This is as opposed to the regular case, where we
* don't want focus to move if the current match still matches.
*/
function getNextMatch(values, search, currentMatch) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
//#endregion
//#region node_modules/reka-ui/dist/Popper/PopperRoot.js
var [injectPopperRootContext, providePopperRootContext] = /*#__PURE__*/ createContext("PopperRoot");
var PopperRoot_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "PopperRoot",
	setup(__props) {
		const anchor = ref();
		providePopperRootContext({
			anchor,
			onAnchorChange: (element) => anchor.value = element
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Popper/PopperAnchor.js
var PopperAnchor_default = /* @__PURE__ */ defineComponent({
	__name: "PopperAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectPopperRootContext();
		watchPostEffect(() => {
			rootContext.onAnchorChange(props.reference ?? currentElement.value);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				ref: unref(forwardRef),
				as: _ctx.as,
				"as-child": _ctx.asChild
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["as", "as-child"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/component/Arrow.js
var _hoisted_1$3 = {
	key: 0,
	d: "M0 0L6 6L12 0"
};
var _hoisted_2 = {
	key: 1,
	d: "M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0"
};
var Arrow_default = /* @__PURE__ */ defineComponent({
	__name: "Arrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				width: _ctx.width,
				height: _ctx.height,
				viewBox: _ctx.asChild ? void 0 : "0 0 12 6",
				preserveAspectRatio: _ctx.asChild ? void 0 : "none"
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [!_ctx.rounded ? (openBlock(), createElementBlock("path", _hoisted_1$3)) : (openBlock(), createElementBlock("path", _hoisted_2))])]),
				_: 3
			}, 16, [
				"width",
				"height",
				"viewBox",
				"preserveAspectRatio"
			]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Popper/utils.js
function isNotNull(value) {
	return value !== null;
}
function transformOrigin(options) {
	return {
		name: "transformOrigin",
		options,
		fn(data) {
			const { placement, rects, middlewareData } = data;
			const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const noArrowAlignX = {
				start: options.dir === "rtl" ? "100%" : "0%",
				center: "50%",
				end: options.dir === "rtl" ? "0%" : "100%"
			}[placedAlign];
			const noArrowAlignY = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[placedAlign];
			const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
			const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
			let x = "";
			let y = "";
			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
			}
			return { data: {
				x,
				y
			} };
		}
	};
}
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
//#endregion
//#region node_modules/reka-ui/dist/Popper/PopperContent.js
var _hoisted_1$2 = ["dir"];
var PopperContentPropsDefaultValue = {
	side: "bottom",
	sideOffset: 0,
	sideFlip: true,
	align: "center",
	alignOffset: 0,
	alignFlip: true,
	arrowPadding: 0,
	hideShiftedArrow: true,
	avoidCollisions: true,
	collisionBoundary: () => [],
	collisionPadding: 0,
	sticky: "partial",
	hideWhenDetached: false,
	positionStrategy: "fixed",
	updatePositionStrategy: "optimized",
	prioritizePosition: false
};
var [injectPopperContentContext, providePopperContentContext] = /*#__PURE__*/ createContext("PopperContent");
var PopperContent_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "PopperContent",
	props: /* @__PURE__ */ mergeDefaults({
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	}, { ...PopperContentPropsDefaultValue }),
	emits: ["placed"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectPopperRootContext();
		const { forwardRef, currentElement: contentElement } = useForwardExpose();
		const dir = useDirection(computed(() => props.dir));
		const floatingRef = ref();
		const arrow$1 = ref();
		const { width: arrowWidth, height: arrowHeight } = useSize();
		const desiredPlacement = computed(() => props.side + (props.align !== "center" ? `-${props.align}` : ""));
		const collisionPadding = computed(() => {
			return typeof props.collisionPadding === "number" ? props.collisionPadding : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				...props.collisionPadding
			};
		});
		const boundary = computed(() => {
			return Array.isArray(props.collisionBoundary) ? props.collisionBoundary : [props.collisionBoundary];
		});
		const detectOverflowOptions = computed(() => {
			return {
				padding: collisionPadding.value,
				boundary: boundary.value.filter(isNotNull),
				altBoundary: boundary.value.length > 0
			};
		});
		const flipOptions = computed(() => {
			return {
				mainAxis: props.sideFlip,
				crossAxis: props.alignFlip
			};
		});
		const computedMiddleware = computed(() => {
			return [
				offset({
					mainAxis: props.sideOffset + arrowHeight.value,
					alignmentAxis: props.alignOffset
				}),
				props.prioritizePosition && props.avoidCollisions && flip({
					...detectOverflowOptions.value,
					...flipOptions.value
				}),
				props.avoidCollisions && shift({
					mainAxis: true,
					crossAxis: !!props.prioritizePosition,
					limiter: props.sticky === "partial" ? limitShift() : void 0,
					...detectOverflowOptions.value
				}),
				!props.prioritizePosition && props.avoidCollisions && flip({
					...detectOverflowOptions.value,
					...flipOptions.value
				}),
				size({
					...detectOverflowOptions.value,
					apply: ({ elements, rects, availableWidth, availableHeight }) => {
						const { width: anchorWidth, height: anchorHeight } = rects.reference;
						const contentStyle = elements.floating.style;
						contentStyle.setProperty("--reka-popper-available-width", `${availableWidth}px`);
						contentStyle.setProperty("--reka-popper-available-height", `${availableHeight}px`);
						contentStyle.setProperty("--reka-popper-anchor-width", `${anchorWidth}px`);
						contentStyle.setProperty("--reka-popper-anchor-height", `${anchorHeight}px`);
					}
				}),
				arrow$1.value && arrow({
					element: arrow$1.value,
					padding: props.arrowPadding
				}),
				transformOrigin({
					arrowWidth: arrowWidth.value,
					arrowHeight: arrowHeight.value,
					dir: dir.value
				}),
				props.hideWhenDetached && hide({
					strategy: "referenceHidden",
					...detectOverflowOptions.value
				})
			];
		});
		const reference = computed(() => props.reference ?? rootContext.anchor.value);
		const { floatingStyles, placement, isPositioned, middlewareData, update } = useFloating(reference, floatingRef, {
			strategy: props.positionStrategy,
			placement: desiredPlacement,
			whileElementsMounted: (...args) => {
				return autoUpdate(...args, {
					layoutShift: !props.disableUpdateOnLayoutShift,
					animationFrame: props.updatePositionStrategy === "always"
				});
			},
			middleware: computedMiddleware
		});
		const placedSide = computed(() => getSideAndAlignFromPlacement(placement.value)[0]);
		const placedAlign = computed(() => getSideAndAlignFromPlacement(placement.value)[1]);
		watchPostEffect(() => {
			if (isPositioned.value) emits("placed");
		});
		const shouldHideArrow = computed(() => {
			const cannotCenterArrow = middlewareData.value.arrow?.centerOffset !== 0;
			return props.hideShiftedArrow && cannotCenterArrow;
		});
		const contentZIndex = ref("");
		watchEffect(() => {
			if (contentElement.value) contentZIndex.value = (void 0).getComputedStyle(contentElement.value).zIndex;
		});
		providePopperContentContext({
			placedSide,
			onArrowChange: (element) => arrow$1.value = element,
			arrowX: computed(() => middlewareData.value.arrow?.x ?? 0),
			arrowY: computed(() => middlewareData.value.arrow?.y ?? 0),
			shouldHideArrow
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "floatingRef",
				ref: floatingRef,
				"data-reka-popper-content-wrapper": "",
				dir: unref(dir),
				style: normalizeStyle({
					...unref(floatingStyles),
					transform: unref(isPositioned) ? unref(floatingStyles).transform : "translate(0, -200%)",
					minWidth: "max-content",
					zIndex: contentZIndex.value,
					["--reka-popper-transform-origin"]: [unref(middlewareData).transformOrigin?.x, unref(middlewareData).transformOrigin?.y].join(" "),
					...unref(middlewareData).hide?.referenceHidden && {
						visibility: "hidden",
						pointerEvents: "none"
					}
				})
			}, [props.memoDependencies ? withMemo([
				props.asChild,
				props.as,
				placedSide.value,
				placedAlign.value,
				unref(isPositioned),
				...Object.values(_ctx.$attrs),
				...props.memoDependencies
			], () => (openBlock(), createBlock(unref(Primitive), mergeProps({
				key: 0,
				ref: unref(forwardRef)
			}, _ctx.$attrs, {
				"as-child": props.asChild,
				as: props.as,
				"data-side": placedSide.value,
				"data-align": placedAlign.value,
				style: { animation: !unref(isPositioned) ? "none" : void 0 }
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as-child",
				"as",
				"data-side",
				"data-align",
				"style"
			])), _cache, 0) : (openBlock(), createBlock(unref(Primitive), mergeProps({
				key: 1,
				ref: unref(forwardRef)
			}, _ctx.$attrs, {
				"as-child": props.asChild,
				as: props.as,
				"data-side": placedSide.value,
				"data-align": placedAlign.value,
				dir: unref(dir),
				style: { animation: !unref(isPositioned) ? "none" : void 0 }
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as-child",
				"as",
				"data-side",
				"data-align",
				"dir",
				"style"
			]))], 12, _hoisted_1$2);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Popper/PopperArrow.js
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var PopperArrow_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "PopperArrow",
	props: {
		width: {
			type: Number,
			required: false
		},
		height: {
			type: Number,
			required: false
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const { forwardRef } = useForwardExpose();
		const contentContext = injectPopperContentContext();
		const baseSide = computed(() => OPPOSITE_SIDE[contentContext.placedSide.value]);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				ref: (el) => {
					unref(contentContext).onArrowChange(el ?? void 0);
				},
				style: normalizeStyle({
					position: "absolute",
					left: unref(contentContext).arrowX?.value ? `${unref(contentContext).arrowX?.value}px` : void 0,
					top: unref(contentContext).arrowY?.value ? `${unref(contentContext).arrowY?.value}px` : void 0,
					[baseSide.value]: 0,
					transformOrigin: {
						top: "",
						right: "0 0",
						bottom: "center 0",
						left: "100% 0"
					}[unref(contentContext).placedSide.value],
					transform: {
						top: "translateY(100%)",
						right: "translateY(50%) rotate(90deg) translateX(-50%)",
						bottom: `rotate(180deg)`,
						left: "translateY(50%) rotate(-90deg) translateX(50%)"
					}[unref(contentContext).placedSide.value],
					visibility: unref(contentContext).shouldHideArrow.value ? "hidden" : void 0
				})
			}, [createVNode(Arrow_default, mergeProps(_ctx.$attrs, {
				ref: unref(forwardRef),
				style: { display: "block" },
				as: _ctx.as,
				"as-child": _ctx.asChild,
				rounded: _ctx.rounded,
				width: _ctx.width,
				height: _ctx.height
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as",
				"as-child",
				"rounded",
				"width",
				"height"
			])], 4);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/shared/useNonce.js
function useNonce(nonce) {
	const context = injectConfigProviderContext({ nonce: ref() });
	return computed(() => nonce?.value || context.nonce?.value);
}
//#endregion
//#region node_modules/reka-ui/dist/Select/utils.js
var OPEN_KEYS = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
];
var SELECTION_KEYS = [" ", "Enter"];
function valueComparator(value, currentValue, comparator) {
	if (value === void 0) return false;
	else if (Array.isArray(value)) return value.some((val) => compare(val, currentValue, comparator));
	else return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
	if (value === void 0 || currentValue === void 0) return false;
	if (typeof value === "string") return value === currentValue;
	if (typeof comparator === "function") return comparator(value, currentValue);
	if (typeof comparator === "string") return value?.[comparator] === currentValue?.[comparator];
	return isEqual(value, currentValue);
}
function shouldShowPlaceholder(value) {
	return value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
}
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectRoot.js
var _hoisted_1$1 = ["value"];
var [injectSelectRootContext, provideSelectRootContext] = /*#__PURE__*/ createContext("SelectRoot");
var SelectRoot_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "SelectRoot",
	props: {
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelValue: {
			type: null,
			required: false,
			default: void 0
		},
		nullableValue: {
			type: String,
			required: false,
			default: ""
		},
		by: {
			type: [String, Function],
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		autocomplete: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		}
	},
	emits: ["update:modelValue", "update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { required, disabled, multiple, dir: propDir } = toRefs(props);
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
			passive: props.modelValue === void 0,
			deep: true
		});
		const open = useVModel(props, "open", emits, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		const triggerElement = ref();
		const valueElement = ref();
		const triggerPointerDownPosRef = ref({
			x: 0,
			y: 0
		});
		const isEmptyModelValue = computed(() => {
			if (multiple.value && Array.isArray(modelValue.value)) return modelValue.value?.length === 0;
			else return isNullish(modelValue.value);
		});
		useCollection({ isProvider: true });
		const dir = useDirection(propDir);
		const isFormControl = useFormControl(triggerElement);
		const optionsSet = ref(/* @__PURE__ */ new Set());
		const nativeSelectKey = computed(() => {
			return Array.from(optionsSet.value).map((option) => option.value).join(";");
		});
		function handleValueChange(value) {
			if (multiple.value) {
				const array = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
				const index = array.findIndex((i) => compare(i, value, props.by));
				index === -1 ? array.push(value) : array.splice(index, 1);
				modelValue.value = [...array];
			} else modelValue.value = value;
		}
		function getOption(value) {
			return Array.from(optionsSet.value).find((option) => valueComparator(value, option.value, props.by));
		}
		provideSelectRootContext({
			triggerElement,
			onTriggerChange: (node) => {
				triggerElement.value = node;
			},
			valueElement,
			onValueElementChange: (node) => {
				valueElement.value = node;
			},
			contentId: "",
			modelValue,
			onValueChange: handleValueChange,
			by: props.by,
			open,
			multiple,
			required,
			onOpenChange: (value) => {
				open.value = value;
			},
			dir,
			triggerPointerDownPosRef,
			disabled,
			isEmptyModelValue,
			optionsSet,
			onOptionAdd: (option) => {
				const existingOption = getOption(option.value);
				if (existingOption) optionsSet.value.delete(existingOption);
				optionsSet.value.add(option);
			},
			onOptionRemove: (option) => {
				const existingOption = getOption(option.value);
				if (existingOption) optionsSet.value.delete(existingOption);
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperRoot_default), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
					modelValue: unref(modelValue),
					open: unref(open)
				}), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(BubbleSelect_default, {
					key: nativeSelectKey.value,
					"aria-hidden": "true",
					tabindex: "-1",
					multiple: unref(multiple),
					required: unref(required),
					name: _ctx.name,
					autocomplete: _ctx.autocomplete,
					disabled: unref(disabled),
					value: unref(modelValue)
				}, {
					default: withCtx(() => [unref(isNullish)(unref(modelValue)) ? (openBlock(), createElementBlock("option", {
						key: 0,
						value: _ctx.nullableValue
					}, null, 8, _hoisted_1$1)) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(Array.from(optionsSet.value), (option) => {
						return openBlock(), createElementBlock("option", mergeProps({ key: option.value ?? "" }, { ref_for: true }, option), null, 16);
					}), 128))]),
					_: 1
				}, 8, [
					"multiple",
					"required",
					"name",
					"autocomplete",
					"disabled",
					"value"
				])) : createCommentVNode("v-if", true)]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/BubbleSelect.js
var BubbleSelect_default = /* @__PURE__ */ defineComponent({
	__name: "BubbleSelect",
	props: {
		autocomplete: {
			type: String,
			required: false
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		form: {
			type: String,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		size: {
			type: Number,
			required: false
		},
		value: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const selectElement = ref();
		const rootContext = injectSelectRootContext();
		watch(() => props.value, (cur, prev) => {
			const selectProto = (void 0).HTMLSelectElement.prototype;
			const setValue = Object.getOwnPropertyDescriptor(selectProto, "value").set;
			if (cur !== prev && setValue && selectElement.value) {
				const event = new Event("change", { bubbles: true });
				setValue.call(selectElement.value, cur);
				selectElement.value.dispatchEvent(event);
			}
		});
		/**
		* Form autofill will trigger an `input` event on the `select` element.
		* We listen to that event and update our internal state to support it.
		*/
		function handleInput(event) {
			rootContext.onValueChange(event.target.value);
		}
		/**
		* We purposefully use a `select` here to support form autofill as much
		* as possible.
		*
		* We purposefully do not add the `value` attribute here to allow the value
		* to be set programmatically and bubble to any parent form `onChange` event.
		*
		* We use `VisuallyHidden` rather than `display: "none"` because Safari autofill
		* won't work otherwise.
		*/
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(VisuallyHidden_default), { "as-child": "" }, {
				default: withCtx(() => [createElementVNode("select", mergeProps({
					ref_key: "selectElement",
					ref: selectElement
				}, props, { onInput: handleInput }), [renderSlot(_ctx.$slots, "default")], 16)]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectPopperPosition.js
var SelectPopperPosition_default = /* @__PURE__ */ defineComponent({
	__name: "SelectPopperPosition",
	props: {
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false,
			default: "start"
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false,
			default: 10
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const forwarded = useForwardProps$1(__props);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperContent_default), mergeProps(unref(forwarded), { style: {
				"boxSizing": "border-box",
				"--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
				"--reka-select-content-available-width": "var(--reka-popper-available-width)",
				"--reka-select-content-available-height": "var(--reka-popper-available-height)",
				"--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
				"--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
			} }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectContentImpl.js
var SelectContentDefaultContextValue = {
	onViewportChange: () => {},
	itemTextRefCallback: () => {},
	itemRefCallback: () => {}
};
var [injectSelectContentContext, provideSelectContentContext] = /*#__PURE__*/ createContext("SelectContent");
var SelectContentImpl_default = /* @__PURE__ */ defineComponent({
	__name: "SelectContentImpl",
	props: {
		position: {
			type: String,
			required: false,
			default: "item-aligned"
		},
		bodyLock: {
			type: Boolean,
			required: false,
			default: true
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false,
			default: "start"
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: [
		"closeAutoFocus",
		"escapeKeyDown",
		"pointerDownOutside"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectSelectRootContext();
		useFocusGuards();
		useBodyScrollLock(props.bodyLock);
		const { CollectionSlot, getItems } = useCollection();
		const content = ref();
		useHideOthers(content);
		const { search, handleTypeaheadSearch } = useTypeahead();
		const viewport = ref();
		const selectedItem = ref();
		const selectedItemText = ref();
		const isPositioned = ref(false);
		const firstValidItemFoundRef = ref(false);
		const firstSelectedItemInArrayFoundRef = ref(false);
		function focusSelectedItem() {
			if (selectedItem.value && content.value) focusFirst([selectedItem.value, content.value]);
		}
		watch(isPositioned, () => {
			focusSelectedItem();
		});
		const { onOpenChange, triggerPointerDownPosRef } = rootContext;
		watchEffect((cleanupFn) => {
			if (!content.value) return;
			let pointerMoveDelta = {
				x: 0,
				y: 0
			};
			const handlePointerMove = (event) => {
				pointerMoveDelta = {
					x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.value?.x ?? 0)),
					y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.value?.y ?? 0))
				};
			};
			const handlePointerUp = (event) => {
				if (event.pointerType === "touch") return;
				if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
				else if (!content.value?.contains(event.target)) onOpenChange(false);
				(void 0).removeEventListener("pointermove", handlePointerMove);
				triggerPointerDownPosRef.value = null;
			};
			if (triggerPointerDownPosRef.value !== null) {
				(void 0).addEventListener("pointermove", handlePointerMove);
				(void 0).addEventListener("pointerup", handlePointerUp, {
					capture: true,
					once: true
				});
			}
			cleanupFn(() => {
				(void 0).removeEventListener("pointermove", handlePointerMove);
				(void 0).removeEventListener("pointerup", handlePointerUp, { capture: true });
			});
		});
		function handleKeyDown(event) {
			const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
			if (event.key === "Tab") event.preventDefault();
			if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key, getItems());
			if ([
				"ArrowUp",
				"ArrowDown",
				"Home",
				"End"
			].includes(event.key)) {
				let candidateNodes = [...getItems().map((i) => i.ref)];
				if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
				if (["ArrowUp", "ArrowDown"].includes(event.key)) {
					const currentElement = event.target;
					const currentIndex = candidateNodes.indexOf(currentElement);
					candidateNodes = candidateNodes.slice(currentIndex + 1);
				}
				setTimeout(() => focusFirst(candidateNodes));
				event.preventDefault();
			}
		}
		const pickedProps = computed(() => {
			if (props.position === "popper") return props;
			else return {};
		});
		const forwardedProps = useForwardProps$1(pickedProps.value);
		provideSelectContentContext({
			content,
			viewport,
			onViewportChange: (node) => {
				viewport.value = node;
			},
			itemRefCallback: (node, value, disabled) => {
				const isFirstValidItem = !firstValidItemFoundRef.value && !disabled;
				const isSelectedItem = valueComparator(rootContext.modelValue.value, value, rootContext.by);
				if (rootContext.multiple.value) {
					if (firstSelectedItemInArrayFoundRef.value) return;
					if (isSelectedItem || isFirstValidItem) {
						selectedItem.value = node;
						if (isSelectedItem) firstSelectedItemInArrayFoundRef.value = true;
					}
				} else if (isSelectedItem || isFirstValidItem) selectedItem.value = node;
				if (isFirstValidItem) firstValidItemFoundRef.value = true;
			},
			selectedItem,
			selectedItemText,
			onItemLeave: () => {
				content.value?.focus();
			},
			itemTextRefCallback: (node, value, disabled) => {
				const isFirstValidItem = !firstValidItemFoundRef.value && !disabled;
				if (valueComparator(rootContext.modelValue.value, value, rootContext.by) || isFirstValidItem) selectedItemText.value = node;
			},
			focusSelectedItem,
			position: props.position,
			isPositioned,
			searchRef: search
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollectionSlot), null, {
				default: withCtx(() => [createVNode(unref(FocusScope_default), {
					"as-child": "",
					onMountAutoFocus: _cache[6] || (_cache[6] = withModifiers(() => {}, ["prevent"])),
					onUnmountAutoFocus: _cache[7] || (_cache[7] = (event) => {
						emits("closeAutoFocus", event);
						if (event.defaultPrevented) return;
						unref(rootContext).triggerElement.value?.focus({ preventScroll: true });
						event.preventDefault();
					})
				}, {
					default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
						"as-child": "",
						"disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
						onFocusOutside: _cache[2] || (_cache[2] = withModifiers(() => {}, ["prevent"])),
						onDismiss: _cache[3] || (_cache[3] = ($event) => unref(rootContext).onOpenChange(false)),
						onEscapeKeyDown: _cache[4] || (_cache[4] = ($event) => emits("escapeKeyDown", $event)),
						onPointerDownOutside: _cache[5] || (_cache[5] = ($event) => emits("pointerDownOutside", $event))
					}, {
						default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.position === "popper" ? SelectPopperPosition_default : SelectItemAlignedPosition_default), mergeProps({
							..._ctx.$attrs,
							...unref(forwardedProps)
						}, {
							id: unref(rootContext).contentId,
							ref: (vnode) => {
								if (!vnode) return void 0;
								const el = unref(unrefElement)(vnode);
								if (el?.hasAttribute("data-reka-popper-content-wrapper")) content.value = el.firstElementChild;
								else content.value = el;
							},
							role: "listbox",
							"data-state": unref(rootContext).open.value ? "open" : "closed",
							dir: unref(rootContext).dir.value,
							style: {
								display: "flex",
								flexDirection: "column",
								outline: "none"
							},
							onContextmenu: _cache[0] || (_cache[0] = withModifiers(() => {}, ["prevent"])),
							onPlaced: _cache[1] || (_cache[1] = ($event) => isPositioned.value = true),
							onKeydown: handleKeyDown
						}), {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 3
						}, 16, [
							"id",
							"data-state",
							"dir",
							"onKeydown"
						]))]),
						_: 3
					}, 8, ["disable-outside-pointer-events"])]),
					_: 3
				})]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectItemAlignedPosition.js
var [injectSelectItemAlignedPositionContext, provideSelectItemAlignedPositionContext] = /*#__PURE__*/ createContext("SelectItemAlignedPosition");
var SelectItemAlignedPosition_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "SelectItemAlignedPosition",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["placed"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { getItems } = useCollection();
		const rootContext = injectSelectRootContext();
		const contentContext = injectSelectContentContext();
		const shouldExpandOnScrollRef = ref(false);
		const shouldRepositionRef = ref(true);
		const contentWrapperElement = ref();
		const { forwardRef, currentElement: contentElement } = useForwardExpose();
		const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
		function position() {
			if (rootContext.triggerElement.value && rootContext.valueElement.value && contentWrapperElement.value && contentElement.value && viewport?.value && selectedItem?.value && selectedItemText?.value) {
				const triggerRect = rootContext.triggerElement.value.getBoundingClientRect();
				const contentRect = contentElement.value.getBoundingClientRect();
				const valueNodeRect = rootContext.valueElement.value.getBoundingClientRect();
				const itemTextRect = selectedItemText.value.getBoundingClientRect();
				if (rootContext.dir.value !== "rtl") {
					const itemTextOffset = itemTextRect.left - contentRect.left;
					const left = valueNodeRect.left - itemTextOffset;
					const leftDelta = triggerRect.left - left;
					const minContentWidth = triggerRect.width + leftDelta;
					const contentWidth = Math.max(minContentWidth, contentRect.width);
					const rightEdge = (void 0).innerWidth - 10;
					const clampedLeft = clamp(left, 10, Math.max(10, rightEdge - contentWidth));
					contentWrapperElement.value.style.minWidth = `${minContentWidth}px`;
					contentWrapperElement.value.style.left = `${clampedLeft}px`;
				} else {
					const itemTextOffset = contentRect.right - itemTextRect.right;
					const right = (void 0).innerWidth - valueNodeRect.right - itemTextOffset;
					const rightDelta = (void 0).innerWidth - triggerRect.right - right;
					const minContentWidth = triggerRect.width + rightDelta;
					const contentWidth = Math.max(minContentWidth, contentRect.width);
					const leftEdge = (void 0).innerWidth - 10;
					const clampedRight = clamp(right, 10, Math.max(10, leftEdge - contentWidth));
					contentWrapperElement.value.style.minWidth = `${minContentWidth}px`;
					contentWrapperElement.value.style.right = `${clampedRight}px`;
				}
				const items = getItems().map((i) => i.ref);
				const availableHeight = (void 0).innerHeight - 20;
				const itemsHeight = viewport.value.scrollHeight;
				const contentStyles = (void 0).getComputedStyle(contentElement.value);
				const contentBorderTopWidth = Number.parseInt(contentStyles.borderTopWidth, 10);
				const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10);
				const contentBorderBottomWidth = Number.parseInt(contentStyles.borderBottomWidth, 10);
				const contentPaddingBottom = Number.parseInt(contentStyles.paddingBottom, 10);
				const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
				const minContentHeight = Math.min(selectedItem.value.offsetHeight * 5, fullContentHeight);
				const viewportStyles = (void 0).getComputedStyle(viewport.value);
				const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10);
				const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10);
				const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - 10;
				const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
				const selectedItemHalfHeight = selectedItem.value.offsetHeight / 2;
				const itemOffsetMiddle = selectedItem.value.offsetTop + selectedItemHalfHeight;
				const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
				const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
				if (contentTopToItemMiddle <= topEdgeToTriggerMiddle) {
					const isLastItem = selectedItem.value === items.at(-1);
					contentWrapperElement.value.style.bottom = `0px`;
					const viewportOffsetBottom = contentElement.value.clientHeight - viewport.value.offsetTop - viewport.value.offsetHeight;
					const height = contentTopToItemMiddle + Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
					contentWrapperElement.value.style.height = `${height}px`;
				} else {
					const isFirstItem = selectedItem.value === items[0];
					contentWrapperElement.value.style.top = `0px`;
					const height = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.value.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight) + itemMiddleToContentBottom;
					contentWrapperElement.value.style.height = `${height}px`;
					viewport.value.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.value.offsetTop;
				}
				contentWrapperElement.value.style.margin = `10px 0`;
				contentWrapperElement.value.style.minHeight = `${minContentHeight}px`;
				contentWrapperElement.value.style.maxHeight = `${availableHeight}px`;
				emits("placed");
				requestAnimationFrame(() => shouldExpandOnScrollRef.value = true);
			}
		}
		const contentZIndex = ref("");
		function handleScrollButtonChange(node) {
			if (node && shouldRepositionRef.value === true) {
				position();
				focusSelectedItem?.();
				shouldRepositionRef.value = false;
			}
		}
		useResizeObserver(rootContext.triggerElement, () => {
			position();
		});
		provideSelectItemAlignedPositionContext({
			contentWrapper: contentWrapperElement,
			shouldExpandOnScrollRef,
			onScrollButtonChange: handleScrollButtonChange
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "contentWrapperElement",
				ref: contentWrapperElement,
				style: normalizeStyle({
					display: "flex",
					flexDirection: "column",
					position: "fixed",
					zIndex: contentZIndex.value
				})
			}, [createVNode(unref(Primitive), mergeProps({
				ref: unref(forwardRef),
				style: {
					boxSizing: "border-box",
					maxHeight: "100%"
				}
			}, {
				..._ctx.$attrs,
				...props
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16)], 4);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectArrow.js
var SelectArrow_default = /* @__PURE__ */ defineComponent({
	__name: "SelectArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		const contentContext = injectSelectContentContext(SelectContentDefaultContextValue);
		return (_ctx, _cache) => {
			return unref(contentContext).position === "popper" ? (openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(mergeProps({ key: 0 }, props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectProvider.js
var SelectProvider_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "SelectProvider",
	props: { context: {
		type: Object,
		required: true
	} },
	setup(__props) {
		provideSelectRootContext(__props.context);
		provideSelectContentContext(SelectContentDefaultContextValue);
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectContent.js
var _hoisted_1 = { key: 1 };
var SelectContent_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "SelectContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		position: {
			type: String,
			required: false
		},
		bodyLock: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"closeAutoFocus",
		"escapeKeyDown",
		"pointerDownOutside"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const forwarded = useForwardPropsEmits(props, __emit);
		const rootContext = injectSelectRootContext();
		const fragment = ref();
		const presenceRef = ref();
		const present = computed(() => props.forceMount || rootContext.open.value);
		const renderPresence = ref(present.value);
		let renderPresenceTimeout;
		function clearRenderPresenceTimeout() {
			if (renderPresenceTimeout) {
				clearTimeout(renderPresenceTimeout);
				renderPresenceTimeout = void 0;
			}
		}
		watch(present, (_value, _oldValue, onCleanup) => {
			clearRenderPresenceTimeout();
			renderPresenceTimeout = setTimeout(() => {
				renderPresence.value = present.value;
				renderPresenceTimeout = void 0;
			});
			onCleanup(clearRenderPresenceTimeout);
		});
		return (_ctx, _cache) => {
			return present.value || renderPresence.value || presenceRef.value?.present ? (openBlock(), createBlock(unref(Presence_default), {
				key: 0,
				ref_key: "presenceRef",
				ref: presenceRef,
				present: present.value
			}, {
				default: withCtx(() => [createVNode(SelectContentImpl_default, normalizeProps(guardReactiveProps({
					...unref(forwarded),
					..._ctx.$attrs
				})), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16)]),
				_: 3
			}, 8, ["present"])) : fragment.value ? (openBlock(), createElementBlock("div", _hoisted_1, [(openBlock(), createBlock(Teleport, { to: fragment.value }, [createVNode(SelectProvider_default, { context: unref(rootContext) }, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["context"])], 8, ["to"]))])) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectGroup.js
var [injectSelectGroupContext, provideSelectGroupContext] = /*#__PURE__*/ createContext("SelectGroup");
var SelectGroup_default = /* @__PURE__ */ defineComponent({
	__name: "SelectGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const id = useId$1(void 0, "reka-select-group");
		provideSelectGroupContext({ id });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({ role: "group" }, props, { "aria-labelledby": unref(id) }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["aria-labelledby"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectItem.js
var [injectSelectItemContext, provideSelectItemContext] = /*#__PURE__*/ createContext("SelectItem");
var SelectItem_default = /* @__PURE__ */ defineComponent({
	__name: "SelectItem",
	props: {
		value: {
			type: null,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { disabled } = toRefs(props);
		const rootContext = injectSelectRootContext();
		const contentContext = injectSelectContentContext();
		const { forwardRef} = useForwardExpose();
		const { CollectionItem } = useCollection();
		const isSelected = computed(() => valueComparator(rootContext.modelValue?.value, props.value, rootContext.by));
		const isFocused = ref(false);
		const textValue = ref(props.textValue ?? "");
		const textId = useId$1(void 0, "reka-select-item-text");
		const SELECT_SELECT = "select.select";
		async function handleSelectCustomEvent(ev) {
			if (ev.defaultPrevented) return;
			const eventDetail = {
				originalEvent: ev,
				value: props.value
			};
			handleAndDispatchCustomEvent(SELECT_SELECT, handleSelect, eventDetail);
		}
		async function handleSelect(ev) {
			await nextTick();
			emits("select", ev);
			if (ev.defaultPrevented) return;
			if (!disabled.value) {
				rootContext.onValueChange(props.value);
				if (!rootContext.multiple.value) rootContext.onOpenChange(false);
			}
		}
		async function handlePointerMove(event) {
			await nextTick();
			if (event.defaultPrevented) return;
			if (disabled.value) contentContext.onItemLeave?.();
			else event.currentTarget?.focus({ preventScroll: true });
		}
		async function handlePointerLeave(event) {
			await nextTick();
			if (event.defaultPrevented) return;
			if (event.currentTarget === getActiveElement()) contentContext.onItemLeave?.();
		}
		async function handleKeyDown(event) {
			await nextTick();
			if (event.defaultPrevented) return;
			if (contentContext.searchRef?.value !== "" && event.key === " ") return;
			if (SELECTION_KEYS.includes(event.key)) handleSelectCustomEvent(event);
			if (event.key === " ") event.preventDefault();
		}
		if (props.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
		provideSelectItemContext({
			value: props.value,
			disabled,
			textId,
			isSelected,
			onItemTextChange: (node) => {
				textValue.value = ((textValue.value || node?.textContent) ?? "").trim();
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollectionItem), { value: { textValue: textValue.value } }, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					ref: unref(forwardRef),
					role: "option",
					"aria-labelledby": unref(textId),
					"data-highlighted": isFocused.value ? "" : void 0,
					"aria-selected": isSelected.value,
					"data-state": isSelected.value ? "checked" : "unchecked",
					"aria-disabled": unref(disabled) || void 0,
					"data-disabled": unref(disabled) ? "" : void 0,
					tabindex: unref(disabled) ? void 0 : -1,
					as: _ctx.as,
					"as-child": _ctx.asChild,
					onFocus: _cache[0] || (_cache[0] = ($event) => isFocused.value = true),
					onBlur: _cache[1] || (_cache[1] = ($event) => isFocused.value = false),
					onPointerup: handleSelectCustomEvent,
					onPointerdown: _cache[2] || (_cache[2] = (event) => {
						event.currentTarget.focus({ preventScroll: true });
					}),
					onTouchend: _cache[3] || (_cache[3] = withModifiers(() => {}, ["prevent", "stop"])),
					onPointermove: handlePointerMove,
					onPointerleave: handlePointerLeave,
					onKeydown: handleKeyDown
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"aria-labelledby",
					"data-highlighted",
					"aria-selected",
					"data-state",
					"aria-disabled",
					"data-disabled",
					"tabindex",
					"as",
					"as-child"
				])]),
				_: 3
			}, 8, ["value"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectItemIndicator.js
var SelectItemIndicator_default = /* @__PURE__ */ defineComponent({
	__name: "SelectItemIndicator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		const props = __props;
		const itemContext = injectSelectItemContext();
		return (_ctx, _cache) => {
			return unref(itemContext).isSelected.value ? (openBlock(), createBlock(unref(Primitive), mergeProps({
				key: 0,
				"aria-hidden": "true"
			}, props), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectItemText.js
var SelectItemText_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "SelectItemText",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		const props = __props;
		injectSelectRootContext();
		injectSelectContentContext();
		const itemContext = injectSelectItemContext();
		const { forwardRef, currentElement: itemTextElement } = useForwardExpose();
		computed(() => {
			return {
				value: itemContext.value,
				disabled: itemContext.disabled.value,
				textContent: itemTextElement.value?.textContent ?? itemContext.value?.toString() ?? ""
			};
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({
				id: unref(itemContext).textId,
				ref: unref(forwardRef)
			}, {
				...props,
				..._ctx.$attrs
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectLabel.js
var SelectLabel_default = /* @__PURE__ */ defineComponent({
	__name: "SelectLabel",
	props: {
		for: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "div"
		}
	},
	setup(__props) {
		const props = __props;
		const groupContext = injectSelectGroupContext({ id: "" });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).id }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectPortal.js
var SelectPortal_default = /* @__PURE__ */ defineComponent({
	__name: "SelectPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectSeparator.js
var SelectSeparator_default = /* @__PURE__ */ defineComponent({
	__name: "SelectSeparator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({ "aria-hidden": "true" }, props), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectTrigger.js
var SelectTrigger_default = /* @__PURE__ */ defineComponent({
	__name: "SelectTrigger",
	props: {
		disabled: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectSelectRootContext();
		const { forwardRef} = useForwardExpose();
		const isDisabled = computed(() => rootContext.disabled?.value || props.disabled);
		rootContext.contentId ||= useId$1(void 0, "reka-select-content");
		const { getItems } = useCollection();
		const { search, handleTypeaheadSearch, resetTypeahead } = useTypeahead();
		function handleOpen() {
			if (!isDisabled.value) {
				rootContext.onOpenChange(true);
				resetTypeahead();
			}
		}
		function handlePointerOpen(event) {
			handleOpen();
			rootContext.triggerPointerDownPosRef.value = {
				x: Math.round(event.pageX),
				y: Math.round(event.pageY)
			};
		}
		function isPlainLeftClick(event) {
			return event.button === 0 && event.ctrlKey === false;
		}
		let openedFromPointerDown = false;
		function onTriggerPointerDown(event) {
			if (event.pointerType === "touch") return event.preventDefault();
			const target = event.target;
			if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
			if (isPlainLeftClick(event)) {
				handlePointerOpen(event);
				openedFromPointerDown = true;
			}
		}
		function onTriggerMouseDown(event) {
			if (isPlainLeftClick(event)) event.preventDefault();
		}
		function onTriggerClick(event) {
			if (!openedFromPointerDown) event.currentTarget?.focus();
			openedFromPointerDown = false;
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperAnchor_default), {
				"as-child": "",
				reference: _ctx.reference
			}, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					ref: unref(forwardRef),
					role: "combobox",
					type: _ctx.as === "button" ? "button" : void 0,
					"aria-controls": unref(rootContext).contentId,
					"aria-expanded": unref(rootContext).open.value || false,
					"aria-required": unref(rootContext).required?.value,
					"aria-autocomplete": "none",
					disabled: isDisabled.value,
					dir: unref(rootContext)?.dir.value,
					"data-state": unref(rootContext)?.open.value ? "open" : "closed",
					"data-disabled": isDisabled.value ? "" : void 0,
					"data-placeholder": unref(shouldShowPlaceholder)(unref(rootContext).modelValue?.value) ? "" : void 0,
					"as-child": _ctx.asChild,
					as: _ctx.as,
					onClick: onTriggerClick,
					onPointerdown: onTriggerPointerDown,
					onMousedown: onTriggerMouseDown,
					onPointerup: _cache[0] || (_cache[0] = withModifiers((event) => {
						if (event.pointerType === "touch") handlePointerOpen(event);
					}, ["prevent"])),
					onKeydown: _cache[1] || (_cache[1] = (event) => {
						const isTypingAhead = unref(search) !== "";
						if (!(event.ctrlKey || event.altKey || event.metaKey) && event.key.length === 1) {
							if (isTypingAhead && event.key === " ") return;
						}
						unref(handleTypeaheadSearch)(event.key, unref(getItems)());
						if (unref(OPEN_KEYS).includes(event.key)) {
							handleOpen();
							event.preventDefault();
						}
					})
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"type",
					"aria-controls",
					"aria-expanded",
					"aria-required",
					"disabled",
					"dir",
					"data-state",
					"data-disabled",
					"data-placeholder",
					"as-child",
					"as"
				])]),
				_: 3
			}, 8, ["reference"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectValue.js
var SelectValue_default = /* @__PURE__ */ defineComponent({
	__name: "SelectValue",
	props: {
		placeholder: {
			type: String,
			required: false,
			default: ""
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef} = useForwardExpose();
		const rootContext = injectSelectRootContext();
		const selectedLabel = computed(() => {
			let list = [];
			const options = Array.from(rootContext.optionsSet.value);
			const getOption = (value) => options.find((option) => valueComparator(value, option.value, rootContext.by));
			if (Array.isArray(rootContext.modelValue.value)) list = rootContext.modelValue.value.map((value) => getOption(value)?.textContent ?? "");
			else list = [getOption(rootContext.modelValue.value)?.textContent ?? ""];
			return list.filter(Boolean);
		});
		const slotText = computed(() => {
			return selectedLabel.value.length ? selectedLabel.value.join(", ") : props.placeholder;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				ref: unref(forwardRef),
				as: _ctx.as,
				"as-child": _ctx.asChild,
				style: { pointerEvents: "none" },
				"data-placeholder": selectedLabel.value.length ? void 0 : props.placeholder
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
					selectedLabel: selectedLabel.value,
					modelValue: unref(rootContext).modelValue.value
				}, () => [createTextVNode(toDisplayString(slotText.value), 1)])]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"data-placeholder"
			]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Select/SelectViewport.js
var SelectViewport_default = /* @__PURE__ */ defineComponent({
	__name: "SelectViewport",
	props: {
		nonce: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { nonce: propNonce } = toRefs(props);
		const nonce = useNonce(propNonce);
		const alignedPositionContext = injectSelectContentContext().position === "item-aligned" ? injectSelectItemAlignedPositionContext() : void 0;
		const { forwardRef} = useForwardExpose();
		const prevScrollTopRef = ref(0);
		function handleScroll(event) {
			const viewport = event.currentTarget;
			const { shouldExpandOnScrollRef, contentWrapper } = alignedPositionContext ?? {};
			if (shouldExpandOnScrollRef?.value && contentWrapper?.value) {
				const scrolledBy = Math.abs(prevScrollTopRef.value - viewport.scrollTop);
				if (scrolledBy > 0) {
					const availableHeight = (void 0).innerHeight - 20;
					const cssMinHeight = Number.parseFloat(contentWrapper.value.style.minHeight);
					const cssHeight = Number.parseFloat(contentWrapper.value.style.height);
					const prevHeight = Math.max(cssMinHeight, cssHeight);
					if (prevHeight < availableHeight) {
						const nextHeight = prevHeight + scrolledBy;
						const clampedNextHeight = Math.min(availableHeight, nextHeight);
						const heightDiff = nextHeight - clampedNextHeight;
						contentWrapper.value.style.height = `${clampedNextHeight}px`;
						if (contentWrapper.value.style.bottom === "0px") {
							viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
							contentWrapper.value.style.justifyContent = "flex-end";
						}
					}
				}
			}
			prevScrollTopRef.value = viewport.scrollTop;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createVNode(unref(Primitive), mergeProps({
				ref: unref(forwardRef),
				"data-reka-select-viewport": "",
				role: "presentation"
			}, {
				..._ctx.$attrs,
				...props
			}, {
				style: {
					position: "relative",
					flex: 1,
					overflow: "hidden auto"
				},
				onScroll: handleScroll
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16), createVNode(unref(Primitive), {
				as: "style",
				nonce: unref(nonce)
			}, {
				default: withCtx(() => _cache[0] || (_cache[0] = [createTextVNode(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
				_: 1,
				__: [0]
			}, 8, ["nonce"])], 64);
		};
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/utils/hash.js
/**
* Hash an arbitrary value into a short, stable string key.
*
* Values are serialized to a canonical, locale-independent representation
* (equal structures hash equally regardless of key order or runtime locale),
* then digested with a fast non-cryptographic hash. This is what `useFetch` and
* `useAsyncData` use internally to derive their cache keys, so it is safe to use
* for the same purpose in your own code.
*
* The digest is non-cryptographic and must not be used for integrity checks.
*
* @since 4.5.0
*/
function hashKey(value) {
	return fnv1a64Base36(identify(value));
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fselect.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_default = {
	"slots": {
		"base": ["relative group rounded-md inline-flex items-center disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute inset-y-0 start-0 flex items-center",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute inset-y-0 end-0 flex items-center",
		"trailingIcon": "shrink-0 text-dimmed",
		"value": "truncate pointer-events-none",
		"placeholder": "truncate text-dimmed",
		"arrow": "fill-bg stroke-default",
		"content": "max-h-[min(15rem,var(--reka-select-content-available-height,15rem))] w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
		"viewport": "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
		"group": "p-1 isolate",
		"empty": "text-center text-muted",
		"label": "font-semibold text-highlighted",
		"separator": "-mx-1 my-1 h-px bg-border",
		"item": ["group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", "transition-colors before:transition-colors"],
		"itemLeadingIcon": ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", "transition-colors"],
		"itemLeadingAvatar": "shrink-0",
		"itemLeadingAvatarSize": "",
		"itemLeadingChip": "shrink-0",
		"itemLeadingChipSize": "",
		"itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
		"itemTrailingIcon": "shrink-0",
		"itemWrapper": "flex-1 flex flex-col min-w-0",
		"itemLabel": "truncate",
		"itemDescription": "truncate text-muted"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-xs gap-1",
				"leading": "ps-2",
				"trailing": "pe-2",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4",
				"label": "p-1 text-[10px]/3 gap-1",
				"item": "p-1 text-xs gap-1",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemLeadingChip": "size-4",
				"itemLeadingChipSize": "sm",
				"itemTrailingIcon": "size-4",
				"empty": "p-2 text-xs"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-xs gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4",
				"label": "p-1.5 text-[10px]/3 gap-1.5",
				"item": "p-1.5 text-xs gap-1.5",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemLeadingChip": "size-4",
				"itemLeadingChipSize": "sm",
				"itemTrailingIcon": "size-4",
				"empty": "p-2.5 text-xs"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-sm gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5",
				"label": "p-1.5 text-xs gap-1.5",
				"item": "p-1.5 text-sm gap-1.5",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemLeadingChip": "size-5",
				"itemLeadingChipSize": "md",
				"itemTrailingIcon": "size-5",
				"empty": "p-2.5 text-sm"
			},
			"lg": {
				"base": "px-3 py-2 text-sm gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5",
				"label": "p-2 text-xs gap-2",
				"item": "p-2 text-sm gap-2",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemLeadingChip": "size-5",
				"itemLeadingChipSize": "md",
				"itemTrailingIcon": "size-5",
				"empty": "p-3 text-sm"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6",
				"label": "p-2 text-sm gap-2",
				"item": "p-2 text-base gap-2",
				"itemLeadingIcon": "size-6",
				"itemLeadingAvatarSize": "xs",
				"itemLeadingChip": "size-6",
				"itemLeadingChipSize": "lg",
				"itemTrailingIcon": "size-6",
				"empty": "p-3 text-base"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented hover:bg-elevated disabled:bg-default",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented hover:bg-accented/75 disabled:bg-elevated",
			"ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
			"none": "text-highlighted bg-transparent focus:outline-none"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"highlight": { "true": "" },
		"fixed": { "false": "" },
		"type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" },
		"position": {
			"popper": { "content": "data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)]" },
			"item-aligned": { "content": "" }
		},
		"multiple": { "true": "" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": ["outline", "subtle"],
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": ["outline", "subtle"],
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": ["outline", "subtle"],
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": ["outline", "subtle"],
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": ["outline", "subtle"],
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": ["outline", "subtle"],
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": ["soft", "ghost"],
			"class": "outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": ["soft", "ghost"],
			"class": "outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": ["soft", "ghost"],
			"class": "outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": ["soft", "ghost"],
			"class": "outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": ["soft", "ghost"],
			"class": "outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": ["soft", "ghost"],
			"class": "outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "ring ring-inset ring-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "ring ring-inset ring-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "ring ring-inset ring-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "ring ring-inset ring-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "ring ring-inset ring-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "ring ring-inset ring-error"
		},
		{
			"color": "neutral",
			"variant": ["outline", "subtle"],
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": ["soft", "ghost"],
			"class": "outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "ring ring-inset ring-inverted"
		},
		{
			"leading": true,
			"size": "xs",
			"class": "ps-7"
		},
		{
			"leading": true,
			"size": "sm",
			"class": "ps-8"
		},
		{
			"leading": true,
			"size": "md",
			"class": "ps-9"
		},
		{
			"leading": true,
			"size": "lg",
			"class": "ps-10"
		},
		{
			"leading": true,
			"size": "xl",
			"class": "ps-11"
		},
		{
			"trailing": true,
			"size": "xs",
			"class": "pe-7"
		},
		{
			"trailing": true,
			"size": "sm",
			"class": "pe-8"
		},
		{
			"trailing": true,
			"size": "md",
			"class": "pe-9"
		},
		{
			"trailing": true,
			"size": "lg",
			"class": "pe-10"
		},
		{
			"trailing": true,
			"size": "xl",
			"class": "pe-11"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		},
		{
			"fixed": false,
			"size": "xs",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "sm",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "md",
			"class": "md:text-sm"
		},
		{
			"fixed": false,
			"size": "lg",
			"class": "md:text-sm"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"variant": "outline",
		"position": "popper"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Select.vue
var _sfc_main$1 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "USelect",
	__ssrInlineRender: true,
	props: {
		id: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		selectedIcon: {
			type: null,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		valueKey: {
			type: null,
			required: false,
			default: "value"
		},
		labelKey: {
			type: null,
			required: false,
			default: "label"
		},
		descriptionKey: {
			type: null,
			required: false,
			default: "description"
		},
		items: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		modelModifiers: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		autofocusDelay: {
			type: Number,
			required: false,
			default: 0
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		nullableValue: {
			type: String,
			required: false
		},
		autocomplete: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		}
	},
	emits: [
		"change",
		"blur",
		"focus",
		"update:modelValue",
		"update:open"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("select", _props);
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "open", "defaultOpen", "disabled", "autocomplete", "required", "multiple", "nullableValue"), emits);
		const portalProps = usePortal(toRef(() => props.portal));
		const position = computed(() => props.content?.position ?? appConfig.ui?.select?.defaultVariants?.position ?? virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_default.defaultVariants?.position);
		const contentProps = toRef(() => defu(props.content, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8,
			position: position.value
		}));
		const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
		const { emitFormChange, emitFormInput, emitFormBlur, emitFormFocus, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField(_props);
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(computed(() => ({
			icon: props.icon,
			leading: props.leading,
			leadingIcon: props.leadingIcon,
			trailing: props.trailing,
			trailingIcon: props.trailingIcon ?? appConfig.ui.icons.chevronDown,
			loading: props.loading,
			loadingIcon: props.loadingIcon
		})));
		const color = computed(() => formFieldColor.value ?? props.color);
		const highlight = computed(() => formFieldHighlight.value ?? props.highlight);
		const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size);
		const disabled = computed(() => formFieldDisabled.value ?? props.disabled);
		const isItemAligned = computed(() => position.value === "item-aligned");
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_default,
			...appConfig.ui?.select || {}
		})({
			color: color.value,
			variant: props.variant,
			size: size.value,
			loading: props.loading,
			highlight: highlight.value,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing,
			fieldGroup: orientation.value,
			position: position.value,
			multiple: props.multiple
		}));
		const groups = computed(() => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []);
		const items = computed(() => groups.value.flatMap((group) => group));
		function displayValue(value) {
			if (props.multiple && Array.isArray(value)) {
				const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
					labelKey: props.labelKey,
					valueKey: props.valueKey
				})).filter((v) => v != null && v !== "");
				return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
			}
			return getDisplayValue(items.value, value, {
				labelKey: props.labelKey,
				valueKey: props.valueKey
			});
		}
		const triggerRef = useTemplateRef("triggerRef");
		let autofocusTimeoutId;
		onScopeDispose(() => clearTimeout(autofocusTimeoutId));
		function onUpdate(value) {
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number) value = looseToNumber(value);
			if (props.modelModifiers?.nullable) value ??= null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) value ??= void 0;
			const event = new Event("change", { target: { value } });
			emits("change", event);
			emitFormChange();
			emitFormInput();
		}
		function onUpdateOpen(value) {
			if (!value) {
				const event = new FocusEvent("blur");
				emits("blur", event);
				emitFormBlur();
			} else {
				const event = new FocusEvent("focus");
				emits("focus", event);
				emitFormFocus();
			}
		}
		function isSelectItem(item) {
			return typeof item === "object" && item !== null;
		}
		function onTriggerClick(open) {
			if (!open) triggerRef.value?.$el?.dispatchEvent(new PointerEvent("pointerdown", {
				bubbles: true,
				button: 0
			}));
		}
		const viewportRef = useTemplateRef("viewportRef");
		__expose({
			triggerRef: toRef(() => triggerRef.value?.$el),
			viewportRef: toRef(() => {
				const instance = viewportRef.value;
				return instance && typeof instance === "object" && "$el" in instance ? instance.$el : instance;
			})
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(SelectRoot_default), mergeProps({ name: unref(name) }, unref(rootProps), {
				autocomplete: unref(props).autocomplete,
				disabled: disabled.value,
				"default-value": unref(props).defaultValue,
				"model-value": __props.modelValue,
				"onUpdate:modelValue": onUpdate,
				"onUpdate:open": onUpdateOpen
			}, _attrs), {
				default: withCtx(({ modelValue, open }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(SelectTrigger_default), mergeProps({
							id: unref(id),
							ref_key: "triggerRef",
							ref: triggerRef,
							"data-slot": "base",
							class: ui.value.base({ class: [unref(props).ui?.base, unref(props).class] })
						}, {
							..._ctx.$attrs,
							...unref(ariaAttrs)
						}, { onClick: ($event) => onTriggerClick(open) }), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									if (unref(isLeading) || !!unref(props).avatar || !!slots.leading) {
										_push(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: unref(props).ui?.leading }))}"${_scopeId}>`);
										ssrRenderSlot(_ctx.$slots, "leading", {
											modelValue,
											open,
											ui: ui.value
										}, () => {
											if (unref(isLeading) && unref(leadingIconName)) _push(ssrRenderComponent(_sfc_main$6, {
												name: unref(leadingIconName),
												"data-slot": "leadingIcon",
												class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
											}, null, _parent, _scopeId));
											else if (!!unref(props).avatar) _push(ssrRenderComponent(_sfc_main$4, mergeProps({ size: unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize() }, unref(props).avatar, {
												"data-slot": "itemLeadingAvatar",
												class: ui.value.itemLeadingAvatar({ class: unref(props).ui?.itemLeadingAvatar })
											}), null, _parent, _scopeId));
											else _push(`<!---->`);
										}, _push, _parent, _scopeId);
										_push(`</span>`);
									} else _push(`<!---->`);
									_push(`<!--[-->`);
									ssrRenderList([displayValue(modelValue)], (displayedModelValue) => {
										_push(ssrRenderComponent(unref(SelectValue_default), {
											"data-slot": displayedModelValue != null ? "value" : "placeholder",
											class: displayedModelValue != null ? ui.value.value({ class: unref(props).ui?.value }) : ui.value.placeholder({ class: unref(props).ui?.placeholder })
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) ssrRenderSlot(_ctx.$slots, "default", {
													modelValue,
													open,
													ui: ui.value
												}, () => {
													_push(`${ssrInterpolate(displayedModelValue ?? unref(props).placeholder ?? "\xA0")}`);
												}, _push, _parent, _scopeId);
												else return [renderSlot(_ctx.$slots, "default", {
													modelValue,
													open,
													ui: ui.value
												}, () => [createTextVNode(toDisplayString(displayedModelValue ?? unref(props).placeholder ?? "\xA0"), 1)])];
											}),
											_: 2
										}, _parent, _scopeId));
									});
									_push(`<!--]-->`);
									if (unref(isTrailing) || !!slots.trailing) {
										_push(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(props).ui?.trailing }))}"${_scopeId}>`);
										ssrRenderSlot(_ctx.$slots, "trailing", {
											modelValue,
											open,
											ui: ui.value
										}, () => {
											if (unref(trailingIconName)) _push(ssrRenderComponent(_sfc_main$6, {
												name: unref(trailingIconName),
												"data-slot": "trailingIcon",
												class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
											}, null, _parent, _scopeId));
											else _push(`<!---->`);
										}, _push, _parent, _scopeId);
										_push(`</span>`);
									} else _push(`<!---->`);
								} else return [
									unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
										key: 0,
										"data-slot": "leading",
										class: ui.value.leading({ class: unref(props).ui?.leading })
									}, [renderSlot(_ctx.$slots, "leading", {
										modelValue,
										open,
										ui: ui.value
									}, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
										key: 0,
										name: unref(leadingIconName),
										"data-slot": "leadingIcon",
										class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
									}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
										key: 1,
										size: unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
									}, unref(props).avatar, {
										"data-slot": "itemLeadingAvatar",
										class: ui.value.itemLeadingAvatar({ class: unref(props).ui?.itemLeadingAvatar })
									}), null, 16, ["size", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true),
									(openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
										return openBlock(), createBlock(unref(SelectValue_default), {
											key: displayedModelValue,
											"data-slot": displayedModelValue != null ? "value" : "placeholder",
											class: displayedModelValue != null ? ui.value.value({ class: unref(props).ui?.value }) : ui.value.placeholder({ class: unref(props).ui?.placeholder })
										}, {
											default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
												modelValue,
												open,
												ui: ui.value
											}, () => [createTextVNode(toDisplayString(displayedModelValue ?? unref(props).placeholder ?? "\xA0"), 1)])]),
											_: 2
										}, 1032, ["data-slot", "class"]);
									}), 128)),
									unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
										key: 1,
										"data-slot": "trailing",
										class: ui.value.trailing({ class: unref(props).ui?.trailing })
									}, [renderSlot(_ctx.$slots, "trailing", {
										modelValue,
										open,
										ui: ui.value
									}, () => [unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
										key: 0,
										name: unref(trailingIconName),
										"data-slot": "trailingIcon",
										class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
									}, null, 8, ["name", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true)
								];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(SelectPortal_default), unref(portalProps), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(FieldGroupReset), null, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(unref(SelectContent_default), mergeProps({
											"data-slot": "content",
											class: ui.value.content({ class: unref(props).ui?.content })
										}, contentProps.value), {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) {
													ssrRenderSlot(_ctx.$slots, "content-top", {}, null, _push, _parent, _scopeId);
													ssrRenderVNode(_push, createVNode(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
														ref_key: "viewportRef",
														ref: viewportRef,
														role: "presentation",
														"data-slot": "viewport",
														class: ui.value.viewport({ class: unref(props).ui?.viewport })
													}, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) {
																_push(`<!--[-->`);
																ssrRenderList(groups.value, (group, groupIndex) => {
																	_push(ssrRenderComponent(unref(SelectGroup_default), {
																		key: `group-${groupIndex}`,
																		"data-slot": "group",
																		class: ui.value.group({ class: unref(props).ui?.group })
																	}, {
																		default: withCtx((_, _push, _parent, _scopeId) => {
																			if (_push) {
																				_push(`<!--[-->`);
																				ssrRenderList(group, (item, index) => {
																					_push(`<!--[-->`);
																					if (isSelectItem(item) && item.type === "label") _push(ssrRenderComponent(unref(SelectLabel_default), {
																						"data-slot": "label",
																						class: ui.value.label({ class: [
																							unref(props).ui?.label,
																							item.ui?.label,
																							item.class
																						] })
																					}, {
																						default: withCtx((_, _push, _parent, _scopeId) => {
																							if (_push) _push(`${ssrInterpolate(unref(get)(item, unref(props).labelKey))}`);
																							else return [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)];
																						}),
																						_: 2
																					}, _parent, _scopeId));
																					else if (isSelectItem(item) && item.type === "separator") _push(ssrRenderComponent(unref(SelectSeparator_default), {
																						"data-slot": "separator",
																						class: ui.value.separator({ class: [
																							unref(props).ui?.separator,
																							item.ui?.separator,
																							item.class
																						] })
																					}, null, _parent, _scopeId));
																					else _push(ssrRenderComponent(unref(SelectItem_default), {
																						"data-slot": "item",
																						class: ui.value.item({ class: [
																							unref(props).ui?.item,
																							isSelectItem(item) && item.ui?.item,
																							isSelectItem(item) && item.class
																						] }),
																						disabled: isSelectItem(item) && item.disabled,
																						value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
																						onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
																					}, {
																						default: withCtx((_, _push, _parent, _scopeId) => {
																							if (_push) ssrRenderSlot(_ctx.$slots, "item", {
																								item,
																								index,
																								ui: ui.value
																							}, () => {
																								ssrRenderSlot(_ctx.$slots, "item-leading", {
																									item,
																									index,
																									ui: ui.value
																								}, () => {
																									if (isSelectItem(item) && item.icon) _push(ssrRenderComponent(_sfc_main$6, {
																										name: item.icon,
																										"data-slot": "itemLeadingIcon",
																										class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																									}, null, _parent, _scopeId));
																									else if (isSelectItem(item) && item.avatar) _push(ssrRenderComponent(_sfc_main$4, mergeProps({ size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize() }, { ref_for: true }, item.avatar, {
																										"data-slot": "itemLeadingAvatar",
																										class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																									}), null, _parent, _scopeId));
																									else if (isSelectItem(item) && item.chip) _push(ssrRenderComponent(_sfc_main$5, mergeProps({
																										size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																										inset: "",
																										standalone: ""
																									}, { ref_for: true }, item.chip, {
																										"data-slot": "itemLeadingChip",
																										class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																									}), null, _parent, _scopeId));
																									else _push(`<!---->`);
																								}, _push, _parent, _scopeId);
																								_push(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] }))}"${_scopeId}>`);
																								_push(ssrRenderComponent(unref(SelectItemText_default), {
																									"data-slot": "itemLabel",
																									class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																								}, {
																									default: withCtx((_, _push, _parent, _scopeId) => {
																										if (_push) ssrRenderSlot(_ctx.$slots, "item-label", {
																											item,
																											index
																										}, () => {
																											_push(`${ssrInterpolate(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item)}`);
																										}, _push, _parent, _scopeId);
																										else return [renderSlot(_ctx.$slots, "item-label", {
																											item,
																											index
																										}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])];
																									}),
																									_: 2
																								}, _parent, _scopeId));
																								if (isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"])) {
																									_push(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] }))}"${_scopeId}>`);
																									ssrRenderSlot(_ctx.$slots, "item-description", {
																										item,
																										index
																									}, () => {
																										_push(`${ssrInterpolate(unref(get)(item, unref(props).descriptionKey))}`);
																									}, _push, _parent, _scopeId);
																									_push(`</span>`);
																								} else _push(`<!---->`);
																								_push(`</span><span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] }))}"${_scopeId}>`);
																								ssrRenderSlot(_ctx.$slots, "item-trailing", {
																									item,
																									index,
																									ui: ui.value
																								}, null, _push, _parent, _scopeId);
																								_push(ssrRenderComponent(unref(SelectItemIndicator_default), { "as-child": "" }, {
																									default: withCtx((_, _push, _parent, _scopeId) => {
																										if (_push) _push(ssrRenderComponent(_sfc_main$6, {
																											name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																											"data-slot": "itemTrailingIcon",
																											class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																										}, null, _parent, _scopeId));
																										else return [createVNode(_sfc_main$6, {
																											name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																											"data-slot": "itemTrailingIcon",
																											class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																										}, null, 8, ["name", "class"])];
																									}),
																									_: 2
																								}, _parent, _scopeId));
																								_push(`</span>`);
																							}, _push, _parent, _scopeId);
																							else return [renderSlot(_ctx.$slots, "item", {
																								item,
																								index,
																								ui: ui.value
																							}, () => [
																								renderSlot(_ctx.$slots, "item-leading", {
																									item,
																									index,
																									ui: ui.value
																								}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																									key: 0,
																									name: item.icon,
																									"data-slot": "itemLeadingIcon",
																									class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																								}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																									key: 1,
																									size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
																								}, { ref_for: true }, item.avatar, {
																									"data-slot": "itemLeadingAvatar",
																									class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																								}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																									key: 2,
																									size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																									inset: "",
																									standalone: ""
																								}, { ref_for: true }, item.chip, {
																									"data-slot": "itemLeadingChip",
																									class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																								}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
																								createVNode("span", {
																									"data-slot": "itemWrapper",
																									class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
																								}, [createVNode(unref(SelectItemText_default), {
																									"data-slot": "itemLabel",
																									class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																								}, {
																									default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																										item,
																										index
																									}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																									_: 2
																								}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																									key: 0,
																									"data-slot": "itemDescription",
																									class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
																								}, [renderSlot(_ctx.$slots, "item-description", {
																									item,
																									index
																								}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
																								createVNode("span", {
																									"data-slot": "itemTrailing",
																									class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
																								}, [renderSlot(_ctx.$slots, "item-trailing", {
																									item,
																									index,
																									ui: ui.value
																								}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																									default: withCtx(() => [createVNode(_sfc_main$6, {
																										name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																										"data-slot": "itemTrailingIcon",
																										class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																									}, null, 8, ["name", "class"])]),
																									_: 2
																								}, 1024)], 2)
																							])];
																						}),
																						_: 2
																					}, _parent, _scopeId));
																					_push(`<!--]-->`);
																				});
																				_push(`<!--]-->`);
																			} else return [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
																				return openBlock(), createBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
																					key: 0,
																					"data-slot": "label",
																					class: ui.value.label({ class: [
																						unref(props).ui?.label,
																						item.ui?.label,
																						item.class
																					] })
																				}, {
																					default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
																					_: 2
																				}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
																					key: 1,
																					"data-slot": "separator",
																					class: ui.value.separator({ class: [
																						unref(props).ui?.separator,
																						item.ui?.separator,
																						item.class
																					] })
																				}, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
																					key: 2,
																					"data-slot": "item",
																					class: ui.value.item({ class: [
																						unref(props).ui?.item,
																						isSelectItem(item) && item.ui?.item,
																						isSelectItem(item) && item.class
																					] }),
																					disabled: isSelectItem(item) && item.disabled,
																					value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
																					onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
																				}, {
																					default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
																						item,
																						index,
																						ui: ui.value
																					}, () => [
																						renderSlot(_ctx.$slots, "item-leading", {
																							item,
																							index,
																							ui: ui.value
																						}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																							key: 0,
																							name: item.icon,
																							"data-slot": "itemLeadingIcon",
																							class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																						}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																							key: 1,
																							size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
																						}, { ref_for: true }, item.avatar, {
																							"data-slot": "itemLeadingAvatar",
																							class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																						}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																							key: 2,
																							size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																							inset: "",
																							standalone: ""
																						}, { ref_for: true }, item.chip, {
																							"data-slot": "itemLeadingChip",
																							class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																						}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
																						createVNode("span", {
																							"data-slot": "itemWrapper",
																							class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
																						}, [createVNode(unref(SelectItemText_default), {
																							"data-slot": "itemLabel",
																							class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																						}, {
																							default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																								item,
																								index
																							}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																							_: 2
																						}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																							key: 0,
																							"data-slot": "itemDescription",
																							class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
																						}, [renderSlot(_ctx.$slots, "item-description", {
																							item,
																							index
																						}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
																						createVNode("span", {
																							"data-slot": "itemTrailing",
																							class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
																						}, [renderSlot(_ctx.$slots, "item-trailing", {
																							item,
																							index,
																							ui: ui.value
																						}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																							default: withCtx(() => [createVNode(_sfc_main$6, {
																								name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																								"data-slot": "itemTrailingIcon",
																								class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																							}, null, 8, ["name", "class"])]),
																							_: 2
																						}, 1024)], 2)
																					])]),
																					_: 2
																				}, 1032, [
																					"class",
																					"disabled",
																					"value",
																					"onSelect"
																				]))], 64);
																			}), 128))];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																});
																_push(`<!--]-->`);
															} else return [(openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
																return openBlock(), createBlock(unref(SelectGroup_default), {
																	key: `group-${groupIndex}`,
																	"data-slot": "group",
																	class: ui.value.group({ class: unref(props).ui?.group })
																}, {
																	default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
																		return openBlock(), createBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
																			key: 0,
																			"data-slot": "label",
																			class: ui.value.label({ class: [
																				unref(props).ui?.label,
																				item.ui?.label,
																				item.class
																			] })
																		}, {
																			default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
																			_: 2
																		}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
																			key: 1,
																			"data-slot": "separator",
																			class: ui.value.separator({ class: [
																				unref(props).ui?.separator,
																				item.ui?.separator,
																				item.class
																			] })
																		}, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
																			key: 2,
																			"data-slot": "item",
																			class: ui.value.item({ class: [
																				unref(props).ui?.item,
																				isSelectItem(item) && item.ui?.item,
																				isSelectItem(item) && item.class
																			] }),
																			disabled: isSelectItem(item) && item.disabled,
																			value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
																			onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
																		}, {
																			default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
																				item,
																				index,
																				ui: ui.value
																			}, () => [
																				renderSlot(_ctx.$slots, "item-leading", {
																					item,
																					index,
																					ui: ui.value
																				}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																					key: 0,
																					name: item.icon,
																					"data-slot": "itemLeadingIcon",
																					class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																				}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																					key: 1,
																					size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
																				}, { ref_for: true }, item.avatar, {
																					"data-slot": "itemLeadingAvatar",
																					class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																				}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																					key: 2,
																					size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																					inset: "",
																					standalone: ""
																				}, { ref_for: true }, item.chip, {
																					"data-slot": "itemLeadingChip",
																					class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																				}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
																				createVNode("span", {
																					"data-slot": "itemWrapper",
																					class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
																				}, [createVNode(unref(SelectItemText_default), {
																					"data-slot": "itemLabel",
																					class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																				}, {
																					default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																						item,
																						index
																					}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																					_: 2
																				}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																					key: 0,
																					"data-slot": "itemDescription",
																					class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
																				}, [renderSlot(_ctx.$slots, "item-description", {
																					item,
																					index
																				}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
																				createVNode("span", {
																					"data-slot": "itemTrailing",
																					class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
																				}, [renderSlot(_ctx.$slots, "item-trailing", {
																					item,
																					index,
																					ui: ui.value
																				}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																					default: withCtx(() => [createVNode(_sfc_main$6, {
																						name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																						"data-slot": "itemTrailingIcon",
																						class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																					}, null, 8, ["name", "class"])]),
																					_: 2
																				}, 1024)], 2)
																			])]),
																			_: 2
																		}, 1032, [
																			"class",
																			"disabled",
																			"value",
																			"onSelect"
																		]))], 64);
																	}), 128))]),
																	_: 2
																}, 1032, ["class"]);
															}), 128))];
														}),
														_: 2
													}), _parent, _scopeId);
													ssrRenderSlot(_ctx.$slots, "content-bottom", {}, null, _push, _parent, _scopeId);
													if (!!unref(props).arrow) _push(ssrRenderComponent(unref(SelectArrow_default), mergeProps(arrowProps.value, {
														"data-slot": "arrow",
														class: ui.value.arrow({ class: unref(props).ui?.arrow })
													}), null, _parent, _scopeId));
													else _push(`<!---->`);
												} else return [
													renderSlot(_ctx.$slots, "content-top"),
													(openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
														ref_key: "viewportRef",
														ref: viewportRef,
														role: "presentation",
														"data-slot": "viewport",
														class: ui.value.viewport({ class: unref(props).ui?.viewport })
													}, {
														default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
															return openBlock(), createBlock(unref(SelectGroup_default), {
																key: `group-${groupIndex}`,
																"data-slot": "group",
																class: ui.value.group({ class: unref(props).ui?.group })
															}, {
																default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
																	return openBlock(), createBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
																		key: 0,
																		"data-slot": "label",
																		class: ui.value.label({ class: [
																			unref(props).ui?.label,
																			item.ui?.label,
																			item.class
																		] })
																	}, {
																		default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
																		_: 2
																	}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
																		key: 1,
																		"data-slot": "separator",
																		class: ui.value.separator({ class: [
																			unref(props).ui?.separator,
																			item.ui?.separator,
																			item.class
																		] })
																	}, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
																		key: 2,
																		"data-slot": "item",
																		class: ui.value.item({ class: [
																			unref(props).ui?.item,
																			isSelectItem(item) && item.ui?.item,
																			isSelectItem(item) && item.class
																		] }),
																		disabled: isSelectItem(item) && item.disabled,
																		value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
																		onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
																	}, {
																		default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
																			item,
																			index,
																			ui: ui.value
																		}, () => [
																			renderSlot(_ctx.$slots, "item-leading", {
																				item,
																				index,
																				ui: ui.value
																			}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																				key: 0,
																				name: item.icon,
																				"data-slot": "itemLeadingIcon",
																				class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																			}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																				key: 1,
																				size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
																			}, { ref_for: true }, item.avatar, {
																				"data-slot": "itemLeadingAvatar",
																				class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																			}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																				key: 2,
																				size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																				inset: "",
																				standalone: ""
																			}, { ref_for: true }, item.chip, {
																				"data-slot": "itemLeadingChip",
																				class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																			}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
																			createVNode("span", {
																				"data-slot": "itemWrapper",
																				class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
																			}, [createVNode(unref(SelectItemText_default), {
																				"data-slot": "itemLabel",
																				class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																			}, {
																				default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																					item,
																					index
																				}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																				_: 2
																			}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																				key: 0,
																				"data-slot": "itemDescription",
																				class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
																			}, [renderSlot(_ctx.$slots, "item-description", {
																				item,
																				index
																			}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
																			createVNode("span", {
																				"data-slot": "itemTrailing",
																				class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
																			}, [renderSlot(_ctx.$slots, "item-trailing", {
																				item,
																				index,
																				ui: ui.value
																			}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																				default: withCtx(() => [createVNode(_sfc_main$6, {
																					name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																					"data-slot": "itemTrailingIcon",
																					class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																				}, null, 8, ["name", "class"])]),
																				_: 2
																			}, 1024)], 2)
																		])]),
																		_: 2
																	}, 1032, [
																		"class",
																		"disabled",
																		"value",
																		"onSelect"
																	]))], 64);
																}), 128))]),
																_: 2
															}, 1032, ["class"]);
														}), 128))]),
														_: 3
													}, 8, ["class"])),
													renderSlot(_ctx.$slots, "content-bottom"),
													!!unref(props).arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
														"data-slot": "arrow",
														class: ui.value.arrow({ class: unref(props).ui?.arrow })
													}), null, 16, ["class"])) : createCommentVNode("", true)
												];
											}),
											_: 2
										}, _parent, _scopeId));
										else return [createVNode(unref(SelectContent_default), mergeProps({
											"data-slot": "content",
											class: ui.value.content({ class: unref(props).ui?.content })
										}, contentProps.value), {
											default: withCtx(() => [
												renderSlot(_ctx.$slots, "content-top"),
												(openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
													ref_key: "viewportRef",
													ref: viewportRef,
													role: "presentation",
													"data-slot": "viewport",
													class: ui.value.viewport({ class: unref(props).ui?.viewport })
												}, {
													default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
														return openBlock(), createBlock(unref(SelectGroup_default), {
															key: `group-${groupIndex}`,
															"data-slot": "group",
															class: ui.value.group({ class: unref(props).ui?.group })
														}, {
															default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
																return openBlock(), createBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
																	key: 0,
																	"data-slot": "label",
																	class: ui.value.label({ class: [
																		unref(props).ui?.label,
																		item.ui?.label,
																		item.class
																	] })
																}, {
																	default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
																	_: 2
																}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
																	key: 1,
																	"data-slot": "separator",
																	class: ui.value.separator({ class: [
																		unref(props).ui?.separator,
																		item.ui?.separator,
																		item.class
																	] })
																}, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
																	key: 2,
																	"data-slot": "item",
																	class: ui.value.item({ class: [
																		unref(props).ui?.item,
																		isSelectItem(item) && item.ui?.item,
																		isSelectItem(item) && item.class
																	] }),
																	disabled: isSelectItem(item) && item.disabled,
																	value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
																	onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
																}, {
																	default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
																		item,
																		index,
																		ui: ui.value
																	}, () => [
																		renderSlot(_ctx.$slots, "item-leading", {
																			item,
																			index,
																			ui: ui.value
																		}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																			key: 0,
																			name: item.icon,
																			"data-slot": "itemLeadingIcon",
																			class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																		}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																			key: 1,
																			size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
																		}, { ref_for: true }, item.avatar, {
																			"data-slot": "itemLeadingAvatar",
																			class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																		}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																			key: 2,
																			size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																			inset: "",
																			standalone: ""
																		}, { ref_for: true }, item.chip, {
																			"data-slot": "itemLeadingChip",
																			class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																		}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
																		createVNode("span", {
																			"data-slot": "itemWrapper",
																			class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
																		}, [createVNode(unref(SelectItemText_default), {
																			"data-slot": "itemLabel",
																			class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																		}, {
																			default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																				item,
																				index
																			}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																			_: 2
																		}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																			key: 0,
																			"data-slot": "itemDescription",
																			class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
																		}, [renderSlot(_ctx.$slots, "item-description", {
																			item,
																			index
																		}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
																		createVNode("span", {
																			"data-slot": "itemTrailing",
																			class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
																		}, [renderSlot(_ctx.$slots, "item-trailing", {
																			item,
																			index,
																			ui: ui.value
																		}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																			default: withCtx(() => [createVNode(_sfc_main$6, {
																				name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																				"data-slot": "itemTrailingIcon",
																				class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																			}, null, 8, ["name", "class"])]),
																			_: 2
																		}, 1024)], 2)
																	])]),
																	_: 2
																}, 1032, [
																	"class",
																	"disabled",
																	"value",
																	"onSelect"
																]))], 64);
															}), 128))]),
															_: 2
														}, 1032, ["class"]);
													}), 128))]),
													_: 3
												}, 8, ["class"])),
												renderSlot(_ctx.$slots, "content-bottom"),
												!!unref(props).arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
													"data-slot": "arrow",
													class: ui.value.arrow({ class: unref(props).ui?.arrow })
												}), null, 16, ["class"])) : createCommentVNode("", true)
											]),
											_: 3
										}, 16, ["class"])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(unref(FieldGroupReset), null, {
									default: withCtx(() => [createVNode(unref(SelectContent_default), mergeProps({
										"data-slot": "content",
										class: ui.value.content({ class: unref(props).ui?.content })
									}, contentProps.value), {
										default: withCtx(() => [
											renderSlot(_ctx.$slots, "content-top"),
											(openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
												ref_key: "viewportRef",
												ref: viewportRef,
												role: "presentation",
												"data-slot": "viewport",
												class: ui.value.viewport({ class: unref(props).ui?.viewport })
											}, {
												default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
													return openBlock(), createBlock(unref(SelectGroup_default), {
														key: `group-${groupIndex}`,
														"data-slot": "group",
														class: ui.value.group({ class: unref(props).ui?.group })
													}, {
														default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
															return openBlock(), createBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
																key: 0,
																"data-slot": "label",
																class: ui.value.label({ class: [
																	unref(props).ui?.label,
																	item.ui?.label,
																	item.class
																] })
															}, {
																default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
																_: 2
															}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
																key: 1,
																"data-slot": "separator",
																class: ui.value.separator({ class: [
																	unref(props).ui?.separator,
																	item.ui?.separator,
																	item.class
																] })
															}, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
																key: 2,
																"data-slot": "item",
																class: ui.value.item({ class: [
																	unref(props).ui?.item,
																	isSelectItem(item) && item.ui?.item,
																	isSelectItem(item) && item.class
																] }),
																disabled: isSelectItem(item) && item.disabled,
																value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
																onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
															}, {
																default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
																	item,
																	index,
																	ui: ui.value
																}, () => [
																	renderSlot(_ctx.$slots, "item-leading", {
																		item,
																		index,
																		ui: ui.value
																	}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																		key: 0,
																		name: item.icon,
																		"data-slot": "itemLeadingIcon",
																		class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
																	}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																		key: 1,
																		size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
																	}, { ref_for: true }, item.avatar, {
																		"data-slot": "itemLeadingAvatar",
																		class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
																	}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																		key: 2,
																		size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																		inset: "",
																		standalone: ""
																	}, { ref_for: true }, item.chip, {
																		"data-slot": "itemLeadingChip",
																		class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
																	}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
																	createVNode("span", {
																		"data-slot": "itemWrapper",
																		class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
																	}, [createVNode(unref(SelectItemText_default), {
																		"data-slot": "itemLabel",
																		class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
																	}, {
																		default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																			item,
																			index
																		}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																		_: 2
																	}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																		key: 0,
																		"data-slot": "itemDescription",
																		class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
																	}, [renderSlot(_ctx.$slots, "item-description", {
																		item,
																		index
																	}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
																	createVNode("span", {
																		"data-slot": "itemTrailing",
																		class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
																	}, [renderSlot(_ctx.$slots, "item-trailing", {
																		item,
																		index,
																		ui: ui.value
																	}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																		default: withCtx(() => [createVNode(_sfc_main$6, {
																			name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																			"data-slot": "itemTrailingIcon",
																			class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																		}, null, 8, ["name", "class"])]),
																		_: 2
																	}, 1024)], 2)
																])]),
																_: 2
															}, 1032, [
																"class",
																"disabled",
																"value",
																"onSelect"
															]))], 64);
														}), 128))]),
														_: 2
													}, 1032, ["class"]);
												}), 128))]),
												_: 3
											}, 8, ["class"])),
											renderSlot(_ctx.$slots, "content-bottom"),
											!!unref(props).arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
												"data-slot": "arrow",
												class: ui.value.arrow({ class: unref(props).ui?.arrow })
											}), null, 16, ["class"])) : createCommentVNode("", true)
										]),
										_: 3
									}, 16, ["class"])]),
									_: 3
								})];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [createVNode(unref(SelectTrigger_default), mergeProps({
						id: unref(id),
						ref_key: "triggerRef",
						ref: triggerRef,
						"data-slot": "base",
						class: ui.value.base({ class: [unref(props).ui?.base, unref(props).class] })
					}, {
						..._ctx.$attrs,
						...unref(ariaAttrs)
					}, { onClick: ($event) => onTriggerClick(open) }), {
						default: withCtx(() => [
							unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
								key: 0,
								"data-slot": "leading",
								class: ui.value.leading({ class: unref(props).ui?.leading })
							}, [renderSlot(_ctx.$slots, "leading", {
								modelValue,
								open,
								ui: ui.value
							}, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
								key: 0,
								name: unref(leadingIconName),
								"data-slot": "leadingIcon",
								class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
							}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
								key: 1,
								size: unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
							}, unref(props).avatar, {
								"data-slot": "itemLeadingAvatar",
								class: ui.value.itemLeadingAvatar({ class: unref(props).ui?.itemLeadingAvatar })
							}), null, 16, ["size", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true),
							(openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
								return openBlock(), createBlock(unref(SelectValue_default), {
									key: displayedModelValue,
									"data-slot": displayedModelValue != null ? "value" : "placeholder",
									class: displayedModelValue != null ? ui.value.value({ class: unref(props).ui?.value }) : ui.value.placeholder({ class: unref(props).ui?.placeholder })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
										modelValue,
										open,
										ui: ui.value
									}, () => [createTextVNode(toDisplayString(displayedModelValue ?? unref(props).placeholder ?? "\xA0"), 1)])]),
									_: 2
								}, 1032, ["data-slot", "class"]);
							}), 128)),
							unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
								key: 1,
								"data-slot": "trailing",
								class: ui.value.trailing({ class: unref(props).ui?.trailing })
							}, [renderSlot(_ctx.$slots, "trailing", {
								modelValue,
								open,
								ui: ui.value
							}, () => [unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
								key: 0,
								name: unref(trailingIconName),
								"data-slot": "trailingIcon",
								class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
							}, null, 8, ["name", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true)
						]),
						_: 2
					}, 1040, [
						"id",
						"class",
						"onClick"
					]), createVNode(unref(SelectPortal_default), unref(portalProps), {
						default: withCtx(() => [createVNode(unref(FieldGroupReset), null, {
							default: withCtx(() => [createVNode(unref(SelectContent_default), mergeProps({
								"data-slot": "content",
								class: ui.value.content({ class: unref(props).ui?.content })
							}, contentProps.value), {
								default: withCtx(() => [
									renderSlot(_ctx.$slots, "content-top"),
									(openBlock(), createBlock(resolveDynamicComponent(isItemAligned.value ? unref(SelectViewport_default) : "div"), {
										ref_key: "viewportRef",
										ref: viewportRef,
										role: "presentation",
										"data-slot": "viewport",
										class: ui.value.viewport({ class: unref(props).ui?.viewport })
									}, {
										default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
											return openBlock(), createBlock(unref(SelectGroup_default), {
												key: `group-${groupIndex}`,
												"data-slot": "group",
												class: ui.value.group({ class: unref(props).ui?.group })
											}, {
												default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
													return openBlock(), createBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel_default), {
														key: 0,
														"data-slot": "label",
														class: ui.value.label({ class: [
															unref(props).ui?.label,
															item.ui?.label,
															item.class
														] })
													}, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
														_: 2
													}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator_default), {
														key: 1,
														"data-slot": "separator",
														class: ui.value.separator({ class: [
															unref(props).ui?.separator,
															item.ui?.separator,
															item.class
														] })
													}, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem_default), {
														key: 2,
														"data-slot": "item",
														class: ui.value.item({ class: [
															unref(props).ui?.item,
															isSelectItem(item) && item.ui?.item,
															isSelectItem(item) && item.class
														] }),
														disabled: isSelectItem(item) && item.disabled,
														value: isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
														onSelect: ($event) => isSelectItem(item) && item.onSelect?.($event)
													}, {
														default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
															item,
															index,
															ui: ui.value
														}, () => [
															renderSlot(_ctx.$slots, "item-leading", {
																item,
																index,
																ui: ui.value
															}, () => [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$6, {
																key: 0,
																name: item.icon,
																"data-slot": "itemLeadingIcon",
																class: ui.value.itemLeadingIcon({ class: [unref(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
															}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
																key: 1,
																size: item.ui?.itemLeadingAvatarSize || unref(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
															}, { ref_for: true }, item.avatar, {
																"data-slot": "itemLeadingAvatar",
																class: ui.value.itemLeadingAvatar({ class: [unref(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
															}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
																key: 2,
																size: item.ui?.itemLeadingChipSize || unref(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
																inset: "",
																standalone: ""
															}, { ref_for: true }, item.chip, {
																"data-slot": "itemLeadingChip",
																class: ui.value.itemLeadingChip({ class: [unref(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
															}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
															createVNode("span", {
																"data-slot": "itemWrapper",
																class: ui.value.itemWrapper({ class: [unref(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
															}, [createVNode(unref(SelectItemText_default), {
																"data-slot": "itemLabel",
																class: ui.value.itemLabel({ class: [unref(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
															}, {
																default: withCtx(() => [renderSlot(_ctx.$slots, "item-label", {
																	item,
																	index
																}, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])]),
																_: 2
															}, 1032, ["class"]), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
																key: 0,
																"data-slot": "itemDescription",
																class: ui.value.itemDescription({ class: [unref(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
															}, [renderSlot(_ctx.$slots, "item-description", {
																item,
																index
															}, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
															createVNode("span", {
																"data-slot": "itemTrailing",
																class: ui.value.itemTrailing({ class: [unref(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
															}, [renderSlot(_ctx.$slots, "item-trailing", {
																item,
																index,
																ui: ui.value
															}), createVNode(unref(SelectItemIndicator_default), { "as-child": "" }, {
																default: withCtx(() => [createVNode(_sfc_main$6, {
																	name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
																	"data-slot": "itemTrailingIcon",
																	class: ui.value.itemTrailingIcon({ class: [unref(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
																}, null, 8, ["name", "class"])]),
																_: 2
															}, 1024)], 2)
														])]),
														_: 2
													}, 1032, [
														"class",
														"disabled",
														"value",
														"onSelect"
													]))], 64);
												}), 128))]),
												_: 2
											}, 1032, ["class"]);
										}), 128))]),
										_: 3
									}, 8, ["class"])),
									renderSlot(_ctx.$slots, "content-bottom"),
									!!unref(props).arrow ? (openBlock(), createBlock(unref(SelectArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
										"data-slot": "arrow",
										class: ui.value.arrow({ class: unref(props).ui?.arrow })
									}), null, 16, ["class"])) : createCommentVNode("", true)
								]),
								_: 3
							}, 16, ["class"])]),
							_: 3
						})]),
						_: 3
					}, 16)];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Select.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fbadge.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fbadge_default = {
	"slots": {
		"base": "font-medium inline-flex items-center",
		"label": "truncate",
		"leadingIcon": "shrink-0",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailingIcon": "shrink-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"variant": {
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": ""
		},
		"size": {
			"xs": {
				"base": "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
				"leadingIcon": "size-3",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-3"
			},
			"sm": {
				"base": "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
				"leadingIcon": "size-3",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-3"
			},
			"md": {
				"base": "text-xs px-2 py-1 gap-1 rounded-md",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"lg": {
				"base": "text-sm px-2 py-1 gap-1.5 rounded-md",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "text-base px-2.5 py-1 gap-1.5 rounded-md",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-6"
			}
		},
		"square": { "true": "" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "bg-primary text-inverted"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "bg-secondary text-inverted"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "bg-success text-inverted"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "bg-info text-inverted"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "bg-warning text-inverted"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "bg-error text-inverted"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "text-primary ring ring-inset ring-primary/50"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "text-secondary ring ring-inset ring-secondary/50"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "text-success ring ring-inset ring-success/50"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "text-info ring ring-inset ring-info/50"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "text-warning ring ring-inset ring-warning/50"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "text-error ring ring-inset ring-error/50"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "bg-primary/10 text-primary"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "bg-secondary/10 text-secondary"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "bg-success/10 text-success"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "bg-info/10 text-info"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "bg-warning/10 text-warning"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "bg-error/10 text-error"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "bg-success/10 text-success ring ring-inset ring-success/25"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "bg-info/10 text-info ring ring-inset ring-info/25"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "bg-error/10 text-error ring ring-inset ring-error/25"
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": "text-inverted bg-inverted"
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": "ring ring-inset ring-accented text-default bg-default"
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": "text-default bg-elevated"
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": "ring ring-inset ring-accented text-default bg-elevated"
		},
		{
			"size": "xs",
			"square": true,
			"class": "p-0.5"
		},
		{
			"size": "sm",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "md",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "lg",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "xl",
			"square": true,
			"class": "p-1"
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "solid",
		"size": "md"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Badge.vue
var _sfc_main = {
	__name: "UBadge",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false,
			default: "span"
		},
		label: {
			type: [String, Number],
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		square: {
			type: Boolean,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const _props = __props;
		const slots = useSlots();
		const props = useComponentProps("badge", _props);
		const appConfig = useAppConfig();
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fbadge_default,
			...appConfig.ui?.badge || {}
		})({
			color: props.color,
			variant: props.variant,
			size: fieldGroupSize.value ?? props.size,
			square: props.square || !slots.default && !props.label,
			fieldGroup: orientation.value
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				as: unref(props).as,
				"data-slot": "base",
				class: ui.value.base({ class: [unref(props).ui?.base, unref(props).class] })
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
							if (unref(isLeading) && unref(leadingIconName)) _push(ssrRenderComponent(_sfc_main$6, {
								name: unref(leadingIconName),
								"data-slot": "leadingIcon",
								class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
							}, null, _parent, _scopeId));
							else if (!!unref(props).avatar) _push(ssrRenderComponent(_sfc_main$4, mergeProps({ size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, unref(props).avatar, {
								"data-slot": "leadingAvatar",
								class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
							}), null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
							if (unref(props).label !== void 0 && unref(props).label !== null) _push(`<span data-slot="label" class="${ssrRenderClass(ui.value.label({ class: unref(props).ui?.label }))}"${_scopeId}>${ssrInterpolate(unref(props).label)}</span>`);
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
							if (unref(isTrailing) && unref(trailingIconName)) _push(ssrRenderComponent(_sfc_main$6, {
								name: unref(trailingIconName),
								"data-slot": "trailingIcon",
								class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
					} else return [
						renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
							key: 0,
							name: unref(leadingIconName),
							"data-slot": "leadingIcon",
							class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
						}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$4, mergeProps({
							key: 1,
							size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
						}, unref(props).avatar, {
							"data-slot": "leadingAvatar",
							class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
						}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
						renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [unref(props).label !== void 0 && unref(props).label !== null ? (openBlock(), createBlock("span", {
							key: 0,
							"data-slot": "label",
							class: ui.value.label({ class: unref(props).ui?.label })
						}, toDisplayString(unref(props).label), 3)) : createCommentVNode("", true)]),
						renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
							key: 0,
							name: unref(trailingIconName),
							"data-slot": "trailingIcon",
							class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
						}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Badge.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/composables/fetch.js
var $fetch$1 = $fetch$2;
var MAYBE_REF_OR_GETTER_OPTION_KEYS = [
	"method",
	"baseURL",
	"query",
	"params",
	"body",
	"headers"
];
function generateOptionSegments(opts) {
	const segments = [toValue(opts.method)?.toUpperCase() || "GET", toValue(opts.baseURL)];
	for (const _obj of [opts.query || opts.params]) {
		const obj = toValue(_obj);
		if (!obj) continue;
		const unwrapped = {};
		for (const [key, value] of Object.entries(obj)) unwrapped[toValue(key)] = toValue(value);
		segments.push(unwrapped);
	}
	if (opts.body) {
		const value = toValue(opts.body);
		if (!value) segments.push(hashKey(value));
		else if (value instanceof ArrayBuffer) segments.push(hashKey(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
		else if (value instanceof FormData) {
			const entries = [];
			for (const entry of value.entries()) {
				const [key, val] = entry;
				entries.push([key, val instanceof File ? `${val.name}:${val.size}:${val.lastModified}` : val]);
			}
			segments.push(hashKey(entries));
		} else if (isPlainObject(value)) segments.push(hashKey(reactive(value)));
		else try {
			segments.push(hashKey(value));
		} catch {
			dataDiagnostics.NUXT_E3002({ cause: value });
		}
	}
	return segments;
}
/**
* A factory function to create a custom `useFetch` composable with pre-defined default options.
* @since 4.2.0
*/
var createUseFetch = defineKeyedFunctionFactory({
	name: "createUseFetch",
	factory(options = {}) {
		function useFetch(request, arg1, arg2) {
			const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
			const factoryOptions = typeof options === "function" ? options(opts) : options;
			const { server, lazy, default: defaultFn, transform, pick, watch: watchSources, immediate, getCachedData, deep, dedupe, timeout, enabled, ...fetchOptions } = {
				...typeof options === "function" ? {} : factoryOptions,
				...opts,
				...typeof options === "function" ? factoryOptions : {}
			};
			const _request = computed(() => toValue(request));
			const key = computed(() => toValue(fetchOptions.key) || "$f" + hashKey([
				autoKey,
				typeof _request.value === "string" ? _request.value : "",
				...generateOptionSegments(fetchOptions)
			]));
			if (!fetchOptions.baseURL && typeof _request.value === "string" && _request.value[0] === "/" && _request.value[1] === "/") throw dataDiagnostics.NUXT_E3001({ url: _request.value });
			const _fetchOptions = reactive({
				...fetchDefaults,
				...fetchOptions,
				cache: typeof fetchOptions.cache === "boolean" ? void 0 : fetchOptions.cache
			});
			const _asyncDataOptions = {
				server,
				lazy,
				default: defaultFn,
				transform,
				pick,
				immediate,
				getCachedData,
				deep,
				dedupe,
				timeout,
				enabled,
				watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
			};
			if (watchSources === false) _asyncDataOptions._keyTriggersExecute = false;
			return useAsyncData(key, (_, { signal }) => {
				let _$fetch = fetchOptions.$fetch || $fetch$1;
				if (!fetchOptions.$fetch) {
					if (typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(fetchOptions.baseURL) || toValue(fetchOptions.baseURL)[0] === "/")) _$fetch = useRequestFetch();
				}
				const resolvedOptions = {
					signal,
					..._fetchOptions
				};
				for (const key of MAYBE_REF_OR_GETTER_OPTION_KEYS) if (typeof resolvedOptions[key] === "function") resolvedOptions[key] = toValue(resolvedOptions[key]);
				return _$fetch(_request.value, resolvedOptions);
			}, _asyncDataOptions);
		}
		return useFetch;
	}
});
var useFetch = createUseFetch.__nuxt_factory();
createUseFetch.__nuxt_factory({
	lazy: true,
	_functionName: "useLazyFetch"
});

export { _sfc_main as _, _sfc_main$1 as a, useFetch as u };
//# sourceMappingURL=fetch-CVy4THor.mjs.map
