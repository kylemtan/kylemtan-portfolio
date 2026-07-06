"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";
import { Project } from "@/data/projects";
import { profile } from "@/data/profile";

const GROUP_COLORS: Record<string, string> = {
  ai: "#5b9df9",
  ml: "#34d399",
  web: "#60a5fa",
  research: "#a78bfa",
};

interface GraphNode extends SimulationNodeDatum {
  id: string;
  type: "hub" | "project" | "legacy";
  label: string;
  shortLabel: string;
  group?: string;
  projectId?: string;
  radius: number;
  color: string;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  linkId: string;
  kind: "primary" | "secondary" | "legacy";
}

// Ghost satellites are NOT sim nodes — positions are computed geometrically from their anchor.
// angleOffset is added to the hub→anchor direction (radians). For hub anchors, it's absolute.
interface GhostDef {
  id: string;
  anchorId: string;
  angleOffset: number;
  dist: number;
  radius: number;
}

const GHOST_DEFS: GhostDef[] = [
  { id: "gh-hub-a",  anchorId: "hub",           angleOffset: -0.7,  dist: 50, radius: 5 },
  { id: "gh-hub-b",  anchorId: "hub",           angleOffset:  2.5,  dist: 44, radius: 4 },
  { id: "gh-sem-a",  anchorId: "sempai",        angleOffset:  0.45, dist: 38, radius: 5 },
  { id: "gh-sem-b",  anchorId: "sempai",        angleOffset: -0.5,  dist: 32, radius: 4 },
  { id: "gh-rag-a",  anchorId: "gpt-torch",     angleOffset:  0.5,  dist: 36, radius: 5 },
  { id: "gh-dr-a",   anchorId: "dr-classifier", angleOffset: -0.45, dist: 34, radius: 4 },
  { id: "gh-sp-a",   anchorId: "spardle",       angleOffset:  0.4,  dist: 38, radius: 5 },
  { id: "gh-sp-b",   anchorId: "spardle",       angleOffset: -0.55, dist: 30, radius: 4 },
];

interface Props {
  projects: Project[];
  onNodeClick: (project: Project) => void;
}

function buildGraphData(projects: Project[]): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const mainProjects = projects.filter((p) => !p.legacy);
  const legacyProjects = projects.filter((p) => p.legacy);

  const nodes: GraphNode[] = [
    {
      id: "hub",
      type: "hub",
      label: profile.name,
      shortLabel: profile.shortName,
      radius: 22,
      color: "#5b9df9",
    },
    ...mainProjects.map((p) => ({
      id: p.id,
      type: "project" as const,
      label: p.title,
      shortLabel: p.title.length > 10 ? p.title.split(" ")[0] : p.title,
      group: p.group,
      projectId: p.id,
      radius: p.featured ? 13 : 10,
      color: GROUP_COLORS[p.group] ?? "#5b9df9",
    })),
    ...legacyProjects.map((p) => ({
      id: p.id,
      type: "legacy" as const,
      label: p.title,
      shortLabel: p.title.length > 10 ? p.title.split(" ")[0] : p.title,
      group: p.group,
      projectId: p.id,
      radius: 8,
      color: "#475569",
    })),
  ];

  const links: GraphLink[] = [
    ...mainProjects.map((p) => ({
      source: "hub",
      target: p.id,
      linkId: `hub-${p.id}`,
      kind: "primary" as const,
    })),
    ...legacyProjects.map((p) => ({
      source: "hub",
      target: p.id,
      linkId: `hub-${p.id}`,
      kind: "legacy" as const,
    })),
  ];

  for (let i = 0; i < mainProjects.length; i++) {
    for (let j = i + 1; j < mainProjects.length; j++) {
      if (mainProjects[i].group === mainProjects[j].group) {
        links.push({
          source: mainProjects[i].id,
          target: mainProjects[j].id,
          linkId: `${mainProjects[i].id}-${mainProjects[j].id}`,
          kind: "secondary",
        });
      }
    }
  }

  return { nodes, links };
}

function nodeId(n: GraphNode | string | number): string {
  if (typeof n === "string") return n;
  if (typeof n === "number") return String(n);
  return n.id;
}

