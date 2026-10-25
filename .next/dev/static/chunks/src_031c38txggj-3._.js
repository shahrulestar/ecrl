(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/preview-host-bridge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PreviewHostBridge",
    ()=>PreviewHostBridge
]);
/**
 * Mount once in the root layout so the Grok preview chrome can drive navigation.
 * Noops when the app is not embedded.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$preview$2d$host$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/preview-host-bridge.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PreviewHostBridge() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreviewHostBridge.useEffect": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$preview$2d$host$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["installPreviewHostBridge"])({
                navigate: {
                    "PreviewHostBridge.useEffect": (path)=>{
                        router.push(path);
                    }
                }["PreviewHostBridge.useEffect"],
                getRoutePaths: {
                    "PreviewHostBridge.useEffect": ()=>[
                            "/"
                        ]
                }["PreviewHostBridge.useEffect"]
            });
        }
    }["PreviewHostBridge.useEffect"], [
        router
    ]);
    return null;
}
_s(PreviewHostBridge, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PreviewHostBridge;
var _c;
__turbopack_context__.k.register(_c, "PreviewHostBridge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        disableTransitionOnChange: true,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/theme-provider.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/app-data/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONNECTOR_TOKEN_HEADER",
    ()=>CONNECTOR_TOKEN_HEADER,
    "CONNECTOR_TOKEN_PENDING_CODE",
    ()=>CONNECTOR_TOKEN_PENDING_CODE,
    "CONNECTOR_TOKEN_READY_EVENT",
    ()=>CONNECTOR_TOKEN_READY_EVENT,
    "ConnectorType",
    ()=>ConnectorType,
    "GoogleCalendarTools",
    ()=>GoogleCalendarTools,
    "GoogleDriveTools",
    ()=>GoogleDriveTools
]);
const CONNECTOR_TOKEN_HEADER = "x-connector-access-token";
const CONNECTOR_TOKEN_PENDING_CODE = "connector_token_pending";
const CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
const ConnectorType = {
    GoogleDrive: "GoogleDrive",
    Gmail: "Gmail",
    GoogleCalendar: "GoogleCalendar",
    Outlook: "Outlook",
    OutlookCalendar: "OutlookCalendar",
    MicrosoftTeams: "MicrosoftTeams",
    Mcp: "Mcp"
};
const GoogleDriveTools = {
    search: "google_drive_search",
    readFile: "google_drive_read_file",
    listFolder: "google_drive_list_folder",
    createFolder: "google_drive_create_folder",
    trashFile: "google_drive_trash_file"
};
const GoogleCalendarTools = {
    listCalendars: "google_calendar_list_calendars",
    search: "google_calendar_search",
    getEvent: "google_calendar_get_event",
    availability: "google_calendar_availability"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/preview-embedder-origin.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isGrokEmbedderOrigin",
    ()=>isGrokEmbedderOrigin,
    "isSandboxPreviewGuestHost",
    ()=>isSandboxPreviewGuestHost,
    "resolveParentEmbedderOrigin",
    ()=>resolveParentEmbedderOrigin
]);
function isGrokEmbedderOrigin(origin) {
    try {
        const url = new URL(origin);
        if (url.protocol !== "https:" && url.protocol !== "http:") return false;
        const host = url.hostname.toLowerCase();
        if (host === "grok.com" || host.endsWith(".grok.com")) return true;
        if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
        return false;
    } catch  {
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
    const sep = ".preview.";
    const i = guest.indexOf(sep);
    if (i <= 0) return false;
    const label = guest.slice(0, i);
    const rest = guest.slice(i + sep.length);
    if (label.includes(".") || !rest.includes(".")) return false;
    return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
    if (parentIsSelf) return null;
    for (const candidate of [
        referrer,
        ancestorOrigin ?? ""
    ].filter(Boolean)){
        try {
            const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
            if (url.protocol !== "https:" && url.protocol !== "http:") continue;
            if (isGrokEmbedderOrigin(url.origin)) return url.origin;
            if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) {
                return url.origin;
            }
        } catch  {
        // try next candidate
        }
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/preview-host-bridge.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PREVIEW_BRIDGE_CHANNEL",
    ()=>PREVIEW_BRIDGE_CHANNEL,
    "PREVIEW_BRIDGE_VERSION",
    ()=>PREVIEW_BRIDGE_VERSION,
    "collectRoutePathsFromTree",
    ()=>collectRoutePathsFromTree,
    "installPreviewHostBridge",
    ()=>installPreviewHostBridge,
    "isSafeBridgePath",
    ()=>isSafeBridgePath,
    "resolveCurrentEmbedderOrigin",
    ()=>resolveCurrentEmbedderOrigin
]);
/**
 * Guest side of the grok-web ↔ sandbox preview postMessage bridge.
 *
 * Activates only when this page is framed by an allowlisted Grok embedder.
 * Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .literal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .number>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .union>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$app$2d$data$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/app-data/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$preview$2d$embedder$2d$origin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/preview-embedder-origin.ts [app-client] (ecmascript)");
;
;
;
;
const PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
const PREVIEW_BRIDGE_VERSION = 1;
const EnvelopeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    channel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(PREVIEW_BRIDGE_CHANNEL),
    version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().positive(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1)
});
const HelloSchema = EnvelopeSchema.extend({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("hello")
});
const NavigateSchema = EnvelopeSchema.extend({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("navigate"),
    path: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1)
});
const HistorySchema = EnvelopeSchema.extend({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("history"),
    delta: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(-1),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(1)
    ])
});
const ConnectorTokenReadySchema = EnvelopeSchema.extend({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("connector-token-ready")
});
function isSafeBridgePath(path) {
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
        return false;
    }
    try {
        const resolved = new URL(path, "https://preview.invalid");
        return resolved.origin === "https://preview.invalid";
    } catch  {
        return false;
    }
}
function resolveCurrentEmbedderOrigin() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const ancestorOrigin = typeof location.ancestorOrigins !== 'undefined' && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$preview$2d$embedder$2d$origin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveParentEmbedderOrigin"])(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
function installPreviewHostBridge(options = {}) {
    const parentOrigin = resolveCurrentEmbedderOrigin();
    if (parentOrigin === null) return ()=>{};
    const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);
    const isAtHistoryRoot = ()=>{
        const state = window.history.state;
        return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
    };
    // Floor for chrome Back: only the first install in a fresh history stack is
    // root. Full document navigations reinstall this bridge on a deep URL; if we
    // re-stamped that entry as root, Back would no-op while earlier in-preview
    // history still exists. Preserve an existing tag (bfcache / SPA remount).
    try {
        const current = window.history.state;
        const alreadyTagged = current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY);
        if (!alreadyTagged) {
            const isRoot = window.history.length <= 1;
            const marked = current && typeof current === "object" ? {
                ...current,
                [ROOT_STATE_KEY]: isRoot
            } : {
                [ROOT_STATE_KEY]: isRoot
            };
            originalReplaceState(marked, "", window.location.href);
        }
    } catch  {
    // ignore if the document cannot be marked
    }
    const post = (message)=>{
        window.parent.postMessage(message, parentOrigin);
    };
    const reportLocation = ()=>{
        post({
            channel: PREVIEW_BRIDGE_CHANNEL,
            version: PREVIEW_BRIDGE_VERSION,
            type: "location",
            path: window.location.pathname || "/",
            search: window.location.search,
            hash: window.location.hash
        });
    };
    const reportRoutes = ()=>{
        const paths = options.getRoutePaths?.() ?? [];
        post({
            channel: PREVIEW_BRIDGE_CHANNEL,
            version: PREVIEW_BRIDGE_VERSION,
            type: "routes",
            paths
        });
    };
    const defaultNavigate = (path)=>{
        if (!isSafeBridgePath(path)) return;
        try {
            const url = new URL(path, window.location.origin);
            if (url.origin !== window.location.origin) return;
            const next = `${url.pathname}${url.search}${url.hash}`;
            window.history.pushState(window.history.state, "", next);
            window.dispatchEvent(new PopStateEvent("popstate", {
                state: window.history.state
            }));
        } catch  {
        // ignore malformed paths
        }
    };
    const navigate = (path)=>{
        if (!isSafeBridgePath(path)) return;
        if (options.navigate) {
            options.navigate(path);
            return;
        }
        defaultNavigate(path);
    };
    const announce = ()=>{
        reportLocation();
        reportRoutes();
        post({
            channel: PREVIEW_BRIDGE_CHANNEL,
            version: PREVIEW_BRIDGE_VERSION,
            type: "ready"
        });
    };
    // Host re-handshake: it may have (re)mounted after our install-time
    // announce, or asked before we hydrated. Announce again.
    const onHello = (data)=>{
        if (!HelloSchema.safeParse(data).success) return;
        announce();
    };
    const onNavigate = (data)=>{
        const parsed = NavigateSchema.safeParse(data);
        if (!parsed.success) return;
        navigate(parsed.data.path);
        // Router navigations often update location asynchronously; report after a tick.
        queueMicrotask(reportLocation);
    };
    const onHistory = (data)=>{
        const parsed = HistorySchema.safeParse(data);
        if (!parsed.success) return;
        // Do not history.go(-1) off the first entry — that leaves the preview.
        if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
        // Location sync comes from the popstate listener once history settles.
        window.history.go(parsed.data.delta);
    };
    const onConnectorTokenReady = (data)=>{
        if (!ConnectorTokenReadySchema.safeParse(data).success) return;
        window.dispatchEvent(new Event(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$app$2d$data$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONNECTOR_TOKEN_READY_EVENT"]));
    };
    const hostMessageHandlers = new Map([
        [
            "hello",
            onHello
        ],
        [
            "navigate",
            onNavigate
        ],
        [
            "history",
            onHistory
        ],
        [
            "connector-token-ready",
            onConnectorTokenReady
        ]
    ]);
    const onMessage = (event)=>{
        if (event.source !== window.parent) return;
        if (event.origin !== parentOrigin) return;
        const envelope = EnvelopeSchema.safeParse(event.data);
        if (!envelope.success || envelope.data.version !== PREVIEW_BRIDGE_VERSION) return;
        hostMessageHandlers.get(envelope.data.type)?.(event.data);
    };
    const onPopState = ()=>{
        reportLocation();
    };
    // Same-document `#` navigations fire hashchange, not popstate / pushState.
    const onHashChange = ()=>{
        reportLocation();
    };
    // Patch history so in-app SPA navigations sync the host address bar.
    window.history.pushState = (data, unused, url)=>{
        const next = data && typeof data === "object" ? {
            ...data,
            [ROOT_STATE_KEY]: false
        } : data;
        originalPushState(next, unused, url);
        reportLocation();
    };
    window.history.replaceState = (data, unused, url)=>{
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
    return ()=>{
        window.removeEventListener("message", onMessage);
        window.removeEventListener("popstate", onPopState);
        window.removeEventListener("hashchange", onHashChange);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
    };
}
function collectRoutePathsFromTree(routeTree) {
    const paths = new Set();
    const walk = (node)=>{
        if (!node || typeof node !== "object") return;
        const record = node;
        const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
        if (full !== null && full !== "") {
            paths.add(full.startsWith("/") ? full : `/${full}`);
        } else if (full === "") {
            paths.add("/");
        }
        const children = record.children;
        if (Array.isArray(children)) {
            for (const child of children)walk(child);
        } else if (children && typeof children === "object") {
            for (const child of Object.values(children)){
                walk(child);
            }
        }
    };
    walk(routeTree);
    return [
        ...paths
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=src_031c38txggj-3._.js.map