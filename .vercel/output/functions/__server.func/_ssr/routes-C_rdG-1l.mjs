import { i as __toESM } from "../_runtime.mjs";
import { S as Button, T as require_react, _ as SelectIcon, a as Separator, b as SelectRoot, c as SelectScrollUpArrow, d as SelectItemIndicator, f as SelectItem$1, g as SelectPortal, h as SelectPositioner, i as TabsRoot, l as SelectScrollDownArrow, m as SelectPopup, n as TabsPanel, o as SelectGroupLabel, p as SelectList, r as TabsTab, s as SelectGroup$1, t as TabsList$1, u as SelectItemText, v as SelectValue$1, w as require_jsx_runtime, y as SelectTrigger$1 } from "../_libs/@base-ui/react+[...].mjs";
import { b as useSearch, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as z } from "../_libs/next-themes.mjs";
import { a as formatRm, c as publishedJourney, i as fareMeta, l as stationIndex, n as fareSearchParams, o as getFare, r as fareSharePath, s as pathBetween, u as stations } from "./router-ClOz6-wK.mjs";
import { t as HugeiconsIcon } from "../_libs/hugeicons__react.mjs";
import { a as PlusSignIcon, c as Copy01Icon, d as ArrowLeftRightIcon, f as ArrowDown01Icon, i as Sun01Icon, l as ArrowUpDownIcon, m as Alert02Icon, n as Train01Icon, o as Moon01Icon, p as AlertCircleIcon, r as Tick02Icon, s as MinusSignIcon, t as UnfoldMoreIcon, u as ArrowUp01Icon } from "../_libs/hugeicons__core-free-icons.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "../_libs/cn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C_rdG-1l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var alertVariants = cva("group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4", {
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
	} },
	defaultVariants: { variant: "default" }
});
function Alert({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert",
		role: "alert",
		className: cn(alertVariants({ variant }), className),
		...props
	});
}
function AlertTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert-title",
		className: cn("font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground", className),
		...props
	});
}
function AlertDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert-description",
		className: cn("text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4", className),
		...props
	});
}
var buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
			lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-9",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button$1({ className, variant = "default", size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Card({ className, size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card",
		"data-size": size,
		className: cn("group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-header",
		className: cn("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-title",
		className: cn("font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-content",
		className: cn("flex flex-col gap-3 px-(--card-spacing)", className),
		...props
	});
}
function Empty({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "empty",
		className: cn("flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border-dashed p-12 text-center text-balance", className),
		...props
	});
}
function EmptyHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "empty-header",
		className: cn("flex max-w-sm flex-col items-center gap-2", className),
		...props
	});
}
var emptyMediaVariants = cva("mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
	variants: { variant: {
		default: "bg-transparent",
		icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6"
	} },
	defaultVariants: { variant: "default" }
});
function EmptyMedia({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "empty-icon",
		"data-variant": variant,
		className: cn(emptyMediaVariants({
			variant,
			className
		})),
		...props
	});
}
function EmptyTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "empty-title",
		className: cn("font-heading text-lg font-medium tracking-tight", className),
		...props
	});
}
function EmptyDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "empty-description",
		className: cn("text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
var Select$1 = SelectRoot;
function SelectGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectGroup$1, {
		"data-slot": "select-group",
		className: cn("scroll-my-1 p-1", className),
		...props
	});
}
function SelectValue({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue$1, {
		"data-slot": "select-value",
		className: cn("flex flex-1 text-left", className),
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, { render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
			icon: UnfoldMoreIcon,
			strokeWidth: 2,
			className: "pointer-events-none size-4 text-muted-foreground"
		}) })]
	});
}
function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "start", alignOffset = 0, alignItemWithTrigger = false, collisionAvoidance = {
	side: "none",
	align: "shift",
	fallbackAxisSide: "none"
}, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPositioner, {
		side,
		sideOffset,
		align,
		alignOffset,
		alignItemWithTrigger,
		collisionAvoidance,
		className: "isolate z-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectPopup, {
			"data-slot": "select-content",
			"data-align-trigger": alignItemWithTrigger,
			className: cn("relative isolate z-50 max-h-[min(16rem,var(--available-height))] w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectList, { children }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
			]
		})
	}) });
}
function SelectLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectGroupLabel, {
		"data-slot": "select-label",
		className: cn("px-2 py-1.5 text-xs text-muted-foreground", className),
		...props
	});
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		"data-slot": "select-item",
		className: cn("relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, {
			className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, {
			render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
				icon: Tick02Icon,
				strokeWidth: 2,
				className: "pointer-events-none"
			})
		})]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpArrow, {
		"data-slot": "select-scroll-up-button",
		className: cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
			icon: ArrowUp01Icon,
			strokeWidth: 2
		})
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownArrow, {
		"data-slot": "select-scroll-down-button",
		className: cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
			icon: ArrowDown01Icon,
			strokeWidth: 2
		})
	});
}
function Separator$1({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
		"data-slot": "separator",
		orientation,
		className: cn("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", className),
		...props
	});
}
function Table({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "table-container",
		className: "relative w-full overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			"data-slot": "table",
			className: cn("w-full caption-bottom text-sm", className),
			...props
		})
	});
}
function TableHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		"data-slot": "table-header",
		className: cn("[&_tr]:border-b", className),
		...props
	});
}
function TableBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
		"data-slot": "table-body",
		className: cn("[&_tr:last-child]:border-0", className),
		...props
	});
}
function TableRow({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		"data-slot": "table-row",
		className: cn("border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted", className),
		...props
	});
}
function TableHead({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		"data-slot": "table-head",
		className: cn("h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", className),
		...props
	});
}
function TableCell({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		"data-slot": "table-cell",
		className: cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className),
		...props
	});
}
function Tabs$1({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsRoot, {
		"data-slot": "tabs",
		"data-orientation": orientation,
		className: cn("group/tabs flex gap-2 data-horizontal:flex-col", className),
		...props
	});
}
var tabsListVariants = cva("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "bg-muted",
		line: "gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function TabsList({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
		"data-slot": "tabs-list",
		"data-variant": variant,
		className: cn(tabsListVariants({ variant }), className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTab, {
		"data-slot": "tabs-trigger",
		className: cn("relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent", "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsPanel, {
		"data-slot": "tabs-content",
		className: cn("flex-1 text-sm outline-none", className),
		...props
	});
}
var STATES = [
	"Selangor",
	"Pahang",
	"Terengganu",
	"Kelantan"
];
var concessions = [
	{
		id: "adult",
		trigger: "Adult",
		label: "Adult",
		off: 0
	},
	{
		id: "student",
		trigger: "Student",
		label: "Student 13–24 · 40% off",
		off: .4
	},
	{
		id: "half",
		trigger: "Child, senior, OKU, pensioner",
		label: "Child, senior, OKU, pensioner · 50% off",
		off: .5
	}
];
function isStation(value) {
	return stations.some((station) => station.name === value);
}
function code(index) {
	return String(index).padStart(2, "0");
}
function StationSelect({ id, label, value, onChange, fit = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-2", fit ? "w-fit max-w-full self-start" : "min-w-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
			value,
			onValueChange: (next) => {
				if (isStation(next)) onChange(next);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				id,
				className: cn("min-h-11", fit ? "w-fit" : "w-full"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a station" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
				className: fit ? "w-max" : void 0,
				style: fit ? {
					width: "max-content",
					minWidth: "var(--anchor-width)"
				} : void 0,
				children: STATES.map((state) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel, { children: state }), stations.filter((station) => station.state === state).map((station) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: station.name,
					className: cn("min-h-11 cursor-pointer", fit && "w-auto"),
					children: [
						code(station.index),
						" ",
						station.name
					]
				}, station.name))] }, state))
			})]
		})]
	});
}
function ThemeToggle() {
	const { resolvedTheme, setTheme } = z();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	const dark = ready && resolvedTheme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
		variant: "outline",
		size: "icon",
		className: "size-11",
		"aria-label": dark ? "Switch to light theme" : "Switch to dark theme",
		onClick: () => setTheme(dark ? "light" : "dark"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
			icon: dark ? Sun01Icon : Moon01Icon,
			strokeWidth: 2
		})
	});
}
function LineDots({ from, to }) {
	const a = stationIndex(from);
	const b = stationIndex(to);
	const lo = Math.min(a, b);
	const hi = Math.max(a, b);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex items-center",
		"aria-hidden": "true",
		children: stations.map((station, i) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex min-w-0 flex-1 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", i === a || i === b ? "size-2.5 bg-primary" : i >= lo && i <= hi ? "bg-foreground/70" : "bg-border") }), i < stations.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-px min-w-1 flex-1", i >= lo && i < hi ? "bg-foreground" : "bg-border") }) : null]
			}, station.name);
		})
	});
}
function ShareLink({ from, to, passengers, concessionId }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const path = fareSharePath(fareSearchParams({
		from,
		to,
		passengers,
		concession: concessionId
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate font-mono text-xs text-muted-foreground",
			title: path,
			children: path
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
			variant: "outline",
			className: "min-h-11",
			onClick: () => {
				const url = `${window.location.origin}${path}`;
				navigator.clipboard.writeText(url).then(() => {
					setCopied(true);
					window.setTimeout(() => setCopied(false), 2e3);
				}, () => setCopied(false));
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
				icon: copied ? Tick02Icon : Copy01Icon,
				strokeWidth: 2
			}), copied ? "Link copied" : "Copy link"]
		})]
	});
}
function OutputCard({ from, to, passengers, concessionId }) {
	if (!from || !to) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Fare" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Your quote shows up here." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		className: "border-0 px-2 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmptyHeader, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, {
				variant: "icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
					icon: Train01Icon,
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyTitle, { children: "No fare yet" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDescription, { children: "Choose a from station and a to station to see the Economy Transit starting fare." })
		] })
	}) })] });
	if (from === to) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Fare" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: from })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
		variant: "destructive",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
				icon: Alert02Icon,
				strokeWidth: 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Same station" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, { children: [
				"Pick two different stations. A fare needs a journey, and ",
				from,
				" to ",
				from,
				" is not a trip."
			] })
		]
	}) })] });
	const fare = getFare(from, to);
	if (fare == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Fare" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
		from,
		" to ",
		to
	] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
		variant: "destructive",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
				icon: AlertCircleIcon,
				strokeWidth: 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "No published fare" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, { children: [
				"There is no Economy Transit starting fare for ",
				from,
				" to ",
				to,
				". Try another pair."
			] })
		]
	}) })] });
	const concession = concessions.find((item) => item.id === concessionId) ?? concessions[0];
	const published = publishedJourney(from, to);
	const path = pathBetween(from, to);
	const between = Math.max(0, path.length - 2);
	const direction = stationIndex(from) < stationIndex(to) ? "Eastbound" : "Westbound";
	const unit = fare * (1 - concession.off);
	const total = unit * passengers;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Starting fare · Economy Transit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "font-heading text-4xl tracking-tight",
		children: formatRm(total)
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed",
				children: [
					from,
					" to ",
					to
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					direction,
					between === 0 ? " · next station" : ` · ${between} ${between === 1 ? "station" : "stations"} in between`,
					published ? ` · ${published.km} km` : null
				]
			}),
			concession.off > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Adult starting fare ",
					formatRm(fare),
					passengers > 1 ? `, ${formatRm(unit)} each after concession` : " before concession"
				]
			}) : null,
			passengers > 1 && concession.off === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					formatRm(fare),
					" × ",
					passengers,
					" passengers"
				]
			}) : null,
			published ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Transit ", published.transitTime] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Express starts at ",
					formatRm(published.expressFare),
					" · ",
					published.expressTime
				] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareLink, {
				from,
				to,
				passengers,
				concessionId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted-foreground",
				children: "Published starting rate. Dynamic pricing can change the price by time, demand, and seats. Return fare is the same."
			})
		]
	})] });
}
function FareApp() {
	const search = useSearch({ from: "/" });
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("quote");
	const [from, setFrom] = (0, import_react.useState)(search.from ?? null);
	const [to, setTo] = (0, import_react.useState)(search.to ?? null);
	const [passengers, setPassengers] = (0, import_react.useState)(search.passengers ?? 1);
	const [concessionId, setConcessionId] = (0, import_react.useState)(search.concession ?? "adult");
	(0, import_react.useEffect)(() => {
		setFrom(search.from ?? null);
		setTo(search.to ?? null);
		setPassengers(search.passengers ?? 1);
		setConcessionId(search.concession ?? "adult");
	}, [
		search.from,
		search.to,
		search.passengers,
		search.concession
	]);
	(0, import_react.useEffect)(() => {
		const next = fareSearchParams({
			from,
			to,
			passengers,
			concession: concessionId
		});
		if (next.from === search.from && next.to === search.to && next.passengers === search.passengers && next.concession === search.concession) return;
		navigate({
			to: "/",
			search: next,
			replace: true
		});
	}, [
		from,
		to,
		passengers,
		concessionId,
		search,
		navigate
	]);
	const ready = from != null && to != null && from !== to;
	const path = (0, import_react.useMemo)(() => ready ? pathBetween(from, to) : [], [
		ready,
		from,
		to
	]);
	const through = ready ? getFare(from, to) : null;
	const hopSum = path.slice(1).reduce((sum, stop, i) => {
		return sum + (getFare(path[i].name, stop.name) ?? 0);
	}, 0);
	function openPair(origin, destination) {
		setFrom(origin);
		setTo(destination);
		setTab("quote");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-page flex-col gap-6 px-4 py-6 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-medium tracking-tight sm:text-3xl",
							children: "ECRL Fare Calculator"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-2xl text-sm leading-relaxed text-muted-foreground",
							children: "Economy Transit starting fares, Gombak to Kota Bharu. Same rate both ways. Kadar permulaan Kelas Ekonomi."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs$1, {
					value: tab,
					onValueChange: (value) => {
						if (value === "quote" || value === "line" || value === "matrix") setTab(value);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid h-11 w-full grid-cols-3 group-data-horizontal/tabs:h-11 lg:inline-flex lg:w-fit lg:self-start lg:group-data-horizontal/tabs:h-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "quote",
									className: "min-h-10 px-3 lg:flex-none lg:px-4",
									children: "Quote"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "line",
									className: "min-h-10 px-3 lg:flex-none lg:px-4",
									children: "From station"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "matrix",
									className: "min-h-10 px-3 lg:flex-none lg:px-4",
									children: "Matrix"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "quote",
							className: "pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "lg:col-start-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Journey" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Pick any two of the 16 stations." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StationSelect, {
														id: "from",
														label: "From",
														value: from,
														onChange: setFrom
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
														variant: "outline",
														className: "min-h-11",
														"aria-label": "Swap stations",
														onClick: () => {
															setFrom(to);
															setTo(from);
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
																icon: ArrowUpDownIcon,
																strokeWidth: 2,
																className: "sm:hidden"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
																icon: ArrowLeftRightIcon,
																strokeWidth: 2,
																className: "hidden sm:block"
															}),
															"Swap"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StationSelect, {
														id: "to",
														label: "To",
														value: to,
														onChange: setTo
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, { className: "my-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-4 sm:grid-cols-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Passengers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
																variant: "outline",
																size: "icon",
																className: "size-11",
																"aria-label": "Fewer passengers",
																disabled: passengers <= 1,
																onClick: () => setPassengers((n) => Math.max(1, n - 1)),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
																	icon: MinusSignIcon,
																	strokeWidth: 2
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "w-8 text-center text-sm font-medium",
																children: passengers
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
																variant: "outline",
																size: "icon",
																className: "size-11",
																"aria-label": "More passengers",
																disabled: passengers >= 9,
																onClick: () => setPassengers((n) => Math.min(9, n + 1)),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
																	icon: PlusSignIcon,
																	strokeWidth: 2
																})
															})
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex min-w-0 flex-col gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "concession",
														children: "Concession"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
														value: concessionId,
														onValueChange: (value) => {
															if (concessions.some((item) => item.id === value)) setConcessionId(value);
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															id: "concession",
															className: "min-h-11 w-full",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { children: (value) => concessions.find((item) => item.id === value)?.trigger ?? "Adult" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: concessions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: item.id,
															className: "min-h-11 cursor-pointer",
															children: item.label
														}, item.id)) })]
													})]
												})]
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:row-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutputCard, {
											from,
											to,
											passengers,
											concessionId
										})
									}),
									ready && through != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "lg:col-start-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Route" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
											code(stations[stationIndex(from)].index),
											" ",
											from,
											" →",
											" ",
											code(stations[stationIndex(to)].index),
											" ",
											to
										] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "gap-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineDots, {
													from,
													to
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
													className: "flex flex-col",
													children: path.map((stop, i) => {
														const previous = path[i - 1];
														const hop = previous ? getFare(previous.name, stop.name) : null;
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
															className: "relative flex gap-3 pb-4 last:pb-0",
															children: [
																i < path.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-3 bottom-0 left-[4px] w-px bg-border" }) : null,
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full", i === 0 || i === path.length - 1 ? "bg-primary" : "bg-muted-foreground") }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex min-w-0 flex-1 items-baseline justify-between gap-3",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "min-w-0",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																			className: "truncate text-sm font-medium",
																			children: stop.name
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																			className: "text-xs text-muted-foreground",
																			children: [
																				code(stop.index),
																				" · ",
																				stop.state
																			]
																		})]
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																		className: "shrink-0 text-sm text-muted-foreground",
																		children: hop == null ? "Board" : formatRm(hop)
																	})]
																})
															]
														}, stop.name);
													})
												}),
												hopSum !== through ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs leading-relaxed text-muted-foreground",
													children: [
														"Adjacent hops add up to ",
														formatRm(hopSum),
														". The through fare is",
														" ",
														formatRm(through),
														", which is the published station-to-station rate, not the sum of hops."
													]
												}) : null
											]
										})]
									}) : null
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "line",
							className: "pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Fares from one station" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: from ? `All destinations from ${from}, in line order. Tap a row to quote it.` : "Choose a station, then tap a destination to quote it." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StationSelect, {
									id: "line-from",
									label: "From",
									value: from,
									onChange: setFrom,
									fit: true
								}), from == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
									className: "border-0 px-2 py-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmptyHeader, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, {
											variant: "icon",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HugeiconsIcon, {
												icon: Train01Icon,
												strokeWidth: 2
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyTitle, { children: "No station selected" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDescription, { children: "Pick a from station to list the starting fare to every other stop." })
									] })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-1",
									children: stations.filter((station) => station.name !== from).map((station) => {
										const fare = getFare(from, station.name);
										const hops = Math.abs(stationIndex(station.name) - stationIndex(from));
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
											variant: "ghost",
											className: "h-auto min-h-14 w-full justify-between px-3",
											onClick: () => openPair(from, station.name),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block truncate text-sm font-medium",
													children: [
														code(station.index),
														" ",
														station.name
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-xs font-normal text-muted-foreground",
													children: [
														station.state,
														" · ",
														hops,
														" ",
														hops === 1 ? "hop" : "hops"
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 text-sm font-medium",
												children: fare == null ? "—" : formatRm(fare)
											})]
										}, station.name);
									})
								})]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "matrix",
							className: "pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Fare matrix" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Starting fares in ringgit. The row is where you board and the column is where you get off, in line order from 01 Gombak to 16 Kota Bharu. Tap a price to open that quote." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
								className: "w-full min-w-[44rem] text-sm lg:min-w-full lg:table-fixed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
										className: "sr-only",
										children: "Economy Transit starting fares. Rows are boarding stations and columns are alighting stations, 01 Gombak through 16 Kota Bharu."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "sticky left-0 z-10 w-40 bg-card",
										children: "Board"
									}), stations.map((station) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-1 text-center",
										title: station.name,
										children: code(station.index)
									}, station.name))] }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: stations.map((origin) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
										className: "sticky left-0 z-10 bg-card text-left whitespace-nowrap",
										children: [
											code(origin.index),
											" ",
											origin.name
										]
									}), stations.map((destination) => {
										const fare = getFare(origin.name, destination.name);
										const selected = origin.name === from && destination.name === to;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "p-1 text-center",
											children: fare == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex min-h-9 w-full items-center justify-center text-muted-foreground",
												children: "—"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
												size: "sm",
												variant: selected ? "default" : "ghost",
												className: "min-h-9 w-full px-1",
												onClick: () => openPair(origin.name, destination.name),
												"aria-label": `${origin.name} to ${destination.name}, ${formatRm(fare)}`,
												children: fare
											})
										}, destination.name);
									})] }, origin.name)) })
								]
							}) })] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex max-w-2xl flex-col gap-1 text-xs leading-relaxed text-muted-foreground",
					children: [fareMeta.notes.slice(0, 3).map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Concession figures apply the announced 40% and 50% discounts to the starting fare. They are not a live ticket price." })]
				})
			]
		})
	});
}
var SplitComponent = FareApp;
//#endregion
export { SplitComponent as component };