export default function NodeGraph({ projects, onNodeClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const [dims, setDims] = useState({ width: 560, height: 460 });
  const [ready, setReady] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const prefersReduced = useRef(false);
  const initialNodes = useRef(buildGraphData(projects).nodes);
  const initialLinks = useRef(buildGraphData(projects).links);
  const parallaxRef = useRef<SVGGElement>(null);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        setDims({
          width: Math.max(rect.width, 280),
          height: Math.max(rect.height, 320),
        });
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const { nodes, links } = buildGraphData(projects);
    nodesRef.current = nodes;
    linksRef.current = links;
    setReady(false);

    const centerX = dims.width / 2;
    const centerY = dims.height / 2;

    nodes[0].fx = centerX;
    nodes[0].fy = centerY;

    // Seed non-hub nodes on a ring around the hub instead of letting
    // d3-force default them near the SVG origin (0,0) — otherwise they
    // all start clustered at the top-left corner and fan out unevenly.
    const others = nodes.slice(1);
    others.forEach((n, i) => {
      const angle = (i / others.length) * Math.PI * 2;
      const radius = 150;
      n.x = centerX + Math.cos(angle) * radius;
      n.y = centerY + Math.sin(angle) * radius;
    });

    const sim = forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(140)
          .strength(0.7)
      )
      .force("charge", forceManyBody<GraphNode>().strength(-450))
      .force("center", forceCenter(dims.width / 2, dims.height / 2))
      .force("collide", forceCollide<GraphNode>().radius((d) => d.radius + 28))
      .alphaDecay(0.025);

    let tickCount = 0;

    sim.on("tick", () => {
      tickCount++;
      const svg = svgRef.current;
      if (!svg) return;

      linksRef.current.forEach((link) => {
        const el = svg.querySelector<SVGLineElement>(`[data-link="${link.linkId}"]`);
        const s = link.source as GraphNode;
        const t = link.target as GraphNode;
        if (el && s.x != null && t.x != null) {
          el.setAttribute("x1", String(s.x));
          el.setAttribute("y1", String(s.y ?? 0));
          el.setAttribute("x2", String(t.x ?? 0));
          el.setAttribute("y2", String(t.y ?? 0));
        }
      });

      nodesRef.current.forEach((node) => {
        const el = svg.querySelector<SVGGElement>(`[data-node="${node.id}"]`);
        if (el && node.x != null) {
          el.setAttribute("transform", `translate(${node.x},${node.y ?? 0})`);
        }
      });

      // Ghost satellites: position geometrically from their anchor, not via physics
      const hub = nodesRef.current.find((n) => n.id === "hub");
      GHOST_DEFS.forEach((def) => {
        const anchor = nodesRef.current.find((n) => n.id === def.anchorId);
        if (!anchor?.x || hub?.x == null) return;

        const angle =
          def.anchorId === "hub"
            ? def.angleOffset
            : Math.atan2(
                (anchor.y ?? 0) - (hub.y ?? 0),
                (anchor.x ?? 0) - (hub.x ?? 0)
              ) + def.angleOffset;

        const gx = (anchor.x ?? 0) + Math.cos(angle) * def.dist;
        const gy = (anchor.y ?? 0) + Math.sin(angle) * def.dist;

        const circleEl = svg.querySelector<SVGCircleElement>(`[data-ghost-node="${def.id}"]`);
        if (circleEl) {
          circleEl.setAttribute("cx", String(gx));
          circleEl.setAttribute("cy", String(gy));
        }

        const lineEl = svg.querySelector<SVGLineElement>(`[data-ghost-link="${def.id}"]`);
        if (lineEl) {
          lineEl.setAttribute("x1", String(anchor.x ?? 0));
          lineEl.setAttribute("y1", String(anchor.y ?? 0));
          lineEl.setAttribute("x2", String(gx));
          lineEl.setAttribute("y2", String(gy));
        }
      });

      if (tickCount === 55) setReady(true);
    });

    if (prefersReduced.current) {
      for (let i = 0; i < 300; i++) sim.tick();
      setReady(true);
    }

    return () => { sim.stop(); };
  }, [dims, projects]);

  const handleClick = useCallback(
    (node: GraphNode) => {
      if (node.type === "project" || node.type === "legacy") {
        const p = projects.find((pr) => pr.id === node.projectId);
        if (p) onNodeClick(p);
      }
    },
    [projects, onNodeClick]
  );

  const isConnected = useCallback(
    (nodeId_: string): boolean => {
      if (!hoveredId || hoveredId === nodeId_) return false;
      return linksRef.current.some((l) => {
        const s = nodeId(l.source);
        const t = nodeId(l.target);
        return (s === hoveredId && t === nodeId_) || (t === hoveredId && s === nodeId_);
      });
    },
    [hoveredId]
  );

  const linkConnectsHovered = useCallback(
    (linkId_: string): boolean => {
      if (!hoveredId) return false;
      const link = linksRef.current.find((l) => l.linkId === linkId_);
      if (!link) return false;
      const s = nodeId(link.source);
      const t = nodeId(link.target);
      return s === hoveredId || t === hoveredId;
    },
    [hoveredId]
  );

  const { nodes, links } = {
    nodes: initialNodes.current,
    links: initialLinks.current,
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 380 }}
      aria-label="Interactive project network graph"
      onMouseMove={(e) => {
        const g = parallaxRef.current;
        const svg = svgRef.current;
        if (!g || !svg) return;
        const rect = svg.getBoundingClientRect();
        const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 22;
        const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 22;
        g.style.transform = `translate(${dx}px, ${dy}px)`;
      }}
      onMouseLeave={() => {
        const g = parallaxRef.current;
        if (g) g.style.transform = "translate(0px, 0px)";
      }}
    >
      <svg
        ref={svgRef}
        width={dims.width}
        height={dims.height}
        style={{
          opacity: ready ? 1 : 0,
          transition: prefersReduced.current ? "none" : "opacity 0.8s ease",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="glow-node" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-hub" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-hover" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="label-bg">
            <feFlood floodColor="#0a1326" floodOpacity="0.6" result="bg" />
            <feComposite in="bg" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        <g ref={parallaxRef} style={{ transition: "transform 0.35s ease-out", willChange: "transform" }}>

        {/* Ghost lines — behind everything */}
        <g>
          {GHOST_DEFS.map((def) => (
            <line
              key={`gl-${def.id}`}
              data-ghost-link={def.id}
              stroke="rgba(91,157,249,0.15)"
              strokeWidth={0.75}
            />
          ))}
        </g>

        {/* Main links */}
        <g>
          {links.map((link, i) => {
            const active = linkConnectsHovered(link.linkId);
            const isLegacy = link.kind === "legacy";
            const isPrimary = link.kind === "primary";
            return (
              <line
                key={link.linkId}
                data-link={link.linkId}
                stroke={
                  active
                    ? "#5b9df9"
                    : isLegacy
                    ? "rgba(91,157,249,0.09)"
                    : "rgba(91,157,249,0.18)"
                }
                strokeWidth={active ? 1.5 : isPrimary ? 1 : 0.75}
                className={!active && !isLegacy && !prefersReduced.current ? "link-flow" : ""}
                style={{
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: `${4 + i * 0.4}s`,
                  transition: "stroke 0.3s, stroke-width 0.25s",
                }}
              />
            );
          })}
        </g>

        {/* Ghost nodes — behind main nodes */}
        <g>
          {GHOST_DEFS.map((def) => (
            <circle
              key={`gn-${def.id}`}
              data-ghost-node={def.id}
              r={def.radius}
              fill="#5b9df9"
              fillOpacity={0.28}
              filter="url(#glow-node)"
              style={{ pointerEvents: "none" }}
            />
          ))}
        </g>

        {/* Main nodes */}
        <g>
          {nodes.map((node) => {
            const isHub = node.type === "hub";
            const isLegacy = node.type === "legacy";
            const isClickable = node.type === "project" || isLegacy;
            const hovered = hoveredId === node.id;
            const connected = isConnected(node.id);
            const dimmed =
              hoveredId !== null && !hovered && !connected;

            return (
              <g
                key={node.id}
                data-node={node.id}
                style={{
                  cursor: isClickable ? "pointer" : "default",
                  opacity: dimmed ? 0.35 : isLegacy ? 0.7 : 1,
                  transition: "opacity 0.25s",
                }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(node)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={isClickable ? `View ${node.label} details` : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleClick(node);
                  }
                }}
              >
                {isHub && !prefersReduced.current && (
                  <circle
                    r={node.radius}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1.5"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: "pulse-ring 2.8s cubic-bezier(0,0.2,0.8,1) infinite",
                    }}
                  />
                )}

                {hovered && !isHub && (
                  <circle
                    r={node.radius + 6}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: prefersReduced.current
                        ? "none"
                        : "pulse-ring 1.6s cubic-bezier(0,0.2,0.8,1) infinite",
                    }}
                  />
                )}

                <circle
                  r={hovered && !isHub ? node.radius + 2 : node.radius}
                  fill={node.color}
                  fillOpacity={isHub ? 0.95 : hovered || connected ? 1 : 0.8}
                  filter={
                    isHub ? "url(#glow-hub)" : hovered ? "url(#glow-hover)" : "url(#glow-node)"
                  }
                  style={{ transition: "r 0.2s ease, fill-opacity 0.2s ease" }}
                />

                <circle
                  r={node.radius * 0.38}
                  cx={-(node.radius * 0.22)}
                  cy={-(node.radius * 0.22)}
                  fill="white"
                  fillOpacity={isHub ? 0.25 : 0.2}
                  style={{ pointerEvents: "none" }}
                />

                {isHub && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="8.5"
                    fontWeight="700"
                    letterSpacing="1.5"
                    style={{
                      fontFamily: "var(--font-geist-mono, monospace)",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {profile.shortName}
                  </text>
                )}

                <text
                  y={node.radius + 15}
                  textAnchor="middle"
                  fill={
                    hovered || connected
                      ? "var(--text-primary)"
                      : isLegacy
                      ? "rgba(148,163,184,0.55)"
                      : "var(--text-muted)"
                  }
                  fontSize={isHub ? 11 : isLegacy ? 9 : 10}
                  fontWeight={isHub ? "600" : "400"}
                  style={{
                    fontFamily: "var(--font-geist-sans, system-ui)",
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: "fill 0.2s",
                  }}
                >
                  {node.shortLabel}
                </text>
              </g>
            );
          })}
        </g>

        </g>{/* end parallax */}
      </svg>

      <ul className="sr-only">
        {projects.map((p) => (
          <li key={p.id}>
            <button onClick={() => onNodeClick(p)}>
              {p.title} — {p.tagline}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
