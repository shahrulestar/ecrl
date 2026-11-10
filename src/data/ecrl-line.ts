import { stations, type StationName } from "@/data/fares";

/**
 * Tight crop on Kelantan, Terengganu and Pahang, with enough of Selangor
 * to keep Gombak and the state borders around the whole line in frame.
 */
export const peninsulaViewBox = "102 48 156 246";

export interface LineStop {
  name: StationName;
  x: number;
  y: number;
  /** Which way the name sits, so it clears the line. */
  label: "n" | "e" | "s" | "w";
}

interface Point {
  x: number;
  y: number;
}

interface Segment {
  p1: Point;
  c1: Point;
  c2: Point;
  p2: Point;
}

interface ShapePoint extends Point {
  name?: StationName;
  label?: LineStop["label"];
}

/**
 * The passenger line, traced to the ecrl.com.my schematic: a hook out of
 * Selangor, a sag across Pahang, a wide turn at the Kuantan coast, then a
 * smooth run north. Points without a name only shape the curve.
 */
const shape: ShapePoint[] = [
  { name: "Gombak", x: 133.2, y: 260.2, label: "s" },
  { x: 145, y: 248.5 },
  { x: 154, y: 257 },
  { name: "Bentong", x: 166, y: 245.5, label: "n" },
  { x: 180, y: 255 },
  { name: "Temerloh", x: 194, y: 250, label: "s" },
  { name: "Maran", x: 208, y: 242, label: "s" },
  { name: "Paya Besar", x: 218, y: 234, label: "s" },
  { name: "KotaSAS", x: 226, y: 226.5, label: "n" },
  { x: 234, y: 222 },
  { x: 237.6, y: 214 },
  { name: "Kuantan Port City", x: 238.2, y: 208.5, label: "w" },
  { name: "Cherating", x: 238.5, y: 205.2, label: "w" },
  { name: "Chukai", x: 240.4, y: 194, label: "w" },
  { name: "Kemasik", x: 239.4, y: 178, label: "w" },
  { name: "Dungun", x: 235.4, y: 160, label: "w" },
  { name: "Kuala Terengganu", x: 225.6, y: 142, label: "w" },
  { name: "Bandar Permaisuri", x: 211, y: 126, label: "w" },
  { name: "Jerteh", x: 196, y: 112, label: "w" },
  { name: "Pasir Puteh", x: 180, y: 96.5, label: "w" },
  { name: "Kota Bharu", x: 168, y: 79, label: "n" },
];

/** Stations in line order, in the Malaysia map's SVG coordinates. */
export const lineStops: LineStop[] = shape.flatMap((point) =>
  point.name && point.label
    ? [{ name: point.name, x: point.x, y: point.y, label: point.label }]
    : [],
);

if (lineStops.map((stop) => stop.name).join() !== stations.map((stop) => stop.name).join()) {
  throw new Error("ECRL line stops must follow the station list");
}

function segment(p0: Point, p1: Point, p2: Point, p3: Point): Segment {
  return {
    p1,
    p2,
    c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
    c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
  };
}

function pointOn(seg: Segment, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * seg.p1.x + 3 * u * u * t * seg.c1.x + 3 * u * t * t * seg.c2.x + t * t * t * seg.p2.x,
    y: u * u * u * seg.p1.y + 3 * u * u * t * seg.c1.y + 3 * u * t * t * seg.c2.y + t * t * t * seg.p2.y,
  };
}

function segmentLength(seg: Segment) {
  let length = 0;
  let prev = seg.p1;
  for (let step = 1; step <= 16; step++) {
    const next = pointOn(seg, step / 16);
    length += Math.hypot(next.x - prev.x, next.y - prev.y);
    prev = next;
  }
  return length;
}

function buildRoute(points: ShapePoint[]) {
  const segments = points.slice(0, -1).map((_, index) => {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    return segment(p0, p1, p2, p3);
  });
  const lengths = segments.map(segmentLength);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const at = [0];
  let covered = 0;
  for (let index = 0; index < lengths.length; index++) {
    covered += lengths[index];
    if (points[index + 1].name) at.push(covered / total);
  }
  const round = (value: number) => Math.round(value * 10) / 10;
  const d = [
    `M ${points[0].x} ${points[0].y}`,
    ...segments.map(
      (seg) =>
        `C ${round(seg.c1.x)} ${round(seg.c1.y)} ${round(seg.c2.x)} ${round(seg.c2.y)} ${seg.p2.x} ${seg.p2.y}`,
    ),
  ].join(" ");
  return { d, at, length: total };
}

/** Smooth path through the stations, with each stop's position along it from 0 to 1. */
export const ecrlRoute = buildRoute(shape);
