import { u as useSeoMeta$1, _ as _sfc_main$4, $ as $fetch$2, c as useComponentProps, d as useLocale, e as useAppConfig, f as useForwardProps, t as tv, a as _sfc_main$1$1, b as _sfc_main$6, g as useForwardExpose, P as Primitive, h as _sfc_main$8, i as useFormField, j as useFieldGroup, k as useComponentIcons, l as _sfc_main$4$1, m as createContext, n as looseToNumber } from '../virtual/entry.mjs';
import { u as useFetch, a as _sfc_main$1$2, _ as _sfc_main$5 } from './fetch-CVy4THor.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, isRef, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSlots, renderSlot, Fragment, renderList, withModifiers, toRefs, normalizeProps, guardReactiveProps, resolveComponent, createSlots, useTemplateRef, onScopeDispose, useModel, toRef, mergeModels, nextTick, useSSRContext } from 'vue';
import { E as upperFirst, C as defu } from '../nitro/nitro.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { reactivePick, useVModel, createRef, createReusableTemplate } from '@vueuse/core';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { useVueTable, getExpandedRowModel, getSortedRowModel, getFilteredRowModel, getCoreRowModel, FlexRender } from '@tanstack/vue-table';
import 'nostics';
import 'nostics/formatters/ansi';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import '@vueuse/shared';
import 'aria-hidden';
import 'tailwind-variants';
import 'tailwindcss/colors';
import 'vaul-vue';
import '@vue/shared';
import '@floating-ui/vue';
import 'fnv1a-64';
import 'object-identity';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';

//#region node_modules/reka-ui/dist/Pagination/PaginationEllipsis.js
var PaginationEllipsis_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationEllipsis",
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
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "data-type": "ellipsis" }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createTextVNode("…"))])]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationRoot.js
var [injectPaginationRootContext, providePaginationRootContext] = /*#__PURE__*/ createContext("PaginationRoot");
var PaginationRoot_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationRoot",
	props: {
		page: {
			type: Number,
			required: false
		},
		defaultPage: {
			type: Number,
			required: false,
			default: 1
		},
		itemsPerPage: {
			type: Number,
			required: true
		},
		total: {
			type: Number,
			required: false,
			default: 0
		},
		siblingCount: {
			type: Number,
			required: false,
			default: 2
		},
		disabled: {
			type: Boolean,
			required: false
		},
		showEdges: {
			type: Boolean,
			required: false,
			default: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "nav"
		}
	},
	emits: ["update:page"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { siblingCount, disabled, showEdges } = toRefs(props);
		useForwardExpose();
		const page = useVModel(props, "page", emits, {
			defaultValue: props.defaultPage,
			passive: props.page === void 0
		});
		const pageCount = computed(() => Math.max(1, Math.ceil(props.total / (props.itemsPerPage || 1))));
		providePaginationRootContext({
			page,
			onPageChange(value) {
				page.value = value;
			},
			pageCount,
			siblingCount,
			disabled,
			showEdges
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				as: _ctx.as,
				"as-child": _ctx.asChild
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
					page: unref(page),
					pageCount: pageCount.value
				})]),
				_: 3
			}, 8, ["as", "as-child"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationFirst.js
var PaginationFirst_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationFirst",
	props: {
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
		const rootContext = injectPaginationRootContext();
		useForwardExpose();
		const disabled = computed(() => rootContext.page.value === 1 || rootContext.disabled.value);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"aria-label": "First Page",
				type: _ctx.as === "button" ? "button" : void 0,
				disabled: disabled.value,
				onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(1))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("First page"))])]),
				_: 3
			}, 16, ["type", "disabled"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationLast.js
var PaginationLast_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationLast",
	props: {
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
		const rootContext = injectPaginationRootContext();
		useForwardExpose();
		const disabled = computed(() => rootContext.page.value === rootContext.pageCount.value || rootContext.disabled.value);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"aria-label": "Last Page",
				type: _ctx.as === "button" ? "button" : void 0,
				disabled: disabled.value,
				onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).pageCount.value))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Last page"))])]),
				_: 3
			}, 16, ["type", "disabled"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/utils.js
function range(start, end) {
	const length = end - start + 1;
	return Array.from({ length }, (_, idx) => idx + start);
}
function transform(items) {
	return items.map((value) => {
		if (typeof value === "number") return {
			type: "page",
			value
		};
		return { type: "ellipsis" };
	});
}
var ELLIPSIS = "ellipsis";
function getRange(currentPage, pageCount, siblingCount, showEdges) {
	const firstPageIndex = 1;
	const lastPageIndex = pageCount;
	const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPageIndex);
	const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPageIndex);
	if (showEdges) {
		const itemCount = Math.min(2 * siblingCount + 5, pageCount) - 2;
		const showLeftEllipsis = leftSiblingIndex > 3 && Math.abs(lastPageIndex - itemCount - firstPageIndex + 1) > 2 && Math.abs(leftSiblingIndex - firstPageIndex) > 2;
		const showRightEllipsis = rightSiblingIndex < lastPageIndex - 2 && Math.abs(lastPageIndex - itemCount) > 2 && Math.abs(lastPageIndex - rightSiblingIndex) > 2;
		if (!showLeftEllipsis && showRightEllipsis) return [
			...range(1, itemCount),
			ELLIPSIS,
			lastPageIndex
		];
		if (showLeftEllipsis && !showRightEllipsis) return [
			firstPageIndex,
			ELLIPSIS,
			...range(lastPageIndex - itemCount + 1, lastPageIndex)
		];
		if (showLeftEllipsis && showRightEllipsis) return [
			firstPageIndex,
			ELLIPSIS,
			...range(leftSiblingIndex, rightSiblingIndex),
			ELLIPSIS,
			lastPageIndex
		];
		return range(firstPageIndex, lastPageIndex);
	} else {
		const itemCount = siblingCount * 2 + 1;
		if (pageCount < itemCount) return range(1, lastPageIndex);
		else if (currentPage <= siblingCount + 1) return range(firstPageIndex, itemCount);
		else if (pageCount - currentPage <= siblingCount) return range(pageCount - itemCount + 1, lastPageIndex);
		else return range(leftSiblingIndex, rightSiblingIndex);
	}
}
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationList.js
var PaginationList_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationList",
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
		useForwardExpose();
		const rootContext = injectPaginationRootContext();
		const transformedRange = computed(() => {
			return transform(getRange(rootContext.page.value, rootContext.pageCount.value, rootContext.siblingCount.value, rootContext.showEdges.value));
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { items: transformedRange.value })]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationListItem.js
var PaginationListItem_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationListItem",
	props: {
		value: {
			type: Number,
			required: true
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
		useForwardExpose();
		const rootContext = injectPaginationRootContext();
		const isSelected = computed(() => rootContext.page.value === props.value);
		const disabled = computed(() => rootContext.disabled.value);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"data-type": "page",
				"aria-label": `Page ${_ctx.value}`,
				"aria-current": isSelected.value ? "page" : void 0,
				"data-selected": isSelected.value ? "true" : void 0,
				disabled: disabled.value,
				type: _ctx.as === "button" ? "button" : void 0,
				onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(_ctx.value))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.value), 1)])]),
				_: 3
			}, 16, [
				"aria-label",
				"aria-current",
				"data-selected",
				"disabled",
				"type"
			]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationNext.js
var PaginationNext_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationNext",
	props: {
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
		useForwardExpose();
		const rootContext = injectPaginationRootContext();
		const disabled = computed(() => rootContext.page.value === rootContext.pageCount.value || rootContext.disabled.value);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"aria-label": "Next Page",
				type: _ctx.as === "button" ? "button" : void 0,
				disabled: disabled.value,
				onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).page.value + 1))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Next page"))])]),
				_: 3
			}, 16, ["type", "disabled"]);
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Pagination/PaginationPrev.js
var PaginationPrev_default = /* @__PURE__ */ defineComponent({
	__name: "PaginationPrev",
	props: {
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
		useForwardExpose();
		const rootContext = injectPaginationRootContext();
		const disabled = computed(() => rootContext.page.value === 1 || rootContext.disabled.value);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"aria-label": "Previous Page",
				type: _ctx.as === "button" ? "button" : void 0,
				disabled: disabled.value,
				onClick: _cache[0] || (_cache[0] = ($event) => !disabled.value && unref(rootContext).onPageChange(unref(rootContext).page.value - 1))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[1] || (_cache[1] = createTextVNode("Prev page"))])]),
				_: 3
			}, 16, ["type", "disabled"]);
		};
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Finput.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Finput_default = {
	"slots": {
		"root": "relative inline-flex items-center",
		"base": ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute inset-y-0 start-0 flex items-center",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute inset-y-0 end-0 flex items-center",
		"trailingIcon": "shrink-0 text-dimmed"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
			},
			"vertical": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
			}
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-sm/4 gap-1",
				"leading": "ps-2",
				"trailing": "pe-2",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-base/5 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-base/5 gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
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
		"type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" }
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
		"variant": "outline"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Input.vue
