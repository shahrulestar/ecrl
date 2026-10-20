import { i as __toESM } from "../_runtime.mjs";
import { T as require_react, w as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as J } from "../_libs/next-themes.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-ClOz6-wK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function ThemeProvider$1({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(J, {
		attribute: "class",
		defaultTheme: "system",
		enableSystem: true,
		disableTransitionOnChange: true,
		children
	});
}
var styles_default = "/assets/styles-BjPbyScR.css";
var APP_NAME = "ECRL Fare Calculator";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Starting fares for ECRL Economy Transit between all 16 stations, Gombak to Kota Bharu."
			},
			{
				name: "theme-color",
				content: "#111111"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var fareMeta = {
	"service": "ECRL",
	"class": "Ekonomi",
	"service_type": "Transit",
	"currency": "MYR",
	"description": "Starting fares for ECRL Economy Transit service (dynamic pricing; these are base/starting rates)",
	"notes": [
		"Kadar yang sama terpakai bagi perjalanan ulang alik. (Same fare applies for return journeys.)",
		"Kadar tambang ditetapkan melalui mekanisme tambang dinamik. (Fares set via dynamic pricing mechanism.)",
		"These are starting/base rates announced; actual fares may vary by demand, time, and availability.",
		"Data extracted from official fare table image for web app use."
	],
	"stations_count": 16,
	"source": "ECRL Kadar Tambang table (Economy Transit)"
};
var stations = [
	{
		"name": "Gombak",
		"state": "Selangor",
		"index": 1
	},
	{
		"name": "Bentong",
		"state": "Pahang",
		"index": 2
	},
	{
		"name": "Temerloh",
		"state": "Pahang",
		"index": 3
	},
	{
		"name": "Maran",
		"state": "Pahang",
		"index": 4
	},
	{
		"name": "Paya Besar",
		"state": "Pahang",
		"index": 5
	},
	{
		"name": "KotaSAS",
		"state": "Pahang",
		"index": 6
	},
	{
		"name": "Kuantan Port City",
		"state": "Pahang",
		"index": 7
	},
	{
		"name": "Cherating",
		"state": "Pahang",
		"index": 8
	},
	{
		"name": "Chukai",
		"state": "Terengganu",
		"index": 9
	},
	{
		"name": "Kemasik",
		"state": "Terengganu",
		"index": 10
	},
	{
		"name": "Dungun",
		"state": "Terengganu",
		"index": 11
	},
	{
		"name": "Kuala Terengganu",
		"state": "Terengganu",
		"index": 12
	},
	{
		"name": "Bandar Permaisuri",
		"state": "Terengganu",
		"index": 13
	},
	{
		"name": "Jerteh",
		"state": "Terengganu",
		"index": 14
	},
	{
		"name": "Pasir Puteh",
		"state": "Kelantan",
		"index": 15
	},
	{
		"name": "Kota Bharu",
		"state": "Kelantan",
		"index": 16
	}
];
var fares = {
	"Gombak": {
		"Bentong": 24,
		"Temerloh": 35,
		"Maran": 42,
		"Paya Besar": 55,
		"KotaSAS": 60,
		"Kuantan Port City": 62,
		"Cherating": 67,
		"Chukai": 69,
		"Kemasik": 75,
		"Dungun": 82,
		"Kuala Terengganu": 95,
		"Bandar Permaisuri": 107,
		"Jerteh": 114,
		"Pasir Puteh": 118,
		"Kota Bharu": 125
	},
	"Bentong": {
		"Gombak": 24,
		"Temerloh": 11,
		"Maran": 18,
		"Paya Besar": 31,
		"KotaSAS": 36,
		"Kuantan Port City": 38,
		"Cherating": 43,
		"Chukai": 45,
		"Kemasik": 51,
		"Dungun": 58,
		"Kuala Terengganu": 71,
		"Bandar Permaisuri": 83,
		"Jerteh": 90,
		"Pasir Puteh": 94,
		"Kota Bharu": 101
	},
	"Temerloh": {
		"Gombak": 35,
		"Bentong": 11,
		"Maran": 7,
		"Paya Besar": 20,
		"KotaSAS": 25,
		"Kuantan Port City": 27,
		"Cherating": 32,
		"Chukai": 34,
		"Kemasik": 40,
		"Dungun": 47,
		"Kuala Terengganu": 60,
		"Bandar Permaisuri": 72,
		"Jerteh": 79,
		"Pasir Puteh": 83,
		"Kota Bharu": 90
	},
	"Maran": {
		"Gombak": 42,
		"Bentong": 18,
		"Temerloh": 7,
		"Paya Besar": 13,
		"KotaSAS": 18,
		"Kuantan Port City": 20,
		"Cherating": 25,
		"Chukai": 27,
		"Kemasik": 33,
		"Dungun": 40,
		"Kuala Terengganu": 53,
		"Bandar Permaisuri": 65,
		"Jerteh": 72,
		"Pasir Puteh": 76,
		"Kota Bharu": 83
	},
	"Paya Besar": {
		"Gombak": 55,
		"Bentong": 31,
		"Temerloh": 20,
		"Maran": 13,
		"KotaSAS": 5,
		"Kuantan Port City": 7,
		"Cherating": 12,
		"Chukai": 14,
		"Kemasik": 20,
		"Dungun": 27,
		"Kuala Terengganu": 40,
		"Bandar Permaisuri": 52,
		"Jerteh": 59,
		"Pasir Puteh": 63,
		"Kota Bharu": 70
	},
	"KotaSAS": {
		"Gombak": 60,
		"Bentong": 36,
		"Temerloh": 25,
		"Maran": 18,
		"Paya Besar": 5,
		"Kuantan Port City": 2,
		"Cherating": 7,
		"Chukai": 9,
		"Kemasik": 15,
		"Dungun": 22,
		"Kuala Terengganu": 35,
		"Bandar Permaisuri": 47,
		"Jerteh": 54,
		"Pasir Puteh": 58,
		"Kota Bharu": 65
	},
	"Kuantan Port City": {
		"Gombak": 62,
		"Bentong": 38,
		"Temerloh": 27,
		"Maran": 20,
		"Paya Besar": 7,
		"KotaSAS": 2,
		"Cherating": 5,
		"Chukai": 7,
		"Kemasik": 13,
		"Dungun": 20,
		"Kuala Terengganu": 33,
		"Bandar Permaisuri": 45,
		"Jerteh": 52,
		"Pasir Puteh": 56,
		"Kota Bharu": 63
	},
	"Cherating": {
		"Gombak": 67,
		"Bentong": 43,
		"Temerloh": 32,
		"Maran": 25,
		"Paya Besar": 12,
		"KotaSAS": 7,
		"Kuantan Port City": 5,
		"Chukai": 2,
		"Kemasik": 8,
		"Dungun": 15,
		"Kuala Terengganu": 28,
		"Bandar Permaisuri": 40,
		"Jerteh": 47,
		"Pasir Puteh": 51,
		"Kota Bharu": 58
	},
	"Chukai": {
		"Gombak": 69,
		"Bentong": 45,
		"Temerloh": 34,
		"Maran": 27,
		"Paya Besar": 14,
		"KotaSAS": 9,
		"Kuantan Port City": 7,
		"Cherating": 2,
		"Kemasik": 6,
		"Dungun": 13,
		"Kuala Terengganu": 26,
		"Bandar Permaisuri": 38,
		"Jerteh": 45,
		"Pasir Puteh": 49,
		"Kota Bharu": 56
	},
	"Kemasik": {
		"Gombak": 75,
		"Bentong": 51,
		"Temerloh": 40,
		"Maran": 33,
		"Paya Besar": 20,
		"KotaSAS": 15,
		"Kuantan Port City": 13,
		"Cherating": 8,
		"Chukai": 6,
		"Dungun": 7,
		"Kuala Terengganu": 20,
		"Bandar Permaisuri": 32,
		"Jerteh": 39,
		"Pasir Puteh": 43,
		"Kota Bharu": 50
	},
	"Dungun": {
		"Gombak": 82,
		"Bentong": 58,
		"Temerloh": 47,
		"Maran": 40,
		"Paya Besar": 27,
		"KotaSAS": 22,
		"Kuantan Port City": 20,
		"Cherating": 15,
		"Chukai": 13,
		"Kemasik": 7,
		"Kuala Terengganu": 13,
		"Bandar Permaisuri": 25,
		"Jerteh": 32,
		"Pasir Puteh": 36,
		"Kota Bharu": 43
	},
	"Kuala Terengganu": {
		"Gombak": 95,
		"Bentong": 71,
		"Temerloh": 60,
		"Maran": 53,
		"Paya Besar": 40,
		"KotaSAS": 35,
		"Kuantan Port City": 33,
		"Cherating": 28,
		"Chukai": 26,
		"Kemasik": 20,
		"Dungun": 13,
		"Bandar Permaisuri": 12,
		"Jerteh": 19,
		"Pasir Puteh": 23,
		"Kota Bharu": 30
	},
	"Bandar Permaisuri": {
		"Gombak": 107,
		"Bentong": 83,
		"Temerloh": 72,
		"Maran": 65,
		"Paya Besar": 52,
		"KotaSAS": 47,
		"Kuantan Port City": 45,
		"Cherating": 40,
		"Chukai": 38,
		"Kemasik": 32,
		"Dungun": 25,
		"Kuala Terengganu": 12,
		"Jerteh": 7,
		"Pasir Puteh": 11,
		"Kota Bharu": 18
	},
	"Jerteh": {
		"Gombak": 114,
		"Bentong": 90,
		"Temerloh": 79,
		"Maran": 72,
		"Paya Besar": 59,
		"KotaSAS": 54,
		"Kuantan Port City": 52,
		"Cherating": 47,
		"Chukai": 45,
		"Kemasik": 39,
		"Dungun": 32,
		"Kuala Terengganu": 19,
		"Bandar Permaisuri": 7,
		"Pasir Puteh": 4,
		"Kota Bharu": 11
	},
	"Pasir Puteh": {
		"Gombak": 118,
		"Bentong": 94,
		"Temerloh": 83,
		"Maran": 76,
		"Paya Besar": 63,
		"KotaSAS": 58,
		"Kuantan Port City": 56,
		"Cherating": 51,
		"Chukai": 49,
		"Kemasik": 43,
		"Dungun": 36,
		"Kuala Terengganu": 23,
		"Bandar Permaisuri": 11,
		"Jerteh": 4,
		"Kota Bharu": 7
	},
	"Kota Bharu": {
		"Gombak": 125,
		"Bentong": 101,
		"Temerloh": 90,
		"Maran": 83,
		"Paya Besar": 70,
		"KotaSAS": 65,
		"Kuantan Port City": 63,
		"Cherating": 58,
		"Chukai": 56,
		"Kemasik": 50,
		"Dungun": 43,
		"Kuala Terengganu": 30,
		"Bandar Permaisuri": 18,
		"Jerteh": 11,
		"Pasir Puteh": 7
	}
};
var publishedJourneys = [
	{
		a: "Gombak",
		b: "Kota Bharu",
		km: 523,
		transitTime: "about 5 hours",
		expressFare: 147,
		expressTime: "about 4 hours"
	},
	{
		a: "Gombak",
		b: "Kuala Terengganu",
		km: 378,
		transitTime: "3 hours 51 minutes",
		expressFare: 110,
		expressTime: "2 hours 54 minutes"
	},
	{
		a: "Gombak",
		b: "KotaSAS",
		km: 209,
		transitTime: "2 hours 5 minutes",
		expressFare: 68,
		expressTime: "1 hour 27 minutes"
	}
];
function stationIndex(name) {
	return stations.findIndex((s) => s.name === name);
}
function getFare(from, to) {
	if (from === to) return null;
	return fares[from][to] ?? null;
}
function pathBetween(from, to) {
	const a = stationIndex(from);
	const b = stationIndex(to);
	const slice = stations.slice(Math.min(a, b), Math.max(a, b) + 1);
	return a <= b ? slice : [...slice].reverse();
}
function publishedJourney(from, to) {
	return publishedJourneys.find((j) => j.a === from && j.b === to || j.a === to && j.b === from) ?? null;
}
function formatRm(amount) {
	return Number.isInteger(amount) ? `RM${amount}` : `RM${amount.toFixed(2)}`;
}
function isStationName(value) {
	return typeof value === "string" && stations.some((station) => station.name === value);
}
function parseFareSearch(search) {
	const passengers = Number(search.passengers);
	const concession = search.concession;
	return {
		from: isStationName(search.from) ? search.from : void 0,
		to: isStationName(search.to) ? search.to : void 0,
		passengers: Number.isInteger(passengers) && passengers >= 2 && passengers <= 9 ? passengers : void 0,
		concession: concession === "student" || concession === "half" ? concession : void 0
	};
}
function fareSearchParams(input) {
	return {
		from: input.from ?? void 0,
		to: input.to ?? void 0,
		passengers: input.passengers > 1 ? input.passengers : void 0,
		concession: input.concession === "adult" ? void 0 : input.concession
	};
}
function fareSharePath(search) {
	const parts = [];
	if (search.from) parts.push(`from=${encodeURIComponent(search.from)}`);
	if (search.to) parts.push(`to=${encodeURIComponent(search.to)}`);
	if (search.passengers) parts.push(`passengers=${search.passengers}`);
	if (search.concession) parts.push(`concession=${search.concession}`);
	return parts.length ? `/?${parts.join("&")}` : "/";
}
var $$splitComponentImporter = () => import("./routes-C_rdG-1l.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({
	validateSearch: (search) => parseFareSearch(search),
	component: lazyRouteComponent($$splitComponentImporter, "component")
}).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { formatRm as a, publishedJourney as c, fareMeta as i, stationIndex as l, fareSearchParams as n, getFare as o, fareSharePath as r, pathBetween as s, router_exports as t, stations as u };
