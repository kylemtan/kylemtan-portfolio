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

const GROUP_COLORS: Record<string, string> = {
  ai: "#5b9df9",
  ml: "#34d399",
  web: "#60a5fa",
  research: "#a78bfa",
};

interface GraphNode extends SimulationNodeDatum {
  id: string;
  type: "hub" | "project";
  label: string;
  shortLabel: string;
  group?: string;
  projectId?: string;
  radius: number;
  color: string;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  linkId: string;
}

interface Props {
  projects: Project[];
  onNodeClick: (project: Project) => void;
}

function buildGraphData(projects: Project[]): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const nodes: GraphNode[] = [
    {
      id: "hub",
      type: "hub",
      label: "Kyle Macasilli-Tan",
      shortLabel: "KMT",
      radius: 22,
      color: "#5b9df9",
    },
    ...projects.map((p) => ({
      id: p.id,
      type: "project" as const,
      label: p.title,
      shortLabel:
        p.title.length > 10 ? p.title.split(" ")[0] : p.title,
      group: p.group,
      projectId: p.id,
      radius: p.featured ? 13 : 10,
      color: GROUP_COLORS[p.group] ?? "#5b9df9",
    })),
  ];

  const links: GraphLink[] = projects.map((p) => ({
    source: "hub",
    target: p.id,
    linkId: `hub-${p.id}`,
  }));

  // Secondary edges between same-group projects
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      if (projects[i].group === projects[j].group) {
        links.push({
          source: projects[i].id,
          target: projects[j].id,
          linkId: `${projects[i].id}-${projects[j].id}`,
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

    // Fix hub to center
    nodes[0].fx = dims.width / 2;
    nodes[0].fy = dims.height / 2;

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
      .force(
        "collide",
        forceCollide<GraphNode>().radius((d) => d.radius + 28)
      )
      .alphaDecay(0.025);

    let tickCount = 0;

    sim.on("tick", () => {
      tickCount++;
      const svg = svgRef.current;
      if (!svg) return;

      linksRef.current.forEach((link) => {
        const el = svg.querySelector<SVGLineElement>(
          `[data-link="${link.linkId}"]`
        );
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
        const el = svg.querySelector<SVGGElement>(
          `[data-node="${node.id}"]`
        );
        if (el && node.x != null) {
          el.setAttribute(
            "transform",
            `translate(${node.x},${node.y ?? 0})`
          );
        }
      });

      if (tickCount === 55) setReady(true);
    });

    if (prefersReduced.current) {
      for (let i = 0; i < 300; i++) sim.tick();
      setReady(true);
    }

    return () => {
      sim.stop();
    };
  }, [dims, projects]);

  const handleClick = useCallback(
    (node: GraphNode) => {
      if (node.type === "project") {
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
        return (
          (s === hoveredId && t === nodeId_) ||
          (t === hoveredId && s === nodeId_)
        );
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
    >
      <svg
        ref={svgRef}
        width={dims.width}
        height={dims.height}
        style={{
          opacity: ready ? 1 : 0,
          transition: prefersReduced.current
            ? "none"
            : "opacity 0.8s ease",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Node glow */}
          <filter
            id="glow-node"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Hub glow — stronger */}
          <filter
            id="glow-hub"
            x="-120%"
            y="-120%"
            width="340%"
            height="340%"
          >
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Hover glow */}
          <filter
            id="glow-hover"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Label backdrop for readability */}
          <filter id="label-bg">
            <feFlood floodColor="#0a1326" floodOpacity="0.6" result="bg" />
            <feComposite in="bg" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Links */}
        <g>
          {links.map((link, i) => {
            const active = linkConnectsHovered(link.linkId);
            const isPrimary = link.linkId.startsWith("hub-");
            return (
              <line
                key={link.linkId}
                data-link={link.linkId}
                stroke={active ? "#5b9df9" : "rgba(91,157,249,0.18)"}
                strokeWidth={active ? 1.5 : isPrimary ? 1 : 0.75}
                className={
                  !active && !prefersReduced.current ? "link-flow" : ""
                }
                style={{
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: `${4 + i * 0.4}s`,
                  transition: "stroke 0.3s, stroke-width 0.25s",
                }}
                strokeDasharray={active ? "none" : undefined}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const isHub = node.type === "hub";
            const hovered = hoveredId === node.id;
            const connected = isConnected(node.id);
            const dimmed =
              hoveredId !== null &&
              !hovered &&
              !connected &&
              hoveredId !== node.id;

            return (
              <g
                key={node.id}
                data-node={node.id}
                style={{
                  cursor:
                    node.type === "project" ? "pointer" : "default",
                  opacity: dimmed ? 0.35 : 1,
                  transition: "opacity 0.25s",
                }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(node)}
                role={node.type === "project" ? "button" : undefined}
                tabIndex={node.type === "project" ? 0 : undefined}
                aria-label={
                  node.type === "project"
                    ? `View ${node.label} details`
                    : undefined
                }
                onKeyDown={(e) => {
                  if (
                    node.type === "project" &&
                    (e.key === "Enter" || e.key === " ")
                  ) {
                    e.preventDefault();
                    handleClick(node);
                  }
                }}
              >
                {/* Pulse ring — hub only */}
                {isHub && !prefersReduced.current && (
                  <circle
                    r={node.radius}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1.5"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation:
                        "pulse-ring 2.8s cubic-bezier(0,0.2,0.8,1) infinite",
                    }}
                  />
                )}

                {/* Hover outer ring */}
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

                {/* Main circle */}
                <circle
                  r={hovered && !isHub ? node.radius + 2 : node.radius}
                  fill={node.color}
                  fillOpacity={
                    isHub ? 0.95 : hovered || connected ? 1 : 0.8
                  }
                  filter={
                    isHub
                      ? "url(#glow-hub)"
                      : hovered
                      ? "url(#glow-hover)"
                      : "url(#glow-node)"
                  }
                  style={{
                    transition:
                      "r 0.2s ease, fill-opacity 0.2s ease",
                  }}
                />

                {/* Inner specular highlight */}
                <circle
                  r={node.radius * 0.38}
                  cx={-(node.radius * 0.22)}
                  cy={-(node.radius * 0.22)}
                  fill="white"
                  fillOpacity={isHub ? 0.25 : 0.2}
                  style={{ pointerEvents: "none" }}
                />

                {/* Hub monogram */}
                {isHub && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="8.5"
                    fontWeight="700"
                    letterSpacing="1.5"
                    style={{
                      fontFamily:
                        "var(--font-geist-mono, monospace)",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    KMT
                  </text>
                )}

                {/* Node label */}
                <text
                  y={node.radius + 15}
                  textAnchor="middle"
                  fill={
                    hovered || connected
                      ? "var(--text-primary)"
                      : "var(--text-muted)"
                  }
                  fontSize={isHub ? 11 : 10}
                  fontWeight={isHub ? "600" : "400"}
                  style={{
                    fontFamily:
                      "var(--font-geist-sans, system-ui)",
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
      </svg>

      {/* Keyboard / screen-reader project list */}
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
