import { u as useSeoMeta$1, _ as _sfc_main, a as _sfc_main$1, b as _sfc_main$6, $ as $fetch$2 } from '../virtual/entry.mjs';
import { u as useFetch, _ as _sfc_main$2, a as _sfc_main$1$1 } from './fetch-CVy4THor.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import 'unhead/plugins';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'unhead/server';
import 'unhead/legacy';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import '@vueuse/core';
import '@vueuse/shared';
import 'aria-hidden';
import 'tailwind-variants';
import 'tailwindcss/colors';
import 'vaul-vue';
import '@vue/shared';
import '@floating-ui/vue';
import 'fnv1a-64';
import 'object-identity';

//#region app/pages/shortlist.vue?vue&type=script&setup=true&lang.ts
var shortlist_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "shortlist",
	__ssrInlineRender: true,
	setup(__props) {
		useSeoMeta$1({ title: "My Shortlist — Job Search 2026" });
		const statusFilter = ref("");
		const drawerOpen = ref(false);
		const selectedJob = ref(null);
		const { data, pending, refresh } = useFetch("/api/shortlist", { query: computed(() => statusFilter.value ? { status: statusFilter.value } : {}) }, "$vfyftKlXOb");
		const jobs = computed(() => data.value ?? []);
		const shortlistStatusItems = [
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
		const statusCounts = computed(() => {
			const counts = {};
			for (const job of jobs.value) counts[job.status] = (counts[job.status] ?? 0) + 1;
			return counts;
		});
		function statusColor(status) {
			return {
				offer: "success",
				interviewing: "primary",
				applied: "warning",
				saved: "neutral",
				rejected: "error"
			}[status] ?? "neutral";
		}
		async function updateStatus(job, status) {
			await $fetch$2(`/api/jobs/${job.id}/shortlist`, {
				method: "POST",
				body: {
					status: status == null ? "saved" : String(status),
					notes: job.notes
				}
			});
			await refresh();
		}
		async function remove(job) {
			await $fetch$2(`/api/jobs/${job.id}/shortlist`, { method: "DELETE" });
			await refresh();
		}
		function exportCsv() {
			const rows = jobs.value;
			const csv = [[
				"Title",
				"Company",
				"Location",
				"Score",
				"Status",
				"Notes",
				"Date Added",
				"Link"
			].join(","), ...rows.map((j) => [
				`"${j.title.replace(/"/g, "\"\"")}"`,
				`"${j.company.replace(/"/g, "\"\"")}"`,
				`"${j.location}"`,
				j.score ?? "",
				j.status,
				`"${(j.notes || "").replace(/"/g, "\"\"")}"`,
				j.date_added.slice(0, 10),
				j.link
			].join(","))].join("\n");
			const blob = new Blob([csv], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = (void 0).createElement("a");
			a.href = url;
			a.download = `shortlist-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UContainer = _sfc_main;
			const _component_UButton = _sfc_main$1;
			const _component_UBadge = _sfc_main$2;
			const _component_UIcon = _sfc_main$6;
			const _component_USelect = _sfc_main$1$1;
			_push(ssrRenderComponent(_component_UContainer, mergeProps({ class: "py-6 space-y-6" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex items-center justify-between flex-wrap gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold"${_scopeId}> My Shortlist </h1><p class="text-muted text-sm mt-1"${_scopeId}>${ssrInterpolate(unref(jobs).length)} saved roles </p></div>`);
						_push(ssrRenderComponent(_component_UButton, {
							icon: "i-lucide-download",
							variant: "outline",
							onClick: exportCsv
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Export CSV `);
								else return [createTextVNode(" Export CSV ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div class="flex flex-wrap gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UBadge, {
							color: !unref(statusFilter) ? "primary" : "neutral",
							class: "cursor-pointer",
							onClick: ($event) => statusFilter.value = ""
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` All (${ssrInterpolate(unref(jobs).length)}) `);
								else return [createTextVNode(" All (" + toDisplayString(unref(jobs).length) + ") ", 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<!--[-->`);
						ssrRenderList(Object.entries(unref(statusCounts)), ([status, count]) => {
							_push(ssrRenderComponent(_component_UBadge, {
								key: status,
								color: statusColor(status),
								class: "cursor-pointer capitalize",
								onClick: ($event) => statusFilter.value = status
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${ssrInterpolate(status)} (${ssrInterpolate(count)}) `);
									else return [createTextVNode(toDisplayString(status) + " (" + toDisplayString(count) + ") ", 1)];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]--></div>`);
						if (unref(pending)) _push(`<div class="text-center text-muted py-12"${_scopeId}> Loading… </div>`);
						else if (!unref(jobs).length) {
							_push(`<div class="text-center text-muted py-12"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-star",
								class: "text-4xl mb-3"
							}, null, _parent, _scopeId));
							_push(`<p${_scopeId}>No jobs shortlisted yet. Go to the Jobs board and star roles you&#39;re interested in.</p>`);
							_push(ssrRenderComponent(_component_UButton, {
								to: "/",
								class: "mt-4"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Browse Jobs `);
									else return [createTextVNode(" Browse Jobs ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else {
							_push(`<div class="space-y-3"${_scopeId}><!--[-->`);
							ssrRenderList(unref(jobs), (job) => {
								_push(`<div class="rounded-lg border border-default bg-card p-4 space-y-3 hover:border-primary/50 transition-colors cursor-pointer"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><p class="font-semibold truncate"${_scopeId}>${ssrInterpolate(job.title)}</p><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(job.company)} · ${ssrInterpolate(job.location)}</p></div><div class="flex items-center gap-2 shrink-0"${_scopeId}>`);
								if (job.score) _push(ssrRenderComponent(_component_UBadge, {
									color: job.score >= 8 ? "success" : job.score >= 6.5 ? "primary" : "warning",
									class: "font-mono font-bold"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(job.score.toFixed(1))}`);
										else return [createTextVNode(toDisplayString(job.score.toFixed(1)), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else _push(`<!---->`);
								_push(ssrRenderComponent(_component_UBadge, {
									color: statusColor(job.status),
									class: "capitalize"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(job.status)}`);
										else return [createTextVNode(toDisplayString(job.status), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(`</div></div><div class="flex items-center gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_USelect, {
									"model-value": job.status,
									items: shortlistStatusItems,
									size: "xs",
									"onUpdate:modelValue": ($event) => updateStatus(job, $event)
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									size: "xs",
									variant: "ghost",
									color: "error",
									icon: "i-lucide-trash-2",
									onClick: ($event) => remove(job)
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									to: job.link,
									target: "_blank",
									size: "xs",
									variant: "outline",
									icon: "i-lucide-external-link",
									onClick: () => {}
								}, null, _parent, _scopeId));
								_push(`</div>`);
								if (job.notes) _push(`<p class="text-sm text-muted italic"${_scopeId}>${ssrInterpolate(job.notes)}</p>`);
								else _push(`<!---->`);
								_push(`</div>`);
							});
							_push(`<!--]--></div>`);
						}
					} else return [
						createVNode("div", { class: "flex items-center justify-between flex-wrap gap-3" }, [createVNode("div", null, [createVNode("h1", { class: "text-2xl font-bold" }, " My Shortlist "), createVNode("p", { class: "text-muted text-sm mt-1" }, toDisplayString(unref(jobs).length) + " saved roles ", 1)]), createVNode(_component_UButton, {
							icon: "i-lucide-download",
							variant: "outline",
							onClick: exportCsv
						}, {
							default: withCtx(() => [createTextVNode(" Export CSV ")]),
							_: 1
						})]),
						createVNode("div", { class: "flex flex-wrap gap-2" }, [createVNode(_component_UBadge, {
							color: !unref(statusFilter) ? "primary" : "neutral",
							class: "cursor-pointer",
							onClick: ($event) => statusFilter.value = ""
						}, {
							default: withCtx(() => [createTextVNode(" All (" + toDisplayString(unref(jobs).length) + ") ", 1)]),
							_: 1
						}, 8, ["color", "onClick"]), (openBlock(true), createBlock(Fragment, null, renderList(Object.entries(unref(statusCounts)), ([status, count]) => {
							return openBlock(), createBlock(_component_UBadge, {
								key: status,
								color: statusColor(status),
								class: "cursor-pointer capitalize",
								onClick: ($event) => statusFilter.value = status
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(status) + " (" + toDisplayString(count) + ") ", 1)]),
								_: 2
							}, 1032, ["color", "onClick"]);
						}), 128))]),
						unref(pending) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "text-center text-muted py-12"
						}, " Loading… ")) : !unref(jobs).length ? (openBlock(), createBlock("div", {
							key: 1,
							class: "text-center text-muted py-12"
						}, [
							createVNode(_component_UIcon, {
								name: "i-lucide-star",
								class: "text-4xl mb-3"
							}),
							createVNode("p", null, "No jobs shortlisted yet. Go to the Jobs board and star roles you're interested in."),
							createVNode(_component_UButton, {
								to: "/",
								class: "mt-4"
							}, {
								default: withCtx(() => [createTextVNode(" Browse Jobs ")]),
								_: 1
							})
						])) : (openBlock(), createBlock("div", {
							key: 2,
							class: "space-y-3"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(jobs), (job) => {
							return openBlock(), createBlock("div", {
								key: job.id,
								class: "rounded-lg border border-default bg-card p-4 space-y-3 hover:border-primary/50 transition-colors cursor-pointer",
								onClick: ($event) => {
									selectedJob.value = job;
									drawerOpen.value = true;
								}
							}, [
								createVNode("div", { class: "flex items-start justify-between gap-3" }, [createVNode("div", { class: "flex-1 min-w-0" }, [createVNode("p", { class: "font-semibold truncate" }, toDisplayString(job.title), 1), createVNode("p", { class: "text-sm text-muted" }, toDisplayString(job.company) + " · " + toDisplayString(job.location), 1)]), createVNode("div", { class: "flex items-center gap-2 shrink-0" }, [job.score ? (openBlock(), createBlock(_component_UBadge, {
									key: 0,
									color: job.score >= 8 ? "success" : job.score >= 6.5 ? "primary" : "warning",
									class: "font-mono font-bold"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(job.score.toFixed(1)), 1)]),
									_: 2
								}, 1032, ["color"])) : createCommentVNode("", true), createVNode(_component_UBadge, {
									color: statusColor(job.status),
									class: "capitalize"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(job.status), 1)]),
									_: 2
								}, 1032, ["color"])])]),
								createVNode("div", {
									class: "flex items-center gap-2",
									onClick: withModifiers(() => {}, ["stop"])
								}, [
									createVNode(_component_USelect, {
										"model-value": job.status,
										items: shortlistStatusItems,
										size: "xs",
										"onUpdate:modelValue": ($event) => updateStatus(job, $event)
									}, null, 8, ["model-value", "onUpdate:modelValue"]),
									createVNode(_component_UButton, {
										size: "xs",
										variant: "ghost",
										color: "error",
										icon: "i-lucide-trash-2",
										onClick: ($event) => remove(job)
									}, null, 8, ["onClick"]),
									createVNode(_component_UButton, {
										to: job.link,
										target: "_blank",
										size: "xs",
										variant: "outline",
										icon: "i-lucide-external-link",
										onClick: withModifiers(() => {}, ["stop"])
									}, null, 8, ["to", "onClick"])
								], 8, ["onClick"]),
								job.notes ? (openBlock(), createBlock("p", {
									key: 0,
									class: "text-sm text-muted italic"
								}, toDisplayString(job.notes), 1)) : createCommentVNode("", true)
							], 8, ["onClick"]);
						}), 128))]))
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/pages/shortlist.vue
var _sfc_setup = shortlist_vue_vue_type_script_setup_true_lang_default.setup;
shortlist_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shortlist.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var shortlist_default = shortlist_vue_vue_type_script_setup_true_lang_default;

export { shortlist_default as default };
//# sourceMappingURL=shortlist-KYoTMbv7.mjs.map
