'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DiscoveredProfile, SearchAggregatedSummary } from '@/lib/osint/types';
import { decodeHtmlEntities } from '@/lib/utils/text';
import { useTheme } from '@/components/ThemeProvider';
import { getCategoryToken } from '@/lib/theme/categoryTokens';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ExternalLink, 
  User, 
  Mail, 
  MapPin, 
  Layers, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface RelationshipGraphProps {
  profiles: DiscoveredProfile[];
  summary: SearchAggregatedSummary;
  targetUsername: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'target' | 'category' | 'platform' | 'email' | 'location' | 'name';
  color: string;
  avatarUrl?: string;
  profileUrl?: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  data?: any;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'category' | 'platform' | 'attribute';
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  profiles,
  summary,
  targetUsername,
}) => {
  const { isDark } = useTheme();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Build Graph Nodes & Edges
  const { nodes, edges } = useMemo(() => {
    const nList: GraphNode[] = [];
    const eList: GraphEdge[] = [];

    const centerX = 450;
    const centerY = 350;

    // 1. Center Target Node
    const centerAvatar = summary.profilePictures[0] || undefined;
    nList.push({
      id: 'target',
      label: `@${targetUsername}`,
      type: 'target',
      color: '#0A84FF',
      avatarUrl: centerAvatar,
      x: centerX,
      y: centerY,
    });

    // 2. Category Hubs (Orbit radius: 140px)
    const categorySet = new Set<string>();
    profiles.forEach((p) => {
      const cat = p.category ? p.category.toLowerCase() : 'social';
      categorySet.add(cat);
    });

    const categories = Array.from(categorySet);
    const catRadius = 145;

    const catPositions: Record<string, { x: number; y: number }> = {};

    categories.forEach((cat, idx) => {
      const angle = (idx / categories.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + Math.cos(angle) * catRadius;
      const y = centerY + Math.sin(angle) * catRadius;
      catPositions[cat] = { x, y };

      const catToken = getCategoryToken(cat);

      nList.push({
        id: `cat-${cat}`,
        label: catToken.label.toUpperCase(),
        type: 'category',
        color: catToken.colorHex,
        x,
        y,
      });

      eList.push({
        source: 'target',
        target: `cat-${cat}`,
        type: 'category',
      });
    });

    // 3. Platform Nodes (Orbit radius: 260px - 310px around center or clustered near categories)
    profiles.forEach((p, idx) => {
      const cat = p.category ? p.category.toLowerCase() : 'social';
      const catPos = catPositions[cat] || { x: centerX, y: centerY };

      // Calculate an offset angle around its category hub
      const angle = (idx / profiles.length) * 2 * Math.PI;
      const distFromCat = 110 + (idx % 3) * 25;
      const x = catPos.x + Math.cos(angle) * distFromCat;
      const y = catPos.y + Math.sin(angle) * distFromCat;

      const pColor = getCategoryToken(cat).colorHex;

      const pNodeId = `plat-${p.id}`;
      nList.push({
        id: pNodeId,
        label: p.platform,
        type: 'platform',
        color: pColor,
        avatarUrl: p.avatarUrl,
        profileUrl: p.profileUrl,
        x,
        y,
        data: p,
      });

      eList.push({
        source: `cat-${cat}`,
        target: pNodeId,
        type: 'platform',
      });

      // 4. Connect unique discovered attributes: Emails
      if (p.email && !nList.some((n) => n.id === `email-${p.email}`)) {
        const eNodeId = `email-${p.email}`;
        nList.push({
          id: eNodeId,
          label: p.email,
          type: 'email',
          color: '#FF9F0A',
          x: x + 60,
          y: y - 40,
        });
        eList.push({
          source: pNodeId,
          target: eNodeId,
          type: 'attribute',
        });
      }

      // Discovered Locations
      if (p.location && !nList.some((n) => n.id === `loc-${p.location}`)) {
        const lNodeId = `loc-${p.location}`;
        nList.push({
          id: lNodeId,
          label: p.location,
          type: 'location',
          color: '#30D158',
          x: x - 60,
          y: y + 45,
        });
        eList.push({
          source: pNodeId,
          target: lNodeId,
          type: 'attribute',
        });
      }
    });

    return { nodes: nList, edges: eList };
  }, [profiles, summary, targetUsername]);

  // Node Map for fast coordinate lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Connected nodes map for hover highlighting
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return null;
    const connected = new Set<string>([hoveredNodeId]);
    edges.forEach((e) => {
      if (e.source === hoveredNodeId) connected.add(e.target);
      if (e.target === hoveredNodeId) connected.add(e.source);
    });
    return connected;
  }, [hoveredNodeId, edges]);

  // Filtered nodes
  const visibleNodes = useMemo(() => {
    if (filterType === 'all') return nodes;
    return nodes.filter((n) => {
      if (n.type === 'target') return true;
      if (filterType === 'platforms' && (n.type === 'platform' || n.type === 'category')) return true;
      if (filterType === 'attributes' && (n.type === 'email' || n.type === 'location' || n.type === 'name')) return true;
      return false;
    });
  }, [nodes, filterType]);

  const activeNode = useMemo(() => {
    if (selectedNodeId) {
      return nodeMap.get(selectedNodeId) || null;
    }
    return null;
  }, [selectedNodeId, nodeMap]);

  // Handle Drag / Pan (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Drag / Pan (Touch for mobile / tablet gestures)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStartRef.current.x,
        y: touch.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Dynamic theme-derived palette for SVG canvas
  const themeTokens = useMemo(() => {
    return {
      nodeBg: isDark ? '#1C1C1E' : '#FFFFFF',
      platformBg: isDark ? '#2C2C2E' : '#F2F2F7',
      platformBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
      textColor: isDark ? '#FFFFFF' : '#1D1D1F',
      subtextColor: isDark ? '#AEAEB2' : '#6E6E73',
      edgeDefault: isDark ? '#3A3A3C' : '#D1D1D6',
      gridDot: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
    };
  }, [isDark]);

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Control Bar: Filter Pills & Zoom Actions */}
      <div className="apple-card rounded-apple-card p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Entity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full no-scrollbar">
          <span className="text-xs font-semibold text-apple-label-secondary uppercase tracking-wider mr-1 hidden sm:inline">
            Graph Focus:
          </span>
          {[
            { id: 'all', label: `All Entities (${nodes.length})` },
            { id: 'platforms', label: `Platforms & Hubs (${profiles.length})` },
            { id: 'attributes', label: `Emails & Locations` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterType(item.id)}
              className={`touch-target-expand px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterType === item.id
                  ? 'bg-apple-blue text-white shadow-sm font-semibold'
                  : 'apple-chip text-apple-label-secondary hover:text-apple-label'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="touch-target-expand w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full apple-tile hover:bg-apple-chip text-apple-label transition-all"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="touch-target-expand w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full apple-tile hover:bg-apple-chip text-apple-label transition-all"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="touch-target-expand w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full apple-tile hover:bg-apple-chip text-apple-label transition-all"
            title="Reset Graph"
            aria-label="Reset Graph"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Container: fluid height for mobile viewport ergonomics */}
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] apple-card rounded-apple-hero overflow-hidden select-none border border-apple-border shadow-apple-card">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, ${themeTokens.gridDot} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Graph Surface with both mouse & touch gesture support */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((e, idx) => {
              const src = nodeMap.get(e.source);
              const tgt = nodeMap.get(e.target);
              if (!src || !tgt) return null;

              const isHighlighted =
                connectedNodeIds &&
                connectedNodeIds.has(e.source) &&
                connectedNodeIds.has(e.target);

              const isDimmed =
                connectedNodeIds &&
                (!connectedNodeIds.has(e.source) || !connectedNodeIds.has(e.target));

              return (
                <line
                  key={`edge-${idx}`}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlighted ? '#0A84FF' : e.type === 'category' ? '#5E5CE6' : themeTokens.edgeDefault}
                  strokeWidth={isHighlighted ? 2.5 : e.type === 'category' ? 1.8 : 1.2}
                  strokeDasharray={e.type === 'attribute' ? '4 3' : undefined}
                  opacity={isDimmed ? 0.15 : isHighlighted ? 0.9 : 0.45}
                  className="transition-all duration-200"
                />
              );
            })}

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isDimmed = connectedNodeIds && !connectedNodeIds.has(node.id);

              // 1. Center Target Node
              if (node.type === 'target') {
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Glowing halo ring */}
                    <circle r="42" fill="#0A84FF" opacity="0.15" className="animate-pulse-subtle" />
                    <circle
                      r="32"
                      fill={themeTokens.nodeBg}
                      stroke="#0A84FF"
                      strokeWidth="2.5"
                      className="shadow-apple-glow"
                    />

                    {node.avatarUrl ? (
                      <image
                        href={node.avatarUrl}
                        x="-22"
                        y="-22"
                        width="44"
                        height="44"
                        clipPath="url(#avatar-clip)"
                      />
                    ) : (
                      <User x="-12" y="-12" className="w-6 h-6 text-apple-blue" />
                    )}

                    <clipPath id="avatar-clip">
                      <rect x="-22" y="-22" width="44" height="44" rx="12" />
                    </clipPath>

                    {/* Label Badge */}
                    <rect
                      x="-55"
                      y="38"
                      width="110"
                      height="22"
                      rx="11"
                      fill={themeTokens.nodeBg}
                      stroke="#0A84FF"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="53"
                      textAnchor="middle"
                      fill={themeTokens.textColor}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              }

              // 2. Category Hub Node
              if (node.type === 'category') {
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer transition-opacity duration-200"
                    opacity={isDimmed ? 0.2 : 1}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    <circle
                      r={isHovered ? 26 : 22}
                      fill={themeTokens.nodeBg}
                      stroke={node.color}
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={node.color}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              }

              // 3. Platform Node
              if (node.type === 'platform') {
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer transition-opacity duration-200"
                    opacity={isDimmed ? 0.2 : 1}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Outer Squircle */}
                    <rect
                      x="-18"
                      y="-18"
                      width="36"
                      height="36"
                      rx="10"
                      fill={themeTokens.platformBg}
                      stroke={isSelected || isHovered ? node.color : themeTokens.platformBorder}
                      strokeWidth={isSelected || isHovered ? 2 : 1}
                      className="transition-all duration-150"
                    />

                    {node.avatarUrl ? (
                      <image
                        href={node.avatarUrl}
                        x="-15"
                        y="-15"
                        width="30"
                        height="30"
                        clipPath={`url(#clip-${node.id})`}
                      />
                    ) : (
                      <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill={themeTokens.textColor}
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {node.label.slice(0, 1)}
                      </text>
                    )}

                    <clipPath id={`clip-${node.id}`}>
                      <rect x="-15" y="-15" width="30" height="30" rx="8" />
                    </clipPath>

                    {/* Platform Label */}
                    <text
                      x="0"
                      y="30"
                      textAnchor="middle"
                      fill={themeTokens.textColor}
                      fontSize="10"
                      fontWeight="600"
                      className="drop-shadow-sm"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              }

              // 4. Attribute Node (Email / Location)
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={isDimmed ? 0.2 : 1}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle
                    r={isHovered ? 12 : 9}
                    fill={themeTokens.nodeBg}
                    stroke={node.color}
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  <text
                    x="16"
                    y="4"
                    fill={themeTokens.subtextColor}
                    fontSize="9"
                    fontWeight="500"
                    className="drop-shadow-sm"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Node Details Card (Bottom Right) */}
        {activeNode && (
          <div className="absolute right-4 bottom-4 w-72 sm:w-80 apple-card rounded-apple-card p-4.5 space-y-3.5 shadow-2xl border border-apple-border animate-fade-in backdrop-blur-xl">
            <div className="flex items-center justify-between pb-2 border-b border-apple-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-apple-label-tertiary">
                {activeNode.type} Entity
              </span>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="text-xs text-apple-label-tertiary hover:text-apple-label px-2 py-0.5 rounded-full hover:bg-apple-chip"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-3">
              {activeNode.avatarUrl ? (
                <img
                  src={activeNode.avatarUrl}
                  alt={activeNode.label}
                  className="w-12 h-12 rounded-[14px] object-cover border border-white/10 shrink-0 bg-apple-well"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: activeNode.color }}
                >
                  {activeNode.label.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-apple-label truncate">
                  {activeNode.data?.displayName || activeNode.label}
                </h4>
                <p className="text-xs font-mono text-apple-label-secondary truncate">
                  {activeNode.label}
                </p>
              </div>
            </div>

            {/* Extra details if available */}
            {activeNode.data?.bio && (
              <p className="text-xs text-apple-label-secondary line-clamp-2 leading-relaxed">
                {decodeHtmlEntities(activeNode.data.bio)}
              </p>
            )}

            {/* Outbound Link */}
            {activeNode.profileUrl && (
              <a
                href={activeNode.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-apple-blue/15 hover:bg-apple-blue text-apple-blue hover:text-white border border-apple-blue/25 text-xs font-semibold transition-all"
              >
                <span>Open Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Legend Hint (Bottom Left) */}
        <div className="absolute left-4 bottom-4 apple-tile px-3 py-2 rounded-full text-[11px] text-apple-label-secondary flex items-center gap-2.5 backdrop-blur-md">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-apple-blue" /> Target
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-apple-purple" /> Hubs
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-apple-green" /> Locations
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-apple-orange" /> Emails
          </span>
        </div>
      </div>
    </div>
  );
};