var _sfc_main$3 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UInput",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		id: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		type: {
			type: null,
			required: false,
			default: "text"
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
		required: {
			type: Boolean,
			required: false
		},
		autocomplete: {
			type: [String, Object],
			required: false,
			default: "off"
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
		disabled: {
			type: Boolean,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		fixed: {
			type: Boolean,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelModifiers: {
			type: null,
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
		"update:modelValue",
		"blur",
		"change"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("input", _props);
		const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
		const appConfig = useAppConfig();
		const { emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, emitFormFocus, ariaAttrs } = useFormField(_props, { deferInputValidation: true });
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
		const color = computed(() => formFieldColor.value ?? props.color);
		const highlight = computed(() => formFieldHighlight.value ?? props.highlight);
		const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size);
		const disabled = computed(() => formFieldDisabled.value ?? props.disabled);
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Finput_default,
			...appConfig.ui?.input || {}
		})({
			type: props.type,
			color: color.value,
			variant: props.variant,
			size: size.value,
			loading: props.loading,
			highlight: highlight.value,
			fixed: props.fixed,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing,
			fieldGroup: orientation.value
		}));
		const inputRef = useTemplateRef("inputRef");
		function updateInput(value) {
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number || props.type === "number") value = looseToNumber(value);
			if (props.modelModifiers?.nullable) value ||= null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) value ||= void 0;
			modelValue.value = value;
			emitFormInput();
		}
		function onInput(event) {
			if (!props.modelModifiers?.lazy) updateInput(event.target.value);
		}
		function onChange(event) {
			const value = event.target.value;
			if (props.modelModifiers?.lazy) updateInput(value);
			if (props.modelModifiers?.trim) event.target.value = value.trim();
			emitFormChange();
			emits("change", event);
		}
		function onBlur(event) {
			emitFormBlur();
			emits("blur", event);
		}
		let autofocusTimeoutId;
		onScopeDispose(() => clearTimeout(autofocusTimeoutId));
		__expose({ inputRef });
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				as: unref(props).as,
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${ssrRenderAttrs(mergeProps({
							id: unref(id),
							ref_key: "inputRef",
							ref: inputRef,
							type: unref(props).type,
							value: unref(modelValue),
							name: unref(name),
							placeholder: unref(props).placeholder,
							class: ui.value.base({ class: unref(props).ui?.base }),
							disabled: disabled.value,
							required: unref(props).required,
							autocomplete: unref(props).autocomplete
						}, {
							..._ctx.$attrs,
							...unref(ariaAttrs)
						}, { "data-slot": "base" }))}${_scopeId}>`);
						ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, null, _push, _parent, _scopeId);
						if (unref(isLeading) || !!unref(props).avatar || !!slots.leading) {
							_push(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: unref(props).ui?.leading }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
								if (unref(isLeading) && unref(leadingIconName)) _push(ssrRenderComponent(_sfc_main$6, {
									name: unref(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
								}, null, _parent, _scopeId));
								else if (!!unref(props).avatar) _push(ssrRenderComponent(_sfc_main$4$1, mergeProps({ size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, unref(props).avatar, {
									"data-slot": "leadingAvatar",
									class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
								}), null, _parent, _scopeId));
								else _push(`<!---->`);
							}, _push, _parent, _scopeId);
							_push(`</span>`);
						} else _push(`<!---->`);
						if (unref(isTrailing) || !!slots.trailing) {
							_push(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(props).ui?.trailing }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
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
						createVNode("input", mergeProps({
							id: unref(id),
							ref_key: "inputRef",
							ref: inputRef,
							type: unref(props).type,
							value: unref(modelValue),
							name: unref(name),
							placeholder: unref(props).placeholder,
							class: ui.value.base({ class: unref(props).ui?.base }),
							disabled: disabled.value,
							required: unref(props).required,
							autocomplete: unref(props).autocomplete
						}, {
							..._ctx.$attrs,
							...unref(ariaAttrs)
						}, {
							"data-slot": "base",
							onInput,
							onBlur,
							onChange,
							onFocus: unref(emitFormFocus)
						}), null, 16, [
							"id",
							"type",
							"value",
							"name",
							"placeholder",
							"disabled",
							"required",
							"autocomplete",
							"onFocus"
						]),
						renderSlot(_ctx.$slots, "default", { ui: ui.value }),
						unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
							key: 0,
							"data-slot": "leading",
							class: ui.value.leading({ class: unref(props).ui?.leading })
						}, [renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
							key: 0,
							name: unref(leadingIconName),
							"data-slot": "leadingIcon",
							class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
						}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$4$1, mergeProps({
							key: 1,
							size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
						}, unref(props).avatar, {
							"data-slot": "leadingAvatar",
							class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
						}), null, 16, ["size", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true),
						unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
							key: 1,
							"data-slot": "trailing",
							class: ui.value.trailing({ class: unref(props).ui?.trailing })
						}, [renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
							key: 0,
							name: unref(trailingIconName),
							"data-slot": "trailingIcon",
							class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
						}, null, 8, ["name", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true)
					];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$7 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Input.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
//#endregion
//#region app/components/JobFilters.vue?vue&type=script&setup=true&lang.ts
var JobFilters_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "JobFilters",
	__ssrInlineRender: true,
	props: { modelValue: {} },
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const sources = [
			"LinkedIn",
			"Job Bank",
			"Greenhouse",
			"Lever",
			"Ashby",
			"Workday",
			"Adzuna",
			"BuiltIn",
			"RemoteOK"
		];
		function update(field, value) {
			emit("update:modelValue", {
				...props.modelValue,
				[field]: value == null ? "" : String(value)
			});
		}
		function clear() {
			emit("update:modelValue", {
				source: "",
				bucket: "",
				level: "",
				remote: "",
				score_min: "",
				score_max: "",
				rec: "",
				search: ""
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UInput = _sfc_main$3;
			const _component_USelect = _sfc_main$1$2;
			const _component_UButton = _sfc_main$1$1;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap gap-3 items-end" }, _attrs))}>`);
			_push(ssrRenderComponent(_component_UInput, {
				"model-value": __props.modelValue.search,
				placeholder: "Search title, company, location…",
				icon: "i-lucide-search",
				class: "w-64",
				"onUpdate:modelValue": ($event) => update("search", $event)
			}, null, _parent));
			_push(ssrRenderComponent(_component_USelect, {
				"model-value": __props.modelValue.source,
				items: [{
					label: "All sources",
					value: ""
				}, ...sources.map((s) => ({
					label: s,
					value: s
				}))],
				"onUpdate:modelValue": ($event) => update("source", $event)
			}, null, _parent));
			_push(ssrRenderComponent(_component_USelect, {
				"model-value": __props.modelValue.bucket,
				items: [
					{
						label: "All buckets",
						value: ""
					},
					{
						label: "IT / Technology",
						value: "it"
					},
					{
						label: "Software / Engineering",
						value: "sw"
					}
				],
				"onUpdate:modelValue": ($event) => update("bucket", $event)
			}, null, _parent));
			_push(ssrRenderComponent(_component_USelect, {
				"model-value": __props.modelValue.level,
				items: [
					{
						label: "All levels",
						value: ""
					},
					{
						label: "Director",
						value: "director"
					},
					{
						label: "Manager",
						value: "manager"
					}
				],
				"onUpdate:modelValue": ($event) => update("level", $event)
			}, null, _parent));
			_push(ssrRenderComponent(_component_USelect, {
				"model-value": __props.modelValue.remote,
				items: [
					{
						label: "On-site & Remote",
						value: ""
					},
					{
						label: "Remote only",
						value: "1"
					},
					{
						label: "On-site only",
						value: "0"
					}
				],
				"onUpdate:modelValue": ($event) => update("remote", $event)
			}, null, _parent));
			_push(ssrRenderComponent(_component_USelect, {
				"model-value": __props.modelValue.rec,
				items: [
					{
						label: "All recommendations",
						value: ""
					},
					{
						label: "Apply",
						value: "Apply"
					},
					{
						label: "Review",
						value: "Review"
					},
					{
						label: "Skip",
						value: "Skip"
					}
				],
				"onUpdate:modelValue": ($event) => update("rec", $event)
			}, null, _parent));
			_push(`<div class="flex gap-2 items-center"><span class="text-sm text-muted">Score</span>`);
			_push(ssrRenderComponent(_component_UInput, {
				"model-value": __props.modelValue.score_min,
				type: "number",
				min: "0",
				max: "10",
				step: "0.5",
				placeholder: "Min",
				class: "w-20",
				"onUpdate:modelValue": ($event) => update("score_min", $event)
			}, null, _parent));
			_push(`<span class="text-muted">–</span>`);
			_push(ssrRenderComponent(_component_UInput, {
				"model-value": __props.modelValue.score_max,
				type: "number",
				min: "0",
				max: "10",
				step: "0.5",
				placeholder: "Max",
				class: "w-20",
				"onUpdate:modelValue": ($event) => update("score_max", $event)
			}, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UButton, {
				variant: "ghost",
				icon: "i-lucide-x",
				onClick: clear
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Clear `);
					else return [createTextVNode(" Clear ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/JobFilters.vue
var _sfc_setup$6 = JobFilters_vue_vue_type_script_setup_true_lang_default.setup;
JobFilters_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/JobFilters.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var JobFilters_default = Object.assign(JobFilters_vue_vue_type_script_setup_true_lang_default, { __name: "JobFilters" });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ftable.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftable_default = {
	"slots": {
		"root": "relative overflow-auto outline-primary/25 focus-visible:outline-3",
		"base": "min-w-full overflow-clip",
		"caption": "sr-only",
		"thead": "relative",
		"tbody": "isolate [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:outline-primary/25 [&>tr]:data-[selectable=true]:focus-visible:outline-3 divide-y divide-default",
		"tfoot": "relative",
		"tr": "data-[selected=true]:bg-elevated/50",
		"th": "px-4 py-3.5 text-sm text-highlighted text-start font-semibold [&:has([role=checkbox])]:pe-0",
		"td": "p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0",
		"separator": "absolute z-1 start-0 w-full h-px bg-(--ui-border-accented)",
		"empty": "py-6 text-center text-sm text-muted",
		"loading": "py-6 text-center"
	},
	"variants": {
		"pinned": { "true": {
			"th": "sticky bg-default/75 z-1",
			"td": "sticky bg-default/75 z-1"
		} },
		"sticky": {
			"true": {
				"thead": "sticky top-0 inset-x-0 bg-default/75 backdrop-blur-sm z-1",
				"tfoot": "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur-sm z-1"
			},
			"header": { "thead": "sticky top-0 inset-x-0 bg-default/75 backdrop-blur-sm z-1" },
			"footer": { "tfoot": "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur-sm z-1" }
		},
		"loading": { "true": { "thead": "after:absolute after:z-1 after:h-px motion-reduce:after:inset-x-0 motion-reduce:after:animate-pulse" } },
		"externalScroll": { "true": { "root": "overflow-visible" } },
		"loadingAnimation": {
			"carousel": "",
			"carousel-inverse": "",
			"swing": "",
			"elastic": ""
		},
		"loadingColor": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		}
	},
	"compoundVariants": [
		{
			"loading": true,
			"loadingColor": "primary",
			"class": { "thead": "after:bg-primary" }
		},
		{
			"loading": true,
			"loadingColor": "secondary",
			"class": { "thead": "after:bg-secondary" }
		},
		{
			"loading": true,
			"loadingColor": "success",
			"class": { "thead": "after:bg-success" }
		},
		{
			"loading": true,
			"loadingColor": "info",
			"class": { "thead": "after:bg-info" }
		},
		{
			"loading": true,
			"loadingColor": "warning",
			"class": { "thead": "after:bg-warning" }
		},
		{
			"loading": true,
			"loadingColor": "error",
			"class": { "thead": "after:bg-error" }
		},
		{
			"loading": true,
			"loadingColor": "neutral",
			"class": { "thead": "after:bg-inverted" }
		},
		{
			"loading": true,
			"loadingAnimation": "carousel",
			"class": { "thead": "motion-safe:after:animate-[carousel_2s_linear_infinite] motion-safe:rtl:after:animate-[carousel-rtl_2s_linear_infinite]" }
		},
		{
			"loading": true,
			"loadingAnimation": "carousel-inverse",
			"class": { "thead": "motion-safe:after:animate-[carousel-inverse_2s_linear_infinite] motion-safe:rtl:after:animate-[carousel-inverse-rtl_2s_linear_infinite]" }
		},
		{
			"loading": true,
			"loadingAnimation": "swing",
			"class": { "thead": "motion-safe:after:animate-[swing_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"loading": true,
			"loadingAnimation": "elastic",
			"class": { "thead": "motion-safe:after:animate-[elastic_2s_var(--ease-in-out)_infinite]" }
		}
	],
	"defaultVariants": {
		"loadingColor": "primary",
		"loadingAnimation": "carousel"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Table.vue
var _sfc_main$2 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UTable",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		as: {
			type: null,
			required: false
		},
		data: {
			type: Array,
			required: false
		},
		columns: {
			type: Array,
			required: false
		},
		caption: {
			type: String,
			required: false
		},
		meta: {
			type: Object,
			required: false
		},
		virtualize: {
			type: [Boolean, Object],
			required: false,
			default: false
		},
		empty: {
			type: String,
			required: false
		},
		sticky: {
			type: [Boolean, String],
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingColor: {
			type: null,
			required: false
		},
		loadingAnimation: {
			type: null,
			required: false
		},
		watchOptions: {
			type: Object,
			required: false,
			default: () => ({ deep: true })
		},
		globalFilterOptions: {
			type: Object,
			required: false
		},
		columnFiltersOptions: {
			type: Object,
			required: false
		},
		columnPinningOptions: {
			type: Object,
			required: false
		},
		columnSizingOptions: {
			type: Object,
			required: false
		},
		visibilityOptions: {
			type: Object,
			required: false
		},
		sortingOptions: {
			type: Object,
			required: false
		},
		groupingOptions: {
			type: Object,
			required: false
		},
		expandedOptions: {
			type: Object,
			required: false
		},
		rowSelectionOptions: {
			type: Object,
			required: false
		},
		rowPinningOptions: {
			type: Object,
			required: false
		},
		paginationOptions: {
			type: Object,
			required: false
		},
		facetedOptions: {
			type: Object,
			required: false
		},
		onSelect: {
			type: Function,
			required: false
		},
		onHover: {
			type: Function,
			required: false
		},
		onContextmenu: {
			type: [Function, Array],
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
		state: {
			type: Object,
			required: false
		},
		onStateChange: {
			type: Function,
			required: false
		},
		renderFallbackValue: {
			type: null,
			required: false
		},
		_features: {
			type: Array,
			required: false
		},
		autoResetAll: {
			type: Boolean,
			required: false
		},
		debugAll: {
			type: Boolean,
			required: false
		},
		debugCells: {
			type: Boolean,
			required: false
		},
		debugColumns: {
			type: Boolean,
			required: false
		},
		debugHeaders: {
			type: Boolean,
			required: false
		},
		debugRows: {
			type: Boolean,
			required: false
		},
		debugTable: {
			type: Boolean,
			required: false
		},
		defaultColumn: {
			type: Object,
			required: false
		},
		getRowId: {
			type: Function,
			required: false
		},
		getSubRows: {
			type: Function,
			required: false
		},
		initialState: {
			type: Object,
			required: false
		},
		mergeOptions: {
			type: Function,
			required: false
		}
	}, {
		"globalFilter": { type: String },
		"globalFilterModifiers": {},
		"columnFilters": { type: Array },
		"columnFiltersModifiers": {},
		"columnOrder": { type: Array },
		"columnOrderModifiers": {},
		"columnVisibility": { type: Object },
		"columnVisibilityModifiers": {},
		"columnPinning": { type: Object },
		"columnPinningModifiers": {},
		"columnSizing": { type: Object },
		"columnSizingModifiers": {},
		"columnSizingInfo": { type: Object },
		"columnSizingInfoModifiers": {},
		"rowSelection": { type: Object },
		"rowSelectionModifiers": {},
		"rowPinning": { type: Object },
		"rowPinningModifiers": {},
		"sorting": { type: Array },
		"sortingModifiers": {},
		"grouping": { type: Array },
		"groupingModifiers": {},
		"expanded": { type: [Boolean, Object] },
		"expandedModifiers": {},
		"pagination": { type: Object },
		"paginationModifiers": {}
	}),
	emits: [
		"update:globalFilter",
		"update:columnFilters",
		"update:columnOrder",
		"update:columnVisibility",
		"update:columnPinning",
		"update:columnSizing",
		"update:columnSizingInfo",
		"update:rowSelection",
		"update:rowPinning",
		"update:sorting",
		"update:grouping",
		"update:expanded",
		"update:pagination"
	],
	setup(__props, { expose: __expose }) {
		const _props = __props;
		const slots = useSlots();
		const props = useComponentProps("table", _props);
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const data = createRef(props.data ?? [], props.watchOptions?.deep !== false);
		const meta = computed(() => props.meta ?? {});
		const columns = computed(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey) => ({
			accessorKey,
			header: upperFirst(accessorKey)
		}))));
		function processColumns(columns2) {
			return columns2.map((column) => {
				const col = { ...column };
				if ("columns" in col && col.columns) col.columns = processColumns(col.columns);
				if (!col.cell) col.cell = ({ getValue }) => {
					const value = getValue();
					if (value === "" || value === null || value === void 0) return "\xA0";
					return String(value);
				};
				return col;
			});
		}
		const isExternalScroll = computed(() => typeof props.virtualize === "object" && !!props.virtualize.getScrollElement);
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftable_default,
			...appConfig.ui?.table || {}
		})({
			sticky: props.sticky,
			loading: props.loading,
			loadingColor: props.loadingColor,
			loadingAnimation: props.loadingAnimation,
			externalScroll: isExternalScroll.value
		}));
		const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate();
		const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate({ props: {
			row: {
				type: Object,
				required: true
			},
			style: {
				type: Object,
				required: false
			}
		} });
		const hasFooter = computed(() => {
			function hasFooterRecursive(columns2) {
				for (const column of columns2) {
					if ("footer" in column) return true;
					if ("columns" in column && hasFooterRecursive(column.columns)) return true;
				}
				return false;
			}
			return hasFooterRecursive(columns.value);
		});
		const globalFilterState = useModel(__props, "globalFilter");
		const columnFiltersState = useModel(__props, "columnFilters");
		const columnOrderState = useModel(__props, "columnOrder");
		const columnVisibilityState = useModel(__props, "columnVisibility");
		const columnPinningState = useModel(__props, "columnPinning");
		const columnSizingState = useModel(__props, "columnSizing");
		const columnSizingInfoState = useModel(__props, "columnSizingInfo");
		const rowSelectionState = useModel(__props, "rowSelection");
		const rowPinningState = useModel(__props, "rowPinning");
		const sortingState = useModel(__props, "sorting");
		const groupingState = useModel(__props, "grouping");
		const expandedState = useModel(__props, "expanded");
		const paginationState = useModel(__props, "pagination");
		const rootRef = useTemplateRef("rootRef");
		const tableRef = useTemplateRef("tableRef");
		const tableProps = useForwardProps(reactivePick(props, "_features", "autoResetAll", "debugAll", "debugCells", "debugColumns", "debugHeaders", "debugRows", "debugTable", "defaultColumn", "getRowId", "getSubRows", "initialState", "mergeOptions", "renderFallbackValue"));
		const tableApi = useVueTable({
			...tableProps.value,
			get data() {
				return data.value;
			},
			get columns() {
				return columns.value;
			},
			meta: meta.value,
			getCoreRowModel: getCoreRowModel(),
			...props.globalFilterOptions || {},
			...globalFilterState.value !== void 0 && { onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilterState) },
			...props.columnFiltersOptions || {},
			getFilteredRowModel: getFilteredRowModel(),
			...columnFiltersState.value !== void 0 && { onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFiltersState) },
			...columnOrderState.value !== void 0 && { onColumnOrderChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnOrderState) },
			...props.visibilityOptions || {},
			...columnVisibilityState.value !== void 0 && { onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibilityState) },
			...props.columnPinningOptions || {},
			...columnPinningState.value !== void 0 && { onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnPinningState) },
			...props.columnSizingOptions || {},
			...columnSizingState.value !== void 0 && { onColumnSizingChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingState) },
			...columnSizingInfoState.value !== void 0 && { onColumnSizingInfoChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingInfoState) },
			...props.rowSelectionOptions || {},
			...rowSelectionState.value !== void 0 && { onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelectionState) },
			...props.rowPinningOptions || {},
			...rowPinningState.value !== void 0 && { onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinningState) },
			...props.sortingOptions || {},
			getSortedRowModel: getSortedRowModel(),
			...sortingState.value !== void 0 && { onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sortingState) },
			...props.groupingOptions || {},
			...groupingState.value !== void 0 && { onGroupingChange: (updaterOrValue) => valueUpdater(updaterOrValue, groupingState) },
			...props.expandedOptions || {},
			getExpandedRowModel: getExpandedRowModel(),
			...expandedState.value !== void 0 && { onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expandedState) },
			...props.paginationOptions || {},
			...paginationState.value !== void 0 && { onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, paginationState) },
			...props.facetedOptions || {},
			state: {
				get globalFilter() {
					return globalFilterState.value;
				},
				get columnFilters() {
					return columnFiltersState.value;
				},
				get columnOrder() {
					return columnOrderState.value;
				},
				get columnVisibility() {
					return columnVisibilityState.value;
				},
				get columnPinning() {
					return columnPinningState.value;
				},
				get expanded() {
					return expandedState.value;
				},
				get rowSelection() {
					return rowSelectionState.value;
				},
				get sorting() {
					return sortingState.value;
				},
				get grouping() {
					return groupingState.value;
				},
				get rowPinning() {
					return rowPinningState.value;
				},
				get columnSizing() {
					return columnSizingState.value;
				},
				get columnSizingInfo() {
					return columnSizingInfoState.value;
				},
				get pagination() {
					return paginationState.value;
				}
			}
		});
		const rows = computed(() => tableApi.getRowModel().rows);
		const topRows = computed(() => props.virtualize ? [] : tableApi.getTopRows());
		const bottomRows = computed(() => props.virtualize ? [] : tableApi.getBottomRows());
		const centerRows = computed(() => topRows.value.length || bottomRows.value.length ? tableApi.getCenterRows() : rows.value);
		const virtualizerProps = toRef(() => defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
			estimateSize: 65,
			overscan: 12
		}));
		const getScrollElement = () => (isExternalScroll.value ? virtualizerProps.value.getScrollElement?.() : rootRef.value?.$el) ?? null;
		const scrollMargin = computed(() => virtualizerProps.value.scrollMargin ?? 0);
		const virtualizer = !!props.virtualize && useVirtualizer({
			...virtualizerProps.value,
			get count() {
				return centerRows.value.length;
			},
			get scrollMargin() {
				return scrollMargin.value;
			},
			getScrollElement,
			estimateSize: (index) => {
				const estimate = virtualizerProps.value.estimateSize;
				return typeof estimate === "function" ? estimate(index) : estimate;
			}
		});
		const virtualItems = computed(() => virtualizer ? virtualizer.value.getVirtualItems() : []);
		const virtualPaddingTop = computed(() => (virtualItems.value[0]?.start ?? 0) - scrollMargin.value);
		const virtualPaddingBottom = computed(() => {
			if (!virtualizer || !virtualItems.value.length) return 0;
			return virtualizer.value.getTotalSize() - (virtualItems.value[virtualItems.value.length - 1]?.end ?? 0) + scrollMargin.value;
		});
		function valueUpdater(updaterOrValue, ref) {
			ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
		}
		function onRowSelect(e, row) {
			if (!props.onSelect) return;
			const target = e.target;
			if (target.closest("button") || target.closest("a")) return;
			e.preventDefault();
			e.stopPropagation();
			props.onSelect(e, row);
		}
		function onRowHover(e, row) {
			if (!props.onHover) return;
			props.onHover(e, row);
		}
		function onRowContextmenu(e, row) {
			if (!props.onContextmenu) return;
			if (Array.isArray(props.onContextmenu)) props.onContextmenu.forEach((fn) => fn(e, row));
			else props.onContextmenu(e, row);
		}
		function resolveValue(prop, arg) {
			if (typeof prop === "function") return prop(arg);
			return prop;
		}
		function getColumnStyles(column) {
			const styles = {};
			const pinned = column.getIsPinned();
			if (pinned === "left") styles.left = `${column.getStart("left")}px`;
			else if (pinned === "right") styles.right = `${column.getAfter("right")}px`;
			return styles;
		}
		watch(() => props.data, () => {
			data.value = props.data ? [...props.data] : [];
		}, props.watchOptions);
		__expose({
			get $el() {
				return rootRef.value?.$el;
			},
			tableRef,
			tableApi
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(DefineRowTemplate), null, {
				default: withCtx(({ row, style }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<tr${ssrRenderAttr("data-selected", row.getIsSelected())}${ssrRenderAttr("data-selectable", !!unref(props).onSelect || !!unref(props).onHover || !!unref(props).onContextmenu)}${ssrRenderAttr("data-expanded", row.getIsExpanded())}${ssrRenderAttr("data-pinned", row.getIsPinned() || void 0)}${ssrRenderAttr("role", unref(props).onSelect ? "button" : void 0)}${ssrRenderAttr("tabindex", unref(props).onSelect ? 0 : void 0)} data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(props).ui?.tr, resolveValue(unref(tableApi).options.meta?.class?.tr, row)] }))}" style="${ssrRenderStyle([resolveValue(unref(tableApi).options.meta?.style?.tr, row), style])}"${_scopeId}><!--[-->`);
						ssrRenderList(row.getVisibleCells(), (cell) => {
							_push(`<td${ssrRenderAttr("data-pinned", cell.column.getIsPinned())}${ssrRenderAttr("colspan", resolveValue(cell.column.columnDef.meta?.colspan?.td, cell))}${ssrRenderAttr("rowspan", resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell))} data-slot="td" class="${ssrRenderClass(ui.value.td({
								class: [unref(props).ui?.td, resolveValue(cell.column.columnDef.meta?.class?.td, cell)],
								pinned: !!cell.column.getIsPinned()
							}))}" style="${ssrRenderStyle([getColumnStyles(cell.column), resolveValue(cell.column.columnDef.meta?.style?.td, cell)])}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, `${cell.column.id}-cell`, mergeProps({ ref_for: true }, cell.getContext()), () => {
								_push(ssrRenderComponent(unref(FlexRender), {
									render: cell.column.columnDef.cell,
									props: cell.getContext()
								}, null, _parent, _scopeId));
							}, _push, _parent, _scopeId);
							_push(`</td>`);
						});
						_push(`<!--]--></tr>`);
						if (row.getIsExpanded()) {
							_push(`<tr data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(props).ui?.tr] }))}"${_scopeId}><td${ssrRenderAttr("colspan", row.getAllCells().length)} data-slot="td" class="${ssrRenderClass(ui.value.td({ class: [unref(props).ui?.td] }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "expanded", { row }, null, _push, _parent, _scopeId);
							_push(`</td></tr>`);
						} else _push(`<!---->`);
					} else return [createVNode("tr", {
						"data-selected": row.getIsSelected(),
						"data-selectable": !!unref(props).onSelect || !!unref(props).onHover || !!unref(props).onContextmenu,
						"data-expanded": row.getIsExpanded(),
						"data-pinned": row.getIsPinned() || void 0,
						role: unref(props).onSelect ? "button" : void 0,
						tabindex: unref(props).onSelect ? 0 : void 0,
						"data-slot": "tr",
						class: ui.value.tr({ class: [unref(props).ui?.tr, resolveValue(unref(tableApi).options.meta?.class?.tr, row)] }),
						style: [resolveValue(unref(tableApi).options.meta?.style?.tr, row), style],
						onClick: ($event) => onRowSelect($event, row),
						onPointerenter: ($event) => onRowHover($event, row),
						onPointerleave: ($event) => onRowHover($event, null),
						onContextmenu: ($event) => onRowContextmenu($event, row)
					}, [(openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
						return openBlock(), createBlock("td", {
							key: cell.id,
							"data-pinned": cell.column.getIsPinned(),
							colspan: resolveValue(cell.column.columnDef.meta?.colspan?.td, cell),
							rowspan: resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell),
							"data-slot": "td",
							class: ui.value.td({
								class: [unref(props).ui?.td, resolveValue(cell.column.columnDef.meta?.class?.td, cell)],
								pinned: !!cell.column.getIsPinned()
							}),
							style: [getColumnStyles(cell.column), resolveValue(cell.column.columnDef.meta?.style?.td, cell)]
						}, [renderSlot(_ctx.$slots, `${cell.column.id}-cell`, mergeProps({ ref_for: true }, cell.getContext()), () => [createVNode(unref(FlexRender), {
							render: cell.column.columnDef.cell,
							props: cell.getContext()
						}, null, 8, ["render", "props"])])], 14, [
							"data-pinned",
							"colspan",
							"rowspan"
						]);
					}), 128))], 46, [
						"data-selected",
						"data-selectable",
						"data-expanded",
						"data-pinned",
						"role",
						"tabindex",
						"onClick",
						"onPointerenter",
						"onPointerleave",
						"onContextmenu"
					]), row.getIsExpanded() ? (openBlock(), createBlock("tr", {
						key: 0,
						"data-slot": "tr",
						class: ui.value.tr({ class: [unref(props).ui?.tr] })
					}, [createVNode("td", {
						colspan: row.getAllCells().length,
						"data-slot": "td",
						class: ui.value.td({ class: [unref(props).ui?.td] })
					}, [renderSlot(_ctx.$slots, "expanded", { row })], 10, ["colspan"])], 2)) : createCommentVNode("", true)];
				}),
				_: 3
			}, _parent));
			_push(ssrRenderComponent(unref(DefineTableTemplate), null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<table data-slot="base" class="${ssrRenderClass(ui.value.base({ class: [unref(props).ui?.base] }))}"${_scopeId}>`);
						if (unref(props).caption || !!slots.caption) {
							_push(`<caption data-slot="caption" class="${ssrRenderClass(ui.value.caption({ class: [unref(props).ui?.caption] }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "caption", {}, () => {
								_push(`${ssrInterpolate(unref(props).caption)}`);
							}, _push, _parent, _scopeId);
							_push(`</caption>`);
						} else _push(`<!---->`);
						_push(`<thead data-slot="thead" class="${ssrRenderClass(ui.value.thead({ class: [unref(props).ui?.thead] }))}"${_scopeId}><!--[-->`);
						ssrRenderList(unref(tableApi).getHeaderGroups(), (headerGroup) => {
							_push(`<tr data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(props).ui?.tr] }))}"${_scopeId}><!--[-->`);
							ssrRenderList(headerGroup.headers, (header) => {
								_push(`<th${ssrRenderAttr("data-pinned", header.column.getIsPinned())}${ssrRenderAttr("scope", header.colSpan > 1 ? "colgroup" : "col")}${ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} data-slot="th" class="${ssrRenderClass(ui.value.th({
									class: [unref(props).ui?.th, resolveValue(header.column.columnDef.meta?.class?.th, header)],
									pinned: !!header.column.getIsPinned()
								}))}" style="${ssrRenderStyle([getColumnStyles(header.column), resolveValue(header.column.columnDef.meta?.style?.th, header)])}"${_scopeId}>`);
								ssrRenderSlot(_ctx.$slots, `${header.id}-header`, mergeProps({ ref_for: true }, header.getContext()), () => {
									if (!header.isPlaceholder) _push(ssrRenderComponent(unref(FlexRender), {
										render: header.column.columnDef.header,
										props: header.getContext()
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
								_push(`</th>`);
							});
							_push(`<!--]--></tr>`);
						});
						_push(`<!--]--><tr data-slot="separator" class="${ssrRenderClass(ui.value.separator({ class: [unref(props).ui?.separator] }))}"${_scopeId}></tr></thead><tbody data-slot="tbody" class="${ssrRenderClass(ui.value.tbody({ class: [unref(props).ui?.tbody] }))}"${_scopeId}>`);
						ssrRenderSlot(_ctx.$slots, "body-top", {}, null, _push, _parent, _scopeId);
						if (rows.value.length) {
							_push(`<!--[--><!--[-->`);
							ssrRenderList(topRows.value, (row) => {
								_push(ssrRenderComponent(unref(ReuseRowTemplate), {
									key: row.id,
									row
								}, null, _parent, _scopeId));
							});
							_push(`<!--]-->`);
							if (unref(virtualizer)) {
								_push(`<!--[-->`);
								if (virtualPaddingTop.value > 0) _push(`<tr style="${ssrRenderStyle({ height: `${virtualPaddingTop.value}px` })}" aria-hidden="true"${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)}${_scopeId}></td></tr>`);
								else _push(`<!---->`);
								_push(`<!--[-->`);
								ssrRenderList(virtualItems.value, (virtualRow) => {
									_push(`<!--[-->`);
									if (centerRows.value[virtualRow.index]) _push(ssrRenderComponent(unref(ReuseRowTemplate), {
										row: centerRows.value[virtualRow.index],
										style: { height: `${virtualRow.size}px` }
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`<!--]-->`);
								});
								_push(`<!--]-->`);
								if (virtualPaddingBottom.value > 0) _push(`<tr style="${ssrRenderStyle({ height: `${virtualPaddingBottom.value}px` })}" aria-hidden="true"${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)}${_scopeId}></td></tr>`);
								else _push(`<!---->`);
								_push(`<!--]-->`);
							} else {
								_push(`<!--[-->`);
								ssrRenderList(centerRows.value, (row) => {
									_push(ssrRenderComponent(unref(ReuseRowTemplate), {
										key: row.id,
										row
									}, null, _parent, _scopeId));
								});
								_push(`<!--]-->`);
							}
							_push(`<!--[-->`);
							ssrRenderList(bottomRows.value, (row) => {
								_push(ssrRenderComponent(unref(ReuseRowTemplate), {
									key: row.id,
									row
								}, null, _parent, _scopeId));
							});
							_push(`<!--]--><!--]-->`);
						} else if (unref(props).loading && !!slots["loading"]) {
							_push(`<tr${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)} data-slot="loading" class="${ssrRenderClass(ui.value.loading({ class: unref(props).ui?.loading }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "loading", {}, null, _push, _parent, _scopeId);
							_push(`</td></tr>`);
						} else {
							_push(`<tr${_scopeId}><td${ssrRenderAttr("colspan", unref(tableApi).getAllLeafColumns().length)} data-slot="empty" class="${ssrRenderClass(ui.value.empty({ class: unref(props).ui?.empty }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
								_push(`${ssrInterpolate(unref(props).empty || unref(t)("table.noData"))}`);
							}, _push, _parent, _scopeId);
							_push(`</td></tr>`);
						}
						ssrRenderSlot(_ctx.$slots, "body-bottom", {}, null, _push, _parent, _scopeId);
						_push(`</tbody>`);
						if (hasFooter.value) {
							_push(`<tfoot data-slot="tfoot" class="${ssrRenderClass(ui.value.tfoot({ class: [unref(props).ui?.tfoot] }))}"${_scopeId}><tr data-slot="separator" class="${ssrRenderClass(ui.value.separator({ class: [unref(props).ui?.separator] }))}"${_scopeId}></tr><!--[-->`);
							ssrRenderList(unref(tableApi).getFooterGroups(), (footerGroup) => {
								_push(`<tr data-slot="tr" class="${ssrRenderClass(ui.value.tr({ class: [unref(props).ui?.tr] }))}"${_scopeId}><!--[-->`);
								ssrRenderList(footerGroup.headers, (header) => {
									_push(`<th${ssrRenderAttr("data-pinned", header.column.getIsPinned())}${ssrRenderAttr("colspan", header.colSpan > 1 ? header.colSpan : void 0)}${ssrRenderAttr("rowspan", header.rowSpan > 1 ? header.rowSpan : void 0)} data-slot="th" class="${ssrRenderClass(ui.value.th({
										class: [unref(props).ui?.th, resolveValue(header.column.columnDef.meta?.class?.th, header)],
										pinned: !!header.column.getIsPinned()
									}))}" style="${ssrRenderStyle([getColumnStyles(header.column), resolveValue(header.column.columnDef.meta?.style?.th, header)])}"${_scopeId}>`);
									ssrRenderSlot(_ctx.$slots, `${header.id}-footer`, mergeProps({ ref_for: true }, header.getContext()), () => {
										if (!header.isPlaceholder) _push(ssrRenderComponent(unref(FlexRender), {
											render: header.column.columnDef.footer,
											props: header.getContext()
										}, null, _parent, _scopeId));
										else _push(`<!---->`);
									}, _push, _parent, _scopeId);
									_push(`</th>`);
								});
								_push(`<!--]--></tr>`);
							});
							_push(`<!--]--></tfoot>`);
						} else _push(`<!---->`);
						_push(`</table>`);
					} else return [createVNode("table", {
						ref_key: "tableRef",
						ref: tableRef,
						"data-slot": "base",
						class: ui.value.base({ class: [unref(props).ui?.base] })
					}, [
						unref(props).caption || !!slots.caption ? (openBlock(), createBlock("caption", {
							key: 0,
							"data-slot": "caption",
							class: ui.value.caption({ class: [unref(props).ui?.caption] })
						}, [renderSlot(_ctx.$slots, "caption", {}, () => [createTextVNode(toDisplayString(unref(props).caption), 1)])], 2)) : createCommentVNode("", true),
						createVNode("thead", {
							"data-slot": "thead",
							class: ui.value.thead({ class: [unref(props).ui?.thead] })
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(tableApi).getHeaderGroups(), (headerGroup) => {
							return openBlock(), createBlock("tr", {
								key: headerGroup.id,
								"data-slot": "tr",
								class: ui.value.tr({ class: [unref(props).ui?.tr] })
							}, [(openBlock(true), createBlock(Fragment, null, renderList(headerGroup.headers, (header) => {
								return openBlock(), createBlock("th", {
									key: header.id,
									"data-pinned": header.column.getIsPinned(),
									scope: header.colSpan > 1 ? "colgroup" : "col",
									colspan: header.colSpan > 1 ? header.colSpan : void 0,
									rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
									"data-slot": "th",
									class: ui.value.th({
										class: [unref(props).ui?.th, resolveValue(header.column.columnDef.meta?.class?.th, header)],
										pinned: !!header.column.getIsPinned()
									}),
									style: [getColumnStyles(header.column), resolveValue(header.column.columnDef.meta?.style?.th, header)]
								}, [renderSlot(_ctx.$slots, `${header.id}-header`, mergeProps({ ref_for: true }, header.getContext()), () => [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
									key: 0,
									render: header.column.columnDef.header,
									props: header.getContext()
								}, null, 8, ["render", "props"])) : createCommentVNode("", true)])], 14, [
									"data-pinned",
									"scope",
									"colspan",
									"rowspan"
								]);
							}), 128))], 2);
						}), 128)), createVNode("tr", {
							"data-slot": "separator",
							class: ui.value.separator({ class: [unref(props).ui?.separator] })
						}, null, 2)], 2),
						createVNode("tbody", {
							"data-slot": "tbody",
							class: ui.value.tbody({ class: [unref(props).ui?.tbody] })
						}, [
							renderSlot(_ctx.$slots, "body-top"),
							rows.value.length ? (openBlock(), createBlock(Fragment, { key: 0 }, [
								(openBlock(true), createBlock(Fragment, null, renderList(topRows.value, (row) => {
									return openBlock(), createBlock(unref(ReuseRowTemplate), {
										key: row.id,
										row
									}, null, 8, ["row"]);
								}), 128)),
								unref(virtualizer) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
									virtualPaddingTop.value > 0 ? (openBlock(), createBlock("tr", {
										key: 0,
										style: { height: `${virtualPaddingTop.value}px` },
										"aria-hidden": "true"
									}, [createVNode("td", { colspan: unref(tableApi).getAllLeafColumns().length }, null, 8, ["colspan"])], 4)) : createCommentVNode("", true),
									(openBlock(true), createBlock(Fragment, null, renderList(virtualItems.value, (virtualRow) => {
										return openBlock(), createBlock(Fragment, { key: centerRows.value[virtualRow.index]?.id ?? `virtual-${virtualRow.index}` }, [centerRows.value[virtualRow.index] ? (openBlock(), createBlock(unref(ReuseRowTemplate), {
											key: 0,
											row: centerRows.value[virtualRow.index],
											style: { height: `${virtualRow.size}px` }
										}, null, 8, ["row", "style"])) : createCommentVNode("", true)], 64);
									}), 128)),
									virtualPaddingBottom.value > 0 ? (openBlock(), createBlock("tr", {
										key: 1,
										style: { height: `${virtualPaddingBottom.value}px` },
										"aria-hidden": "true"
									}, [createVNode("td", { colspan: unref(tableApi).getAllLeafColumns().length }, null, 8, ["colspan"])], 4)) : createCommentVNode("", true)
								], 64)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(centerRows.value, (row) => {
									return openBlock(), createBlock(unref(ReuseRowTemplate), {
										key: row.id,
										row
									}, null, 8, ["row"]);
								}), 128)),
								(openBlock(true), createBlock(Fragment, null, renderList(bottomRows.value, (row) => {
									return openBlock(), createBlock(unref(ReuseRowTemplate), {
										key: row.id,
										row
									}, null, 8, ["row"]);
								}), 128))
							], 64)) : unref(props).loading && !!slots["loading"] ? (openBlock(), createBlock("tr", { key: 1 }, [createVNode("td", {
								colspan: unref(tableApi).getAllLeafColumns().length,
								"data-slot": "loading",
								class: ui.value.loading({ class: unref(props).ui?.loading })
							}, [renderSlot(_ctx.$slots, "loading")], 10, ["colspan"])])) : (openBlock(), createBlock("tr", { key: 2 }, [createVNode("td", {
								colspan: unref(tableApi).getAllLeafColumns().length,
								"data-slot": "empty",
								class: ui.value.empty({ class: unref(props).ui?.empty })
							}, [renderSlot(_ctx.$slots, "empty", {}, () => [createTextVNode(toDisplayString(unref(props).empty || unref(t)("table.noData")), 1)])], 10, ["colspan"])])),
							renderSlot(_ctx.$slots, "body-bottom")
						], 2),
						hasFooter.value ? (openBlock(), createBlock("tfoot", {
							key: 1,
							"data-slot": "tfoot",
							class: ui.value.tfoot({ class: [unref(props).ui?.tfoot] })
						}, [createVNode("tr", {
							"data-slot": "separator",
							class: ui.value.separator({ class: [unref(props).ui?.separator] })
						}, null, 2), (openBlock(true), createBlock(Fragment, null, renderList(unref(tableApi).getFooterGroups(), (footerGroup) => {
							return openBlock(), createBlock("tr", {
								key: footerGroup.id,
								"data-slot": "tr",
								class: ui.value.tr({ class: [unref(props).ui?.tr] })
							}, [(openBlock(true), createBlock(Fragment, null, renderList(footerGroup.headers, (header) => {
								return openBlock(), createBlock("th", {
									key: header.id,
									"data-pinned": header.column.getIsPinned(),
									colspan: header.colSpan > 1 ? header.colSpan : void 0,
									rowspan: header.rowSpan > 1 ? header.rowSpan : void 0,
									"data-slot": "th",
									class: ui.value.th({
										class: [unref(props).ui?.th, resolveValue(header.column.columnDef.meta?.class?.th, header)],
										pinned: !!header.column.getIsPinned()
									}),
									style: [getColumnStyles(header.column), resolveValue(header.column.columnDef.meta?.style?.th, header)]
								}, [renderSlot(_ctx.$slots, `${header.id}-footer`, mergeProps({ ref_for: true }, header.getContext()), () => [!header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
									key: 0,
									render: header.column.columnDef.footer,
									props: header.getContext()
								}, null, 8, ["render", "props"])) : createCommentVNode("", true)])], 14, [
									"data-pinned",
									"colspan",
									"rowspan"
								]);
							}), 128))], 2);
						}), 128))], 2)) : createCommentVNode("", true)
					], 2)];
				}),
				_: 3
			}, _parent));
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				ref_key: "rootRef",
				ref: rootRef,
				as: unref(props).as,
				"data-slot": "root"
			}, _ctx.$attrs, { class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] }) }), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(ReuseTableTemplate), null, null, _parent, _scopeId));
					else return [createVNode(unref(ReuseTableTemplate))];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup$5 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Table.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region app/components/JobTable.vue?vue&type=script&setup=true&lang.ts
var JobTable_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "JobTable",
	__ssrInlineRender: true,
	props: {
		jobs: {},
		loading: { type: Boolean }
	},
	emits: ["select", "shortlist"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const columns = [
			{
				accessorKey: "score",
				header: "Score",
				enableSorting: true
			},
			{
				accessorKey: "title",
				header: "Title"
			},
			{
				accessorKey: "company",
				header: "Company"
			},
			{
				accessorKey: "location",
				header: "Location"
			},
			{
				accessorKey: "source",
				header: "Source"
			},
			{
				accessorKey: "recommendation",
				header: "Rec"
			},
			{
				id: "actions",
				header: ""
			}
		];
		function scoreColor(score) {
			if (score === null) return "neutral";
			if (score >= 8) return "success";
			if (score >= 6.5) return "primary";
			if (score >= 5) return "warning";
			return "error";
		}
		function recColor(rec) {
			if (rec === "Apply") return "success";
			if (rec === "Review") return "warning";
			return "neutral";
		}
		function sourceColor(source) {
			return {
				"LinkedIn": "primary",
				"Job Bank": "success",
				"Greenhouse": "secondary",
				"Lever": "info",
				"Ashby": "warning",
				"Workday": "primary",
				"Adzuna": "error"
			}[source] ?? "neutral";
		}
		function handleSelect(_, row) {
			emit("select", row.original);
		}
		function handleShortlist(row) {
			emit("shortlist", row.original);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UTable = _sfc_main$2;
			const _component_UBadge = _sfc_main$5;
			const _component_UIcon = _sfc_main$6;
			const _component_UButton = _sfc_main$1$1;
			_push(ssrRenderComponent(_component_UTable, mergeProps({
				data: __props.jobs,
				columns,
				loading: __props.loading,
				hover: "",
				onSelect: handleSelect
			}, _attrs), {
				"score-data": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UBadge, {
						color: scoreColor(row.original.score),
						variant: "soft",
						class: "font-mono font-bold"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(row.original.score?.toFixed(1) ?? "—")}`);
							else return [createTextVNode(toDisplayString(row.original.score?.toFixed(1) ?? "—"), 1)];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(_component_UBadge, {
						color: scoreColor(row.original.score),
						variant: "soft",
						class: "font-mono font-bold"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(row.original.score?.toFixed(1) ?? "—"), 1)]),
						_: 2
					}, 1032, ["color"])];
				}),
				"title-data": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex items-center gap-2"${_scopeId}><span class="font-medium"${_scopeId}>${ssrInterpolate(row.original.title)}</span>`);
						if (row.original.shortlisted) _push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-star",
							class: "text-warning text-sm"
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex items-center gap-2" }, [createVNode("span", { class: "font-medium" }, toDisplayString(row.original.title), 1), row.original.shortlisted ? (openBlock(), createBlock(_component_UIcon, {
						key: 0,
						name: "i-lucide-star",
						class: "text-warning text-sm"
					})) : createCommentVNode("", true)])];
				}),
				"source-data": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UBadge, {
						color: sourceColor(row.original.source),
						variant: "outline",
						size: "xs"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(row.original.source)}`);
							else return [createTextVNode(toDisplayString(row.original.source), 1)];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(_component_UBadge, {
						color: sourceColor(row.original.source),
						variant: "outline",
						size: "xs"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(row.original.source), 1)]),
						_: 2
					}, 1032, ["color"])];
				}),
				"location-data": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex items-center gap-1 text-sm text-muted"${_scopeId}>`);
						if (row.original.remote) _push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-wifi",
							class: "text-success"
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(` ${ssrInterpolate(row.original.location || "—")}</div>`);
					} else return [createVNode("div", { class: "flex items-center gap-1 text-sm text-muted" }, [row.original.remote ? (openBlock(), createBlock(_component_UIcon, {
						key: 0,
						name: "i-lucide-wifi",
						class: "text-success"
					})) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(row.original.location || "—"), 1)])];
				}),
				"recommendation-data": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						if (row.original.recommendation) _push(ssrRenderComponent(_component_UBadge, {
							color: recColor(row.original.recommendation),
							size: "xs"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(row.original.recommendation)}`);
								else return [createTextVNode(toDisplayString(row.original.recommendation), 1)];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [row.original.recommendation ? (openBlock(), createBlock(_component_UBadge, {
						key: 0,
						color: recColor(row.original.recommendation),
						size: "xs"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(row.original.recommendation), 1)]),
						_: 2
					}, 1032, ["color"])) : createCommentVNode("", true)];
				}),
				"actions-data": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UButton, {
						icon: row.original.shortlisted ? "i-lucide-star-off" : "i-lucide-star",
						color: row.original.shortlisted ? "warning" : "neutral",
						variant: "ghost",
						size: "xs",
						onClick: ($event) => handleShortlist(row)
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UButton, {
						icon: row.original.shortlisted ? "i-lucide-star-off" : "i-lucide-star",
						color: row.original.shortlisted ? "warning" : "neutral",
						variant: "ghost",
						size: "xs",
						onClick: withModifiers(($event) => handleShortlist(row), ["stop"])
					}, null, 8, [
						"icon",
						"color",
						"onClick"
					])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/components/JobTable.vue
var _sfc_setup$4 = JobTable_vue_vue_type_script_setup_true_lang_default.setup;
JobTable_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/JobTable.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var JobTable_default = Object.assign(JobTable_vue_vue_type_script_setup_true_lang_default, { __name: "JobTable" });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fpagination.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fpagination_default = { "slots": {
	"root": "",
	"list": "flex items-center gap-1",
	"ellipsis": "pointer-events-none",
	"label": "min-w-5 text-center",
	"first": "",
	"prev": "",
	"item": "",
	"next": "",
	"last": ""
} };
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue
var _sfc_main$1 = {
	__name: "UPagination",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		firstIcon: {
			type: null,
			required: false
		},
		prevIcon: {
			type: null,
			required: false
		},
		nextIcon: {
			type: null,
			required: false
		},
		lastIcon: {
			type: null,
			required: false
		},
		ellipsisIcon: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false,
			default: "neutral"
		},
		variant: {
			type: null,
			required: false,
			default: "outline"
		},
		activeColor: {
			type: null,
			required: false,
			default: "primary"
		},
		activeVariant: {
			type: null,
			required: false,
			default: "solid"
		},
		showControls: {
			type: Boolean,
			required: false,
			default: true
		},
		size: {
			type: null,
			required: false
		},
		to: {
			type: Function,
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
		defaultPage: {
			type: Number,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		itemsPerPage: {
			type: Number,
			required: false,
			default: 10
		},
		page: {
			type: Number,
			required: false
		},
		showEdges: {
			type: Boolean,
			required: false,
			default: false
		},
		siblingCount: {
			type: Number,
			required: false,
			default: 2
		},
		total: {
			type: Number,
			required: false,
			default: 0
		}
	},
	emits: ["update:page"],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("pagination", _props);
		const { dir } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "as", "defaultPage", "disabled", "itemsPerPage", "page", "showEdges", "siblingCount", "total"), emits);
		const firstIcon = computed(() => props.firstIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
		const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
		const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
		const lastIcon = computed(() => props.lastIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fpagination_default,
			...appConfig.ui?.pagination || {}
		})());
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(PaginationRoot_default), mergeProps(unref(rootProps), {
				"data-slot": "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
			}, _attrs), {
				default: withCtx(({ page, pageCount }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(PaginationList_default), {
						"data-slot": "list",
						class: ui.value.list({ class: unref(props).ui?.list })
					}, {
						default: withCtx(({ items }, _push, _parent, _scopeId) => {
							if (_push) {
								if (unref(props).showControls || !!slots.first) _push(ssrRenderComponent(unref(PaginationFirst_default), {
									"as-child": "",
									"data-slot": "first",
									class: ui.value.first({ class: unref(props).ui?.first })
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "first", {}, () => {
											_push(ssrRenderComponent(_sfc_main$1$1, {
												color: unref(props).color,
												variant: unref(props).variant,
												size: unref(props).size,
												icon: firstIcon.value,
												to: unref(props).to?.(1)
											}, null, _parent, _scopeId));
										}, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "first", {}, () => [createVNode(_sfc_main$1$1, {
											color: unref(props).color,
											variant: unref(props).variant,
											size: unref(props).size,
											icon: firstIcon.value,
											to: unref(props).to?.(1)
										}, null, 8, [
											"color",
											"variant",
											"size",
											"icon",
											"to"
										])])];
									}),
									_: 2
								}, _parent, _scopeId));
								else _push(`<!---->`);
								if (unref(props).showControls || !!slots.prev) _push(ssrRenderComponent(unref(PaginationPrev_default), {
									"as-child": "",
									"data-slot": "prev",
									class: ui.value.prev({ class: unref(props).ui?.prev })
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "prev", {}, () => {
											_push(ssrRenderComponent(_sfc_main$1$1, {
												color: unref(props).color,
												variant: unref(props).variant,
												size: unref(props).size,
												icon: prevIcon.value,
												to: page > 1 ? unref(props).to?.(page - 1) : void 0
											}, null, _parent, _scopeId));
										}, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "prev", {}, () => [createVNode(_sfc_main$1$1, {
											color: unref(props).color,
											variant: unref(props).variant,
											size: unref(props).size,
											icon: prevIcon.value,
											to: page > 1 ? unref(props).to?.(page - 1) : void 0
										}, null, 8, [
											"color",
											"variant",
											"size",
											"icon",
											"to"
										])])];
									}),
									_: 2
								}, _parent, _scopeId));
								else _push(`<!---->`);
								_push(`<!--[-->`);
								ssrRenderList(items, (item, index) => {
									_push(`<!--[-->`);
									if (item.type === "page") _push(ssrRenderComponent(unref(PaginationListItem_default), {
										"as-child": "",
										value: item.value,
										"data-slot": "item",
										class: ui.value.item({ class: unref(props).ui?.item })
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) ssrRenderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, {
												item,
												index,
												page,
												pageCount
											}), () => {
												_push(ssrRenderComponent(_sfc_main$1$1, {
													color: page === item.value ? unref(props).activeColor : unref(props).color,
													variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
													size: unref(props).size,
													label: String(item.value),
													ui: { label: ui.value.label() },
													to: unref(props).to?.(item.value),
													square: ""
												}, null, _parent, _scopeId));
											}, _push, _parent, _scopeId);
											else return [renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, {
												item,
												index,
												page,
												pageCount
											}), () => [createVNode(_sfc_main$1$1, {
												color: page === item.value ? unref(props).activeColor : unref(props).color,
												variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
												size: unref(props).size,
												label: String(item.value),
												ui: { label: ui.value.label() },
												to: unref(props).to?.(item.value),
												square: ""
											}, null, 8, [
												"color",
												"variant",
												"size",
												"label",
												"ui",
												"to"
											])])];
										}),
										_: 2
									}, _parent, _scopeId));
									else _push(ssrRenderComponent(unref(PaginationEllipsis_default), {
										"as-child": "",
										"data-slot": "ellipsis",
										class: ui.value.ellipsis({ class: unref(props).ui?.ellipsis })
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) ssrRenderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => {
												_push(ssrRenderComponent(_sfc_main$1$1, {
													as: "div",
													color: unref(props).color,
													variant: unref(props).variant,
													size: unref(props).size,
													icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
												}, null, _parent, _scopeId));
											}, _push, _parent, _scopeId);
											else return [renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [createVNode(_sfc_main$1$1, {
												as: "div",
												color: unref(props).color,
												variant: unref(props).variant,
												size: unref(props).size,
												icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
											}, null, 8, [
												"color",
												"variant",
												"size",
												"icon"
											])])];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(`<!--]-->`);
								});
								_push(`<!--]-->`);
								if (unref(props).showControls || !!slots.next) _push(ssrRenderComponent(unref(PaginationNext_default), {
									"as-child": "",
									"data-slot": "next",
									class: ui.value.next({ class: unref(props).ui?.next })
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "next", {}, () => {
											_push(ssrRenderComponent(_sfc_main$1$1, {
												color: unref(props).color,
												variant: unref(props).variant,
												size: unref(props).size,
												icon: nextIcon.value,
												to: page < pageCount ? unref(props).to?.(page + 1) : void 0
											}, null, _parent, _scopeId));
										}, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "next", {}, () => [createVNode(_sfc_main$1$1, {
											color: unref(props).color,
											variant: unref(props).variant,
											size: unref(props).size,
											icon: nextIcon.value,
											to: page < pageCount ? unref(props).to?.(page + 1) : void 0
										}, null, 8, [
											"color",
											"variant",
											"size",
											"icon",
											"to"
										])])];
									}),
									_: 2
								}, _parent, _scopeId));
								else _push(`<!---->`);
								if (unref(props).showControls || !!slots.last) _push(ssrRenderComponent(unref(PaginationLast_default), {
									"as-child": "",
									"data-slot": "last",
									class: ui.value.last({ class: unref(props).ui?.last })
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "last", {}, () => {
											_push(ssrRenderComponent(_sfc_main$1$1, {
												color: unref(props).color,
												variant: unref(props).variant,
												size: unref(props).size,
												icon: lastIcon.value,
												to: unref(props).to?.(pageCount)
											}, null, _parent, _scopeId));
										}, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "last", {}, () => [createVNode(_sfc_main$1$1, {
											color: unref(props).color,
											variant: unref(props).variant,
											size: unref(props).size,
											icon: lastIcon.value,
											to: unref(props).to?.(pageCount)
										}, null, 8, [
											"color",
											"variant",
											"size",
											"icon",
											"to"
										])])];
									}),
									_: 2
								}, _parent, _scopeId));
								else _push(`<!---->`);
							} else return [
								unref(props).showControls || !!slots.first ? (openBlock(), createBlock(unref(PaginationFirst_default), {
									key: 0,
									"as-child": "",
									"data-slot": "first",
									class: ui.value.first({ class: unref(props).ui?.first })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "first", {}, () => [createVNode(_sfc_main$1$1, {
										color: unref(props).color,
										variant: unref(props).variant,
										size: unref(props).size,
										icon: firstIcon.value,
										to: unref(props).to?.(1)
									}, null, 8, [
										"color",
										"variant",
										"size",
										"icon",
										"to"
									])])]),
									_: 3
								}, 8, ["class"])) : createCommentVNode("", true),
								unref(props).showControls || !!slots.prev ? (openBlock(), createBlock(unref(PaginationPrev_default), {
									key: 1,
									"as-child": "",
									"data-slot": "prev",
									class: ui.value.prev({ class: unref(props).ui?.prev })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "prev", {}, () => [createVNode(_sfc_main$1$1, {
										color: unref(props).color,
										variant: unref(props).variant,
										size: unref(props).size,
										icon: prevIcon.value,
										to: page > 1 ? unref(props).to?.(page - 1) : void 0
									}, null, 8, [
										"color",
										"variant",
										"size",
										"icon",
										"to"
									])])]),
									_: 2
								}, 1032, ["class"])) : createCommentVNode("", true),
								(openBlock(true), createBlock(Fragment, null, renderList(items, (item, index) => {
									return openBlock(), createBlock(Fragment, { key: index }, [item.type === "page" ? (openBlock(), createBlock(unref(PaginationListItem_default), {
										key: 0,
										"as-child": "",
										value: item.value,
										"data-slot": "item",
										class: ui.value.item({ class: unref(props).ui?.item })
									}, {
										default: withCtx(() => [renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, {
											item,
											index,
											page,
											pageCount
										}), () => [createVNode(_sfc_main$1$1, {
											color: page === item.value ? unref(props).activeColor : unref(props).color,
											variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
											size: unref(props).size,
											label: String(item.value),
											ui: { label: ui.value.label() },
											to: unref(props).to?.(item.value),
											square: ""
										}, null, 8, [
											"color",
											"variant",
											"size",
											"label",
											"ui",
											"to"
										])])]),
										_: 2
									}, 1032, ["value", "class"])) : (openBlock(), createBlock(unref(PaginationEllipsis_default), {
										key: 1,
										"as-child": "",
										"data-slot": "ellipsis",
										class: ui.value.ellipsis({ class: unref(props).ui?.ellipsis })
									}, {
										default: withCtx(() => [renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [createVNode(_sfc_main$1$1, {
											as: "div",
											color: unref(props).color,
											variant: unref(props).variant,
											size: unref(props).size,
											icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
										}, null, 8, [
											"color",
											"variant",
											"size",
											"icon"
										])])]),
										_: 3
									}, 8, ["class"]))], 64);
								}), 128)),
								unref(props).showControls || !!slots.next ? (openBlock(), createBlock(unref(PaginationNext_default), {
									key: 2,
									"as-child": "",
									"data-slot": "next",
									class: ui.value.next({ class: unref(props).ui?.next })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "next", {}, () => [createVNode(_sfc_main$1$1, {
										color: unref(props).color,
										variant: unref(props).variant,
										size: unref(props).size,
										icon: nextIcon.value,
										to: page < pageCount ? unref(props).to?.(page + 1) : void 0
									}, null, 8, [
										"color",
										"variant",
										"size",
										"icon",
										"to"
									])])]),
									_: 2
								}, 1032, ["class"])) : createCommentVNode("", true),
								unref(props).showControls || !!slots.last ? (openBlock(), createBlock(unref(PaginationLast_default), {
									key: 3,
									"as-child": "",
									"data-slot": "last",
									class: ui.value.last({ class: unref(props).ui?.last })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "last", {}, () => [createVNode(_sfc_main$1$1, {
										color: unref(props).color,
										variant: unref(props).variant,
										size: unref(props).size,
										icon: lastIcon.value,
										to: unref(props).to?.(pageCount)
									}, null, 8, [
										"color",
										"variant",
										"size",
										"icon",
										"to"
									])])]),
									_: 2
								}, 1032, ["class"])) : createCommentVNode("", true)
							];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(unref(PaginationList_default), {
						"data-slot": "list",
						class: ui.value.list({ class: unref(props).ui?.list })
					}, {
						default: withCtx(({ items }) => [
							unref(props).showControls || !!slots.first ? (openBlock(), createBlock(unref(PaginationFirst_default), {
								key: 0,
								"as-child": "",
								"data-slot": "first",
								class: ui.value.first({ class: unref(props).ui?.first })
							}, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "first", {}, () => [createVNode(_sfc_main$1$1, {
									color: unref(props).color,
									variant: unref(props).variant,
									size: unref(props).size,
									icon: firstIcon.value,
									to: unref(props).to?.(1)
								}, null, 8, [
									"color",
									"variant",
									"size",
									"icon",
									"to"
								])])]),
								_: 3
							}, 8, ["class"])) : createCommentVNode("", true),
							unref(props).showControls || !!slots.prev ? (openBlock(), createBlock(unref(PaginationPrev_default), {
								key: 1,
								"as-child": "",
								"data-slot": "prev",
								class: ui.value.prev({ class: unref(props).ui?.prev })
							}, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "prev", {}, () => [createVNode(_sfc_main$1$1, {
									color: unref(props).color,
									variant: unref(props).variant,
									size: unref(props).size,
									icon: prevIcon.value,
									to: page > 1 ? unref(props).to?.(page - 1) : void 0
								}, null, 8, [
									"color",
									"variant",
									"size",
									"icon",
									"to"
								])])]),
								_: 2
							}, 1032, ["class"])) : createCommentVNode("", true),
							(openBlock(true), createBlock(Fragment, null, renderList(items, (item, index) => {
								return openBlock(), createBlock(Fragment, { key: index }, [item.type === "page" ? (openBlock(), createBlock(unref(PaginationListItem_default), {
									key: 0,
									"as-child": "",
									value: item.value,
									"data-slot": "item",
									class: ui.value.item({ class: unref(props).ui?.item })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, {
										item,
										index,
										page,
										pageCount
									}), () => [createVNode(_sfc_main$1$1, {
										color: page === item.value ? unref(props).activeColor : unref(props).color,
										variant: page === item.value ? unref(props).activeVariant : unref(props).variant,
										size: unref(props).size,
										label: String(item.value),
										ui: { label: ui.value.label() },
										to: unref(props).to?.(item.value),
										square: ""
									}, null, 8, [
										"color",
										"variant",
										"size",
										"label",
										"ui",
										"to"
									])])]),
									_: 2
								}, 1032, ["value", "class"])) : (openBlock(), createBlock(unref(PaginationEllipsis_default), {
									key: 1,
									"as-child": "",
									"data-slot": "ellipsis",
									class: ui.value.ellipsis({ class: unref(props).ui?.ellipsis })
								}, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "ellipsis", { ui: ui.value }, () => [createVNode(_sfc_main$1$1, {
										as: "div",
										color: unref(props).color,
										variant: unref(props).variant,
										size: unref(props).size,
										icon: unref(props).ellipsisIcon || unref(appConfig).ui.icons.ellipsis
									}, null, 8, [
										"color",
										"variant",
										"size",
										"icon"
									])])]),
									_: 3
								}, 8, ["class"]))], 64);
							}), 128)),
							unref(props).showControls || !!slots.next ? (openBlock(), createBlock(unref(PaginationNext_default), {
								key: 2,
								"as-child": "",
								"data-slot": "next",
								class: ui.value.next({ class: unref(props).ui?.next })
							}, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "next", {}, () => [createVNode(_sfc_main$1$1, {
									color: unref(props).color,
									variant: unref(props).variant,
									size: unref(props).size,
									icon: nextIcon.value,
									to: page < pageCount ? unref(props).to?.(page + 1) : void 0
								}, null, 8, [
									"color",
									"variant",
									"size",
									"icon",
									"to"
								])])]),
								_: 2
							}, 1032, ["class"])) : createCommentVNode("", true),
							unref(props).showControls || !!slots.last ? (openBlock(), createBlock(unref(PaginationLast_default), {
								key: 3,
								"as-child": "",
								"data-slot": "last",
								class: ui.value.last({ class: unref(props).ui?.last })
							}, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "last", {}, () => [createVNode(_sfc_main$1$1, {
									color: unref(props).color,
									variant: unref(props).variant,
									size: unref(props).size,
									icon: lastIcon.value,
									to: unref(props).to?.(pageCount)
								}, null, 8, [
									"color",
									"variant",
									"size",
									"icon",
									"to"
								])])]),
								_: 2
							}, 1032, ["class"])) : createCommentVNode("", true)
						]),
						_: 2
					}, 1032, ["class"])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$3 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Pagination.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ftextarea.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftextarea_default = {
	"slots": {
		"root": "relative inline-flex items-center",
		"base": ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute start-0 flex items-start",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute end-0 flex items-start",
		"trailingIcon": "shrink-0 text-dimmed"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
			},
			"vertical": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
			}
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-sm/4 gap-1",
				"leading": "ps-2 inset-y-1",
				"trailing": "pe-2 inset-y-1",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
				"leading": "ps-2.5 inset-y-1.5",
				"trailing": "pe-2.5 inset-y-1.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-base/5 gap-1.5",
				"leading": "ps-2.5 inset-y-1.5",
				"trailing": "pe-2.5 inset-y-1.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-base/5 gap-2",
				"leading": "ps-3 inset-y-2",
				"trailing": "pe-3 inset-y-2",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3 inset-y-2",
				"trailing": "pe-3 inset-y-2",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
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
		"autoresize": { "true": { "base": "resize-none" } }
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
		"variant": "outline"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UTextarea",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		id: {
			type: String,
			required: false
		},
		name: {
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
		required: {
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
		autoresize: {
			type: Boolean,
			required: false
		},
		autoresizeDelay: {
			type: Number,
			required: false,
			default: 0
		},
		disabled: {
			type: Boolean,
			required: false
		},
		rows: {
			type: Number,
			required: false,
			default: 3
		},
		maxrows: {
			type: Number,
			required: false,
			default: 0
		},
		highlight: {
			type: Boolean,
			required: false
		},
		fixed: {
			type: Boolean,
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
		"update:modelValue",
		"blur",
		"change"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("textarea", _props);
		const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
		const appConfig = useAppConfig();
		const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField(_props, { deferInputValidation: true });
		const color = computed(() => formFieldColor.value ?? props.color);
		const highlight = computed(() => formFieldHighlight.value ?? props.highlight);
		const size = computed(() => formFieldSize.value ?? props.size);
		const disabled = computed(() => formFieldDisabled.value ?? props.disabled);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftextarea_default,
			...appConfig.ui?.textarea || {}
		})({
			color: color.value,
			variant: props.variant,
			size: size.value,
			loading: props.loading,
			highlight: highlight.value,
			fixed: props.fixed,
			autoresize: props.autoresize,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing
		}));
		const textareaRef = useTemplateRef("textareaRef");
		function updateInput(value) {
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number) value = looseToNumber(value);
			if (props.modelModifiers?.nullable) value ||= null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) value ||= void 0;
			modelValue.value = value;
			emitFormInput();
		}
		function onInput(event) {
			autoResize();
			if (!props.modelModifiers?.lazy) updateInput(event.target.value);
		}
		function onChange(event) {
			const value = event.target.value;
			if (props.modelModifiers?.lazy) updateInput(value);
			if (props.modelModifiers?.trim) event.target.value = value.trim();
			emitFormChange();
			emits("change", event);
		}
		function onBlur(event) {
			emitFormBlur();
			emits("blur", event);
		}
		function autoResize() {
			if (props.autoresize && textareaRef.value) {
				textareaRef.value.rows = props.rows;
				const overflow = textareaRef.value.style.overflow;
				textareaRef.value.style.overflow = "hidden";
				const styles = (void 0).getComputedStyle(textareaRef.value);
				const padding = Number.parseInt(styles.paddingTop) + Number.parseInt(styles.paddingBottom);
				const lineHeight = Number.parseInt(styles.lineHeight);
				const { scrollHeight } = textareaRef.value;
				const newRows = (scrollHeight - padding) / lineHeight;
				if (newRows > props.rows) textareaRef.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
				textareaRef.value.style.overflow = overflow;
			}
		}
		watch(modelValue, () => {
			nextTick(autoResize);
		});
		let autofocusTimeoutId;
		let autoresizeTimeoutId;
		onScopeDispose(() => {
			clearTimeout(autofocusTimeoutId);
			clearTimeout(autoresizeTimeoutId);
		});
		__expose({
			textareaRef,
			autoResize
		});
		return (_ctx, _push, _parent, _attrs) => {
			let _temp0;
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				as: unref(props).as,
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<textarea${ssrRenderAttrs(_temp0 = mergeProps({
							id: unref(id),
							ref_key: "textareaRef",
							ref: textareaRef,
							value: unref(modelValue),
							name: unref(name),
							rows: unref(props).rows,
							placeholder: unref(props).placeholder,
							class: ui.value.base({ class: unref(props).ui?.base }),
							disabled: disabled.value,
							required: unref(props).required
						}, {
							..._ctx.$attrs,
							...unref(ariaAttrs)
						}, { "data-slot": "base" }), "textarea")}${_scopeId}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
						ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, null, _push, _parent, _scopeId);
						if (unref(isLeading) || !!unref(props).avatar || !!slots.leading) {
							_push(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: unref(props).ui?.leading }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
								if (unref(isLeading) && unref(leadingIconName)) _push(ssrRenderComponent(_sfc_main$6, {
									name: unref(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
								}, null, _parent, _scopeId));
								else if (!!unref(props).avatar) _push(ssrRenderComponent(_sfc_main$4$1, mergeProps({ size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, unref(props).avatar, {
									"data-slot": "leadingAvatar",
									class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
								}), null, _parent, _scopeId));
								else _push(`<!---->`);
							}, _push, _parent, _scopeId);
							_push(`</span>`);
						} else _push(`<!---->`);
						if (unref(isTrailing) || !!slots.trailing) {
							_push(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: unref(props).ui?.trailing }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
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
						createVNode("textarea", mergeProps({
							id: unref(id),
							ref_key: "textareaRef",
							ref: textareaRef,
							value: unref(modelValue),
							name: unref(name),
							rows: unref(props).rows,
							placeholder: unref(props).placeholder,
							class: ui.value.base({ class: unref(props).ui?.base }),
							disabled: disabled.value,
							required: unref(props).required
						}, {
							..._ctx.$attrs,
							...unref(ariaAttrs)
						}, {
							"data-slot": "base",
							onInput,
							onBlur,
							onChange,
							onFocus: unref(emitFormFocus)
						}), null, 16, [
							"id",
							"value",
							"name",
							"rows",
							"placeholder",
							"disabled",
							"required",
							"onFocus"
						]),
						renderSlot(_ctx.$slots, "default", { ui: ui.value }),
						unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
							key: 0,
							"data-slot": "leading",
							class: ui.value.leading({ class: unref(props).ui?.leading })
						}, [renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
							key: 0,
							name: unref(leadingIconName),
							"data-slot": "leadingIcon",
							class: ui.value.leadingIcon({ class: unref(props).ui?.leadingIcon })
						}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$4$1, mergeProps({
							key: 1,
							size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
						}, unref(props).avatar, {
							"data-slot": "leadingAvatar",
							class: ui.value.leadingAvatar({ class: unref(props).ui?.leadingAvatar })
						}), null, 16, ["size", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true),
						unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
							key: 1,
							"data-slot": "trailing",
							class: ui.value.trailing({ class: unref(props).ui?.trailing })
						}, [renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$6, {
							key: 0,
							name: unref(trailingIconName),
							"data-slot": "trailingIcon",
							class: ui.value.trailingIcon({ class: unref(props).ui?.trailingIcon })
						}, null, 8, ["name", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true)
					];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$2 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Textarea.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region app/components/JobDrawer.vue?vue&type=script&setup=true&lang.ts
var JobDrawer_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "JobDrawer",
	__ssrInlineRender: true,
	props: {
		job: {},
		open: { type: Boolean }
	},
	emits: [
		"update:open",
		"shortlist",
		"removeShortlist"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const statusOptions = [
			{
				label: "Saved",
				value: "saved"
			},
			{
				label: "Applied",
				value: "applied"
			},
			{
				label: "Interviewing",
				value: "interviewing"
			},
			{
				label: "Rejected",
				value: "rejected"
			},
			{
				label: "Offer",
				value: "offer"
			}
		];
		function scoreColor(score) {
			if (score === null) return "neutral";
			if (score >= 8) return "success";
			if (score >= 6.5) return "primary";
			if (score >= 5) return "warning";
			return "error";
		}
		function recColor(rec) {
			if (rec === "Apply") return "success";
			if (rec === "Review") return "warning";
			return "neutral";
		}
		function updateShortlistStatus(job, status) {
			emit("shortlist", {
				...job,
				shortlist_status: status == null ? null : String(status)
			});
		}
		function updateShortlistNotes(job, notes) {
			emit("shortlist", {
				...job,
				shortlist_notes: notes == null ? null : String(notes)
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_USlideover = _sfc_main$8;
			const _component_UBadge = _sfc_main$5;
			const _component_UIcon = _sfc_main$6;
			const _component_UButton = _sfc_main$1$1;
			const _component_UDivider = resolveComponent("UDivider");
			const _component_USelect = _sfc_main$1$2;
			const _component_UTextarea = _sfc_main;
			_push(ssrRenderComponent(_component_USlideover, mergeProps({
				open: __props.open,
				title: __props.job?.title ?? "",
				"onUpdate:open": ($event) => emit("update:open", $event)
			}, _attrs), createSlots({ _: 2 }, [__props.job ? {
				name: "body",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="space-y-4 pb-6"${_scopeId}><div class="flex flex-wrap gap-2 items-center"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UBadge, {
							color: scoreColor(__props.job.score),
							class: "font-mono font-bold text-base"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(__props.job.score?.toFixed(1) ?? "—")} / 10 `);
								else return [createTextVNode(toDisplayString(__props.job.score?.toFixed(1) ?? "—") + " / 10 ", 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						if (__props.job.recommendation) _push(ssrRenderComponent(_component_UBadge, { color: recColor(__props.job.recommendation) }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(__props.job.recommendation)}`);
								else return [createTextVNode(toDisplayString(__props.job.recommendation), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_component_UBadge, { variant: "outline" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(__props.job.source)}`);
								else return [createTextVNode(toDisplayString(__props.job.source), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						if (__props.job.remote) _push(ssrRenderComponent(_component_UBadge, {
							color: "success",
							variant: "soft"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Remote `);
								else return [createTextVNode(" Remote ")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div><div class="text-sm text-muted space-y-1"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-building-2" }, null, _parent, _scopeId));
						_push(`<span${_scopeId}>${ssrInterpolate(__props.job.company)}</span></div><div class="flex items-center gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-map-pin" }, null, _parent, _scopeId));
						_push(`<span${_scopeId}>${ssrInterpolate(__props.job.location)}</span>`);
						if (__props.job.telework) _push(`<span class="text-xs"${_scopeId}>(${ssrInterpolate(__props.job.telework)})</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
						if (__props.job.salary) {
							_push(`<div class="flex items-center gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-banknote" }, null, _parent, _scopeId));
							_push(`<span${_scopeId}>${ssrInterpolate(__props.job.salary)}</span></div>`);
						} else _push(`<!---->`);
						if (__props.job.date_posted) {
							_push(`<div class="flex items-center gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-calendar" }, null, _parent, _scopeId));
							_push(`<span${_scopeId}>Posted ${ssrInterpolate(__props.job.date_posted)}</span></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if (__props.job.score_rationale) {
							_push(`<div class="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2"${_scopeId}><p class="font-semibold text-sm"${_scopeId}> LLM Assessment </p><p class="text-sm"${_scopeId}>${ssrInterpolate(__props.job.score_rationale)}</p>`);
							if (__props.job.strengths) _push(`<div class="text-sm"${_scopeId}><span class="font-medium text-success"${_scopeId}>Strengths: </span>${ssrInterpolate(__props.job.strengths)}</div>`);
							else _push(`<!---->`);
							if (__props.job.concerns) _push(`<div class="text-sm"${_scopeId}><span class="font-medium text-warning"${_scopeId}>Concerns: </span>${ssrInterpolate(__props.job.concerns)}</div>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(ssrRenderComponent(_component_UButton, {
							to: __props.job.link,
							target: "_blank",
							icon: "i-lucide-external-link",
							block: ""
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` View on ${ssrInterpolate(__props.job.source)}`);
								else return [createTextVNode(" View on " + toDisplayString(__props.job.source), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						if (__props.job.shortlisted) {
							_push(`<div${_scopeId}>`);
							_push(ssrRenderComponent(_component_UDivider, { label: "Shortlist" }, null, _parent, _scopeId));
							_push(`<div class="mt-3 space-y-2"${_scopeId}>`);
							_push(ssrRenderComponent(_component_USelect, {
								"model-value": __props.job.shortlist_status ?? "saved",
								items: statusOptions,
								"onUpdate:modelValue": ($event) => updateShortlistStatus(__props.job, $event)
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UTextarea, {
								"model-value": __props.job.shortlist_notes ?? "",
								placeholder: "Notes for this application…",
								rows: 3,
								"onUpdate:modelValue": ($event) => updateShortlistNotes(__props.job, $event)
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UButton, {
								variant: "outline",
								color: "error",
								icon: "i-lucide-star-off",
								block: "",
								onClick: ($event) => emit("removeShortlist", __props.job)
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Remove from shortlist `);
									else return [createTextVNode(" Remove from shortlist ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div></div>`);
						} else _push(ssrRenderComponent(_component_UButton, {
							icon: "i-lucide-star",
							block: "",
							onClick: ($event) => emit("shortlist", __props.job)
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Add to shortlist `);
								else return [createTextVNode(" Add to shortlist ")];
							}),
							_: 1
						}, _parent, _scopeId));
						if (__props.job.description) {
							_push(`<div${_scopeId}>`);
							_push(ssrRenderComponent(_component_UDivider, { label: "Job Description" }, null, _parent, _scopeId));
							_push(`<p class="mt-3 text-sm text-muted whitespace-pre-line leading-relaxed"${_scopeId}>${ssrInterpolate(__props.job.description.slice(0, 3e3))}${ssrInterpolate(__props.job.description.length > 3e3 ? "…" : "")}</p></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "space-y-4 pb-6" }, [
						createVNode("div", { class: "flex flex-wrap gap-2 items-center" }, [
							createVNode(_component_UBadge, {
								color: scoreColor(__props.job.score),
								class: "font-mono font-bold text-base"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(__props.job.score?.toFixed(1) ?? "—") + " / 10 ", 1)]),
								_: 1
							}, 8, ["color"]),
							__props.job.recommendation ? (openBlock(), createBlock(_component_UBadge, {
								key: 0,
								color: recColor(__props.job.recommendation)
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(__props.job.recommendation), 1)]),
								_: 1
							}, 8, ["color"])) : createCommentVNode("", true),
							createVNode(_component_UBadge, { variant: "outline" }, {
								default: withCtx(() => [createTextVNode(toDisplayString(__props.job.source), 1)]),
								_: 1
							}),
							__props.job.remote ? (openBlock(), createBlock(_component_UBadge, {
								key: 1,
								color: "success",
								variant: "soft"
							}, {
								default: withCtx(() => [createTextVNode(" Remote ")]),
								_: 1
							})) : createCommentVNode("", true)
						]),
						createVNode("div", { class: "text-sm text-muted space-y-1" }, [
							createVNode("div", { class: "flex items-center gap-2" }, [createVNode(_component_UIcon, { name: "i-lucide-building-2" }), createVNode("span", null, toDisplayString(__props.job.company), 1)]),
							createVNode("div", { class: "flex items-center gap-2" }, [
								createVNode(_component_UIcon, { name: "i-lucide-map-pin" }),
								createVNode("span", null, toDisplayString(__props.job.location), 1),
								__props.job.telework ? (openBlock(), createBlock("span", {
									key: 0,
									class: "text-xs"
								}, "(" + toDisplayString(__props.job.telework) + ")", 1)) : createCommentVNode("", true)
							]),
							__props.job.salary ? (openBlock(), createBlock("div", {
								key: 0,
								class: "flex items-center gap-2"
							}, [createVNode(_component_UIcon, { name: "i-lucide-banknote" }), createVNode("span", null, toDisplayString(__props.job.salary), 1)])) : createCommentVNode("", true),
							__props.job.date_posted ? (openBlock(), createBlock("div", {
								key: 1,
								class: "flex items-center gap-2"
							}, [createVNode(_component_UIcon, { name: "i-lucide-calendar" }), createVNode("span", null, "Posted " + toDisplayString(__props.job.date_posted), 1)])) : createCommentVNode("", true)
						]),
						__props.job.score_rationale ? (openBlock(), createBlock("div", {
							key: 0,
							class: "rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2"
						}, [
							createVNode("p", { class: "font-semibold text-sm" }, " LLM Assessment "),
							createVNode("p", { class: "text-sm" }, toDisplayString(__props.job.score_rationale), 1),
							__props.job.strengths ? (openBlock(), createBlock("div", {
								key: 0,
								class: "text-sm"
							}, [createVNode("span", { class: "font-medium text-success" }, "Strengths: "), createTextVNode(toDisplayString(__props.job.strengths), 1)])) : createCommentVNode("", true),
							__props.job.concerns ? (openBlock(), createBlock("div", {
								key: 1,
								class: "text-sm"
							}, [createVNode("span", { class: "font-medium text-warning" }, "Concerns: "), createTextVNode(toDisplayString(__props.job.concerns), 1)])) : createCommentVNode("", true)
						])) : createCommentVNode("", true),
						createVNode(_component_UButton, {
							to: __props.job.link,
							target: "_blank",
							icon: "i-lucide-external-link",
							block: ""
						}, {
							default: withCtx(() => [createTextVNode(" View on " + toDisplayString(__props.job.source), 1)]),
							_: 1
						}, 8, ["to"]),
						__props.job.shortlisted ? (openBlock(), createBlock("div", { key: 1 }, [createVNode(_component_UDivider, { label: "Shortlist" }), createVNode("div", { class: "mt-3 space-y-2" }, [
							createVNode(_component_USelect, {
								"model-value": __props.job.shortlist_status ?? "saved",
								items: statusOptions,
								"onUpdate:modelValue": ($event) => updateShortlistStatus(__props.job, $event)
							}, null, 8, ["model-value", "onUpdate:modelValue"]),
							createVNode(_component_UTextarea, {
								"model-value": __props.job.shortlist_notes ?? "",
								placeholder: "Notes for this application…",
								rows: 3,
								"onUpdate:modelValue": ($event) => updateShortlistNotes(__props.job, $event)
							}, null, 8, ["model-value", "onUpdate:modelValue"]),
							createVNode(_component_UButton, {
								variant: "outline",
								color: "error",
								icon: "i-lucide-star-off",
								block: "",
								onClick: ($event) => emit("removeShortlist", __props.job)
							}, {
								default: withCtx(() => [createTextVNode(" Remove from shortlist ")]),
								_: 1
							}, 8, ["onClick"])
						])])) : (openBlock(), createBlock(_component_UButton, {
							key: 2,
							icon: "i-lucide-star",
							block: "",
							onClick: ($event) => emit("shortlist", __props.job)
						}, {
							default: withCtx(() => [createTextVNode(" Add to shortlist ")]),
							_: 1
						}, 8, ["onClick"])),
						__props.job.description ? (openBlock(), createBlock("div", { key: 3 }, [createVNode(_component_UDivider, { label: "Job Description" }), createVNode("p", { class: "mt-3 text-sm text-muted whitespace-pre-line leading-relaxed" }, toDisplayString(__props.job.description.slice(0, 3e3)) + toDisplayString(__props.job.description.length > 3e3 ? "…" : ""), 1)])) : createCommentVNode("", true)
					])];
				}),
				key: "0"
			} : void 0]), _parent));
		};
	}
});
//#endregion
//#region app/components/JobDrawer.vue
var _sfc_setup$1 = JobDrawer_vue_vue_type_script_setup_true_lang_default.setup;
JobDrawer_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/JobDrawer.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var JobDrawer_default = Object.assign(JobDrawer_vue_vue_type_script_setup_true_lang_default, { __name: "JobDrawer" });
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "Jobs — Job Search 2026" });
		const filters = ref({
			source: "",
			bucket: "",
			level: "",
			remote: "",
			score_min: "",
			score_max: "",
			rec: "",
			search: ""
		});
		const page = ref(1);
		const drawerOpen = ref(false);
		const selectedJob = ref(null);
		const queryParams = computed(() => {
			const p = { page: String(page.value) };
			for (const [k, v] of Object.entries(filters.value)) if (v) p[k] = v;
			return p;
		});
		const { data, pending, refresh } = useFetch("/api/jobs", {
			query: queryParams,
			watch: [queryParams]
		}, "$2c_LcbB6zq");
		const jobs = computed(() => data.value?.data ?? []);
		const meta = computed(() => data.value?.meta ?? {
			total: 0,
			page: 1,
			per_page: 25,
			pages: 1
		});
		watch(filters, () => {
			page.value = 1;
		}, { deep: true });
		function openJob(job) {
			selectedJob.value = job;
			drawerOpen.value = true;
		}
		async function toggleShortlist(job) {
			if (job.shortlisted) await $fetch$2(`/api/jobs/${job.id}/shortlist`, { method: "DELETE" });
			else await $fetch$2(`/api/jobs/${job.id}/shortlist`, {
				method: "POST",
				body: { status: "saved" }
			});
			await refresh();
			if (selectedJob.value?.id === job.id) selectedJob.value = {
				...selectedJob.value,
				shortlisted: job.shortlisted ? 0 : 1
			};
		}
		async function updateShortlist(job) {
			await $fetch$2(`/api/jobs/${job.id}/shortlist`, {
				method: "POST",
				body: {
					status: job.shortlist_status ?? "saved",
					notes: job.shortlist_notes ?? ""
				}
			});
			await refresh();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UContainer = _sfc_main$4;
			const _component_JobFilters = JobFilters_default;
			const _component_JobTable = JobTable_default;
			const _component_UPagination = _sfc_main$1;
			const _component_JobDrawer = JobDrawer_default;
			_push(ssrRenderComponent(_component_UContainer, mergeProps({ class: "py-6 space-y-6" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold"${_scopeId}> Job Board </h1><p class="text-muted text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(meta).total)} roles found `);
						if (unref(pending)) _push(`<span class="ml-2 text-xs"${_scopeId}>Loading…</span>`);
						else _push(`<!---->`);
						_push(`</p></div></div>`);
						_push(ssrRenderComponent(_component_JobFilters, {
							modelValue: unref(filters),
							"onUpdate:modelValue": ($event) => isRef(filters) ? filters.value = $event : null
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_JobTable, {
							jobs: unref(jobs),
							loading: unref(pending),
							onSelect: openJob,
							onShortlist: toggleShortlist
						}, null, _parent, _scopeId));
						_push(`<div class="flex justify-center"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UPagination, {
							modelValue: unref(page),
							"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
							total: unref(meta).total,
							"page-count": unref(meta).per_page
						}, null, _parent, _scopeId));
						_push(`</div>`);
						_push(ssrRenderComponent(_component_JobDrawer, {
							open: unref(drawerOpen),
							"onUpdate:open": ($event) => isRef(drawerOpen) ? drawerOpen.value = $event : null,
							job: unref(selectedJob),
							onShortlist: updateShortlist,
							onRemoveShortlist: toggleShortlist
						}, null, _parent, _scopeId));
					} else return [
						createVNode("div", { class: "flex items-center justify-between" }, [createVNode("div", null, [createVNode("h1", { class: "text-2xl font-bold" }, " Job Board "), createVNode("p", { class: "text-muted text-sm mt-1" }, [createTextVNode(toDisplayString(unref(meta).total) + " roles found ", 1), unref(pending) ? (openBlock(), createBlock("span", {
							key: 0,
							class: "ml-2 text-xs"
						}, "Loading…")) : createCommentVNode("", true)])])]),
						createVNode(_component_JobFilters, {
							modelValue: unref(filters),
							"onUpdate:modelValue": ($event) => isRef(filters) ? filters.value = $event : null
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_JobTable, {
							jobs: unref(jobs),
							loading: unref(pending),
							onSelect: openJob,
							onShortlist: toggleShortlist
						}, null, 8, ["jobs", "loading"]),
						createVNode("div", { class: "flex justify-center" }, [createVNode(_component_UPagination, {
							modelValue: unref(page),
							"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
							total: unref(meta).total,
							"page-count": unref(meta).per_page
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"total",
							"page-count"
						])]),
						createVNode(_component_JobDrawer, {
							open: unref(drawerOpen),
							"onUpdate:open": ($event) => isRef(drawerOpen) ? drawerOpen.value = $event : null,
							job: unref(selectedJob),
							onShortlist: updateShortlist,
							onRemoveShortlist: toggleShortlist
						}, null, 8, [
							"open",
							"onUpdate:open",
							"job"
						])
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-x9MqHf9a.mjs.map
