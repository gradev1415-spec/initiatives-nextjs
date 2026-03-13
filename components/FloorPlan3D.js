"use client";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";

/* ── Syncs Three.js clear color with React theme (re-runs on T.bg change) ── */
function SceneBg(props) {
  var gl = useThree(function (s) { return s.gl; });
  useEffect(function () {
    gl.setClearColor(new THREE.Color(props.bg));
  }, [gl, props.bg]);
  return null;
}

/* ── 3D Zone Layout Definitions ──
   Coordinate system: x = left-right, z = front-back (entrance at +z), y = up
   Floor slab: 10 wide (x: -5..+5), 7 deep (z: -3.5..+3.5) */

var FLOOR_W = 10, FLOOR_D = 7;

var PLANS_3D = {
  lt1: [
    {zones:[
      {aid:"a5",x:-5,z:-3.5,w:3.2,d:3},
      {aid:"a2",x:-1.8,z:-3.5,w:4,d:3},
      {aid:"a3",x:2.2,z:-3.5,w:2.8,d:3},
      {aid:"a1",x:-5,z:-0.5,w:3.2,d:4},
      {aid:"a6",x:-1.8,z:-0.5,w:4,d:4},
      {aid:"a4",x:2.2,z:-0.5,w:2.8,d:4}
    ],parts:[[-1.8,-3.5,-1.8,3.5],[2.2,-3.5,2.2,3.5],[-5,-0.5,5,-0.5]]},
    {zones:[
      {aid:"a3",x:-5,z:-3.5,w:2.8,d:3},
      {aid:"a2",x:-2.2,z:-3.5,w:4,d:3},
      {aid:"a5",x:1.8,z:-3.5,w:3.2,d:3},
      {aid:"a4",x:-5,z:-0.5,w:2.8,d:4},
      {aid:"a6",x:-2.2,z:-0.5,w:4,d:4},
      {aid:"a1",x:1.8,z:-0.5,w:3.2,d:4}
    ],parts:[[-2.2,-3.5,-2.2,3.5],[1.8,-3.5,1.8,3.5],[-5,-0.5,5,-0.5]]},
    {zones:[
      {aid:"a1",x:-5,z:-3.5,w:6.4,d:2.3},
      {aid:"a5",x:1.4,z:-3.5,w:3.6,d:2.3},
      {aid:"a3",x:-5,z:-1.2,w:3.3,d:2.2},
      {aid:"a2",x:-1.7,z:-1.2,w:3.4,d:2.2},
      {aid:"a4",x:1.7,z:-1.2,w:3.3,d:2.2},
      {aid:"a6",x:-5,z:1,w:10,d:2.5}
    ],parts:[[1.4,-3.5,1.4,-1.2],[-5,-1.2,5,-1.2],[-1.7,-1.2,-1.7,1],[1.7,-1.2,1.7,1],[-5,1,5,1]]},
    {zones:[
      {aid:"a5",x:-5,z:-3.5,w:3.3,d:3},
      {aid:"a2",x:-1.7,z:-3.5,w:3.4,d:3},
      {aid:"a3",x:1.7,z:-3.5,w:3.3,d:2},
      {aid:"a1",x:-5,z:-0.5,w:3.3,d:4},
      {aid:"a6",x:-1.7,z:-0.5,w:3.4,d:4},
      {aid:"a4",x:1.7,z:-1.5,w:3.3,d:5}
    ],parts:[[-1.7,-3.5,-1.7,3.5],[1.7,-3.5,1.7,3.5],[-5,-0.5,1.7,-0.5],[1.7,-1.5,5,-1.5]]}
  ],
  lt2: [
    {zones:[
      {aid:"a7",x:-5,z:-3.5,w:2.2,d:3},
      {aid:"a5",x:-2.8,z:-3.5,w:2.5,d:3},
      {aid:"a2",x:-0.3,z:-3.5,w:3.1,d:3},
      {aid:"a8",x:2.8,z:-3.5,w:2.2,d:3},
      {aid:"a1",x:-5,z:-0.5,w:3.2,d:4},
      {aid:"a3",x:-1.8,z:-0.5,w:2.5,d:4},
      {aid:"a6",x:0.7,z:-0.5,w:2.1,d:4},
      {aid:"a4",x:2.8,z:-0.5,w:2.2,d:4}
    ],parts:[
      [-2.8,-3.5,-2.8,-0.5],[-0.3,-3.5,-0.3,-0.5],[2.8,-3.5,2.8,-0.5],
      [-1.8,-0.5,-1.8,3.5],[0.7,-0.5,0.7,3.5],[2.8,-0.5,2.8,3.5],
      [-5,-0.5,5,-0.5]
    ]}
  ]
};

/* ── Auto-compute partition walls from zone adjacency ── */
function computePartitions(zones) {
  var parts = [];
  var tol = 0.15;
  for (var i = 0; i < zones.length; i++) {
    for (var j = i + 1; j < zones.length; j++) {
      var a = zones[i], b = zones[j];
      var aR = a.x + a.w, bR = b.x + b.w;
      var aB = a.z + a.d, bB = b.z + b.d;
      /* Shared vertical edge: a's right == b's left */
      if (Math.abs(aR - b.x) < tol) {
        var zMin = Math.max(a.z, b.z);
        var zMax = Math.min(aB, bB);
        if (zMax - zMin > tol) parts.push([aR, zMin, aR, zMax]);
      }
      /* Shared vertical edge: b's right == a's left */
      if (Math.abs(bR - a.x) < tol) {
        var zMin2 = Math.max(a.z, b.z);
        var zMax2 = Math.min(aB, bB);
        if (zMax2 - zMin2 > tol) parts.push([a.x, zMin2, a.x, zMax2]);
      }
      /* Shared horizontal edge: a's bottom == b's top */
      if (Math.abs(aB - b.z) < tol) {
        var xMin = Math.max(a.x, b.x);
        var xMax = Math.min(aR, bR);
        if (xMax - xMin > tol) parts.push([xMin, aB, xMax, aB]);
      }
      /* Shared horizontal edge: b's bottom == a's top */
      if (Math.abs(bB - a.z) < tol) {
        var xMin2 = Math.max(a.x, b.x);
        var xMax2 = Math.min(aR, bR);
        if (xMax2 - xMin2 > tol) parts.push([xMin2, a.z, xMax2, a.z]);
      }
    }
  }
  return parts;
}

/* ── Wireframe edge from point A to B using Line ── */
function WireLine(props) {
  var pts = props.points;
  var color = props.color;
  var opacity = props.opacity || 0.3;
  return (
    <Line
      points={pts}
      color={color}
      lineWidth={0.8}
      transparent
      opacity={opacity}
    />
  );
}

/* ── Edge Handle for resize (visible on hover) ── */
function EdgeHandle(props) {
  var zone = props.zone, edge = props.edge, tint = props.tint, om = props.om;
  var onResizeStart = props.onResizeStart;
  var _h = useState(false); var isHov = _h[0]; var setHov = _h[1];

  var cx = zone.x + zone.w / 2;
  var cz = zone.z + zone.d / 2;
  var pos, sizeW, sizeD;
  if (edge === "left") { pos = [zone.x, 0.06, cz]; sizeW = 0.2; sizeD = zone.d * 0.5; }
  else if (edge === "right") { pos = [zone.x + zone.w, 0.06, cz]; sizeW = 0.2; sizeD = zone.d * 0.5; }
  else if (edge === "back") { pos = [cx, 0.06, zone.z]; sizeW = zone.w * 0.5; sizeD = 0.2; }
  else { pos = [cx, 0.06, zone.z + zone.d]; sizeW = zone.w * 0.5; sizeD = 0.2; }

  var isHoriz = edge === "left" || edge === "right";

  return (
    <mesh
      position={pos}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={function (e) {
        e.stopPropagation();
        setHov(true);
        document.body.style.cursor = isHoriz ? "ew-resize" : "ns-resize";
      }}
      onPointerOut={function () {
        setHov(false);
        document.body.style.cursor = "default";
      }}
      onPointerDown={function (e) {
        e.stopPropagation();
        onResizeStart(zone.aid, edge, e);
      }}
    >
      <planeGeometry args={[sizeW, sizeD]} />
      <meshBasicMaterial
        color={tint}
        transparent
        opacity={isHov ? Math.min(0.25 * om, 0.4) : 0.02}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Resize drag logic component (lives inside Canvas) ── */
function ResizeDragger(props) {
  var controlsRef = props.controlsRef;
  var dragRef = props.dragRef;
  var onResize = props.onResize;
  var camera = useThree(function (s) { return s.camera; });
  var gl = useThree(function (s) { return s.gl; });
  var raycaster = useRef(new THREE.Raycaster());
  var floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  useEffect(function () {
    var canvas = gl.domElement;
    function onMove(e) {
      if (!dragRef.current) return;
      var rect = canvas.getBoundingClientRect();
      var mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.current.setFromCamera(mouse, camera);
      var pt = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(floorPlane.current, pt);
      if (pt) {
        var snappedX = Math.round(pt.x * 2) / 2;
        var snappedZ = Math.round(pt.z * 2) / 2;
        onResize(dragRef.current.aid, dragRef.current.edge, snappedX, snappedZ);
      }
    }
    function onUp() {
      if (dragRef.current && controlsRef.current) {
        controlsRef.current.enabled = true;
      }
      dragRef.current = null;
      document.body.style.cursor = "default";
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return function () {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, onResize, controlsRef, dragRef]);

  return null;
}

/* ── Drag ghost — shows outline of dragged zone following cursor on floor ── */
function DragGhost(props) {
  var tint = props.tint, om = props.om, dragState = props.dragState;
  var grpRef = useRef();
  var matRef = useRef();
  var camera = useThree(function (s) { return s.camera; });
  var gl = useThree(function (s) { return s.gl; });
  var raycaster = useRef(new THREE.Raycaster());
  var floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  useFrame(function (state) {
    if (!dragState.current || !dragState.current.dragging || !grpRef.current) {
      if (grpRef.current) grpRef.current.visible = false;
      return;
    }
    grpRef.current.visible = true;
    var pointer = dragState.current.pointer;
    if (pointer) {
      raycaster.current.setFromCamera(pointer, camera);
      var pt = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(floorPlane.current, pt);
      if (pt) {
        grpRef.current.position.x = pt.x;
        grpRef.current.position.z = pt.z;
      }
    }
    if (matRef.current) {
      var t = state.clock.getElapsedTime();
      matRef.current.opacity = Math.min((0.12 + 0.06 * Math.sin(t * 4)) * om, 0.3);
    }
  });

  /* Use a fixed 2x2 ghost size (approximate) — will be positioned at cursor */
  return (
    <group ref={grpRef} visible={false}>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial ref={matRef} color={tint} transparent opacity={0.15} depthWrite={false} />
      </mesh>
      {/* Ghost border */}
      <Line
        points={[[-1, 0.09, -1], [1, 0.09, -1], [1, 0.09, 1], [-1, 0.09, 1], [-1, 0.09, -1]]}
        color={tint}
        lineWidth={1.5}
        transparent
        opacity={Math.min(0.4 * om, 0.65)}
        dashed
        dashSize={0.15}
        gapSize={0.1}
      />
    </group>
  );
}

/* ── Drag-and-drop reorder helper (raycasts to find drop target zone) ── */
function DragDropHelper(props) {
  var controlsRef = props.controlsRef;
  var dragState = props.dragState;
  var zones = props.zones;
  var onDrop = props.onDrop;
  var onDropTarget = props.onDropTarget;
  var onDragEnd = props.onDragEnd;
  var camera = useThree(function (s) { return s.camera; });
  var gl = useThree(function (s) { return s.gl; });
  var raycaster = useRef(new THREE.Raycaster());
  var floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  useEffect(function () {
    var canvas = gl.domElement;

    function getFloorPt(e) {
      var rect = canvas.getBoundingClientRect();
      var mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.current.setFromCamera(mouse, camera);
      var pt = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(floorPlane.current, pt);
      return { pt: pt, mouse: mouse };
    }

    function findZoneAt(pt) {
      if (!pt) return null;
      for (var i = 0; i < zones.length; i++) {
        var z = zones[i];
        if (pt.x >= z.x && pt.x <= z.x + z.w && pt.z >= z.z && pt.z <= z.z + z.d) {
          return z.aid;
        }
      }
      return null;
    }

    function onMove(e) {
      if (!dragState.current) return;
      if (dragState.current.mode === "reorder-pending") {
        var dx = e.clientX - (dragState.current.startX || 0);
        var dy = e.clientY - (dragState.current.startY || 0);
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
          dragState.current.mode = "reorder-dragging";
          dragState.current.dragging = true;
          document.body.style.cursor = "grabbing";
        }
      }
      if (dragState.current.mode === "reorder-dragging") {
        var res = getFloorPt(e);
        dragState.current.pointer = res.mouse;
        var target = findZoneAt(res.pt);
        if (target !== dragState.current.aid) {
          onDropTarget(target);
        } else {
          onDropTarget(null);
        }
      }
    }

    function onUp(e) {
      if (!dragState.current) return;
      if (dragState.current.mode === "reorder-dragging") {
        var res = getFloorPt(e);
        var target = findZoneAt(res.pt);
        if (target && target !== dragState.current.aid) {
          onDrop(dragState.current.aid, target);
        }
      }
      if (controlsRef.current) controlsRef.current.enabled = true;
      dragState.current = null;
      onDropTarget(null);
      if (onDragEnd) onDragEnd();
      document.body.style.cursor = "default";
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return function () {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, zones, onDrop, onDropTarget, onDragEnd, controlsRef, dragState]);

  return null;
}

/* ── Single Zone ── */
function FloorZone(props) {
  var zone = props.zone, isSel = props.isSel, isHov = props.isHov, isGhost = props.isGhost;
  var rd = props.rd, tint = props.tint;
  var onHover = props.onHover, onSelect = props.onSelect;
  var depthFade = props.depthFade;
  var om = props.om || 1;
  var isDragSrc = props.isDragSrc;
  var isDragTarget = props.isDragTarget;
  var editMode = props.editMode;
  var onDragInit = props.onDragInit;

  var cx = zone.x + zone.w / 2;
  var cz = zone.z + zone.d / 2;
  var hw = zone.w / 2 - 0.03;
  var hd = zone.d / 2 - 0.03;

  /* Opacity: ghost=very faint, normal=subtle, hover=brighter, selected=brightest */
  var fillOpacity;
  if (isGhost) { fillOpacity = 0.02 * om * depthFade; }
  else if (isDragTarget) { fillOpacity = Math.min(0.25 * om, 0.4) * depthFade; }
  else if (isDragSrc) { fillOpacity = Math.min(0.06 * om, 0.12) * depthFade; }
  else if (isSel) { fillOpacity = Math.min(0.18 * om, 0.32) * depthFade; }
  else if (isHov) { fillOpacity = Math.min(0.12 * om, 0.22) * depthFade; }
  else { fillOpacity = Math.min(0.04 * om, 0.08) * depthFade; }

  /* Edge lines for zone boundary — thin wireframe look */
  var y = 0.05;
  var corners = [
    [zone.x + 0.03, y, zone.z + 0.03],
    [zone.x + zone.w - 0.03, y, zone.z + 0.03],
    [zone.x + zone.w - 0.03, y, zone.z + zone.d - 0.03],
    [zone.x + 0.03, y, zone.z + zone.d - 0.03]
  ];
  var edgeOpacity = isGhost ? 0.06 * om : isDragTarget ? Math.min(0.7 * om, 0.9) : isDragSrc ? Math.min(0.15 * om, 0.25) : isSel ? Math.min(0.5 * om, 0.75) : isHov ? Math.min(0.35 * om, 0.55) : Math.min(0.12 * om, 0.25);
  /* In edit mode, make non-ghost zone edges a bit brighter */
  if (editMode && !isGhost && !isDragSrc && !isDragTarget && !isSel && !isHov) {
    edgeOpacity = Math.min(0.18 * om, 0.3);
  }
  edgeOpacity *= depthFade;

  /* Text opacity scales with depth */
  var labelAlpha = isGhost ? 0.15 * om : isDragSrc ? Math.min(0.2 * om, 0.35) : isSel || isHov || isDragTarget ? Math.min(0.85 * om, 1) : Math.min(0.45 * om, 0.7);
  labelAlpha *= depthFade;
  var pctAlpha = isDragSrc ? Math.min(0.2 * om, 0.35) : isSel || isHov || isDragTarget ? Math.min(0.9 * om, 1) : Math.min(0.5 * om, 0.8);
  pctAlpha *= depthFade;

  return (
    <group>
      {/* Fill plane */}
      <mesh
        position={[cx, 0.04, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={isGhost ? undefined : function (e) { e.stopPropagation(); onSelect(zone.aid); }}
        onPointerOver={isGhost ? undefined : function (e) { e.stopPropagation(); onHover(zone.aid); if (!editMode) document.body.style.cursor = "pointer"; else document.body.style.cursor = "grab"; }}
        onPointerOut={isGhost ? undefined : function () { onHover(null); document.body.style.cursor = "default"; }}
        onPointerDown={editMode && !isGhost && onDragInit ? function (e) { e.stopPropagation(); onDragInit(zone.aid, e.nativeEvent || e); } : undefined}
      >
        <planeGeometry args={[zone.w - 0.06, zone.d - 0.06]} />
        <meshBasicMaterial
          color={tint}
          transparent
          opacity={fillOpacity}
          depthWrite={false}
        />
      </mesh>

      {/* Zone edge wireframe — 4 edges */}
      <WireLine points={[corners[0], corners[1]]} color={tint} opacity={edgeOpacity} />
      <WireLine points={[corners[1], corners[2]]} color={tint} opacity={edgeOpacity} />
      <WireLine points={[corners[2], corners[3]]} color={tint} opacity={edgeOpacity} />
      <WireLine points={[corners[3], corners[0]]} color={tint} opacity={edgeOpacity} />

      {/* Zone label — flat on ground */}
      {!isGhost && (
        <Text
          position={[cx, 0.08, cz - 0.18]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color={tint}
          anchorX="center"
          anchorY="middle"
          font={undefined}
          maxWidth={zone.w - 0.4}
          textAlign="center"
          fillOpacity={labelAlpha}
        >
          {props.label}
        </Text>
      )}
      {isGhost && (
        <Text
          position={[cx, 0.08, cz]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.18}
          color={tint}
          anchorX="center"
          anchorY="middle"
          font={undefined}
          maxWidth={zone.w - 0.3}
          textAlign="center"
          fillOpacity={Math.min(0.12 * om, 0.22) * depthFade}
        >
          {props.label}
        </Text>
      )}

      {/* Readiness % */}
      {!isGhost && (
        <Text
          position={[cx, 0.08, cz + 0.18]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.26}
          color={tint}
          anchorX="center"
          anchorY="middle"
          font={undefined}
          fillOpacity={pctAlpha}
        >
          {rd + "%"}
        </Text>
      )}
    </group>
  );
}

/* ── Full Floor Model ── */
function FloorModel(props) {
  var plan = props.plan, T = props.T, tint = props.tint, isDark = props.isDark;
  var areaMap = props.areaMap, templateMap = props.templateMap;
  var activeArea = props.activeArea, hovArea = props.hovArea;
  var onSelect = props.onSelect, onHover = props.onHover;
  var areaRdFn = props.areaRdFn;
  var editMode = props.editMode, dragSrcAid = props.dragSrcAid, dropTargetAid = props.dropTargetAid;
  var onResizeStart = props.onResizeStart, onDragInit = props.onDragInit;

  var hw = FLOOR_W / 2, hd = FLOOR_D / 2;
  var y = 0.05;
  var wy = 0.25;

  var om = isDark ? 1 : 1.6;

  function depthFade(z) {
    var norm = (z + hd) / FLOOR_D;
    return 0.75 + 0.25 * norm;
  }

  var outerBottom = [
    [-hw, y, -hd], [hw, y, -hd], [hw, y, hd],
    [-hw, y, hd], [-hw, y, -hd]
  ];
  var outerTop = outerBottom.map(function (p) { return [p[0], wy, p[2]]; });
  var pillarPts = [
    [-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]
  ];

  /* Blueprint grid */
  var gridPad = 2.5;
  var gridStep = 1;
  var gridY = 0.005;
  var gridXmin = -hw - gridPad, gridXmax = hw + gridPad;
  var gridZmin = -hd - gridPad, gridZmax = hd + gridPad;
  var gridLines = [];
  var gx = Math.ceil(gridXmin / gridStep) * gridStep;
  while (gx <= gridXmax) {
    gridLines.push({ p: [[gx, gridY, gridZmin], [gx, gridY, gridZmax]], major: gx % 5 === 0 });
    gx += gridStep;
  }
  var gz = Math.ceil(gridZmin / gridStep) * gridStep;
  while (gz <= gridZmax) {
    gridLines.push({ p: [[gridXmin, gridY, gz], [gridXmax, gridY, gz]], major: gz % 5 === 0 });
    gz += gridStep;
  }

  return (
    <group>
      {/* Blueprint grid lines */}
      {gridLines.map(function (gl, i) {
        return (
          <Line
            key={"grid" + i}
            points={gl.p}
            color={tint}
            lineWidth={gl.major ? 0.5 : 0.3}
            transparent
            opacity={gl.major ? Math.min(0.06 * om, 0.12) : Math.min(0.025 * om, 0.05)}
          />
        );
      })}

      {/* Floor base plane */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[FLOOR_W + 0.1, FLOOR_D + 0.1]} />
        <meshBasicMaterial color={tint} transparent opacity={Math.min(0.015 * om, 0.04)} depthWrite={false} />
      </mesh>

      {/* Outer walls — bottom wireframe loop */}
      <Line points={outerBottom} color={tint} lineWidth={1.2} transparent opacity={Math.min(0.35 * om, 0.7)} />
      {/* Outer walls — top wireframe loop */}
      <Line points={outerTop} color={tint} lineWidth={0.6} transparent opacity={Math.min(0.15 * om, 0.35)} />
      {/* Vertical pillars */}
      {pillarPts.map(function (p, i) {
        return (
          <Line key={"vp" + i} points={[[p[0], y, p[1]], [p[0], wy, p[1]]]} color={tint} lineWidth={0.6} transparent opacity={Math.min(0.15 * om, 0.35)} />
        );
      })}

      {/* Partition lines */}
      {plan.parts.map(function (p, i) {
        return (
          <Line key={"pw" + i} points={[[p[0], y, p[1]], [p[2], y, p[3]]]} color={tint} lineWidth={0.6} transparent opacity={Math.min(0.12 * om, 0.25)} />
        );
      })}
      {/* Partition top edges + verticals */}
      {plan.parts.map(function (p, i) {
        var partH = 0.15;
        return (
          <group key={"pwt" + i}>
            <Line points={[[p[0], partH, p[1]], [p[2], partH, p[3]]]} color={tint} lineWidth={0.4} transparent opacity={Math.min(0.06 * om, 0.14)} />
            <Line points={[[p[0], y, p[1]], [p[0], partH, p[1]]]} color={tint} lineWidth={0.4} transparent opacity={Math.min(0.06 * om, 0.14)} />
            <Line points={[[p[2], y, p[3]], [p[2], partH, p[3]]]} color={tint} lineWidth={0.4} transparent opacity={Math.min(0.06 * om, 0.14)} />
          </group>
        );
      })}

      {/* Zone planes */}
      {plan.zones.map(function (z) {
        var area = areaMap[z.aid];
        var isGhost = !area;
        var rd = area ? areaRdFn(area) : 0;
        var label = area ? area.anm : (templateMap[z.aid] ? templateMap[z.aid].anm : "");
        var zCenter = z.z + z.d / 2;
        var isDragSrc = dragSrcAid === z.aid;
        var isDragTgt = dropTargetAid === z.aid;
        return (
          <group key={z.aid}>
            <FloorZone
              zone={z}
              isSel={activeArea === z.aid}
              isHov={hovArea === z.aid}
              isGhost={isGhost}
              isDragSrc={isDragSrc}
              isDragTarget={isDragTgt}
              editMode={editMode}
              rd={rd}
              tint={tint}
              label={label}
              depthFade={depthFade(zCenter)}
              om={om}
              onHover={onHover}
              onSelect={onSelect}
              onDragInit={onDragInit}
            />
            {/* Edge handles — only in edit mode for non-ghost zones */}
            {editMode && !isGhost && ["left", "right", "back", "front"].map(function (edge) {
              return (
                <EdgeHandle
                  key={z.aid + "-" + edge}
                  zone={z}
                  edge={edge}
                  tint={tint}
                  om={om}
                  onResizeStart={onResizeStart}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

/* ── Main Export ── */
export default function FloorPlan3D(props) {
  var dept = props.dept, activeArea = props.activeArea, hovArea = props.hovArea;
  var onSelectArea = props.onSelectArea, onHoverArea = props.onHoverArea;
  var T = props.T, statusClrFn = props.statusClrFn, areaRdFn = props.areaRdFn;
  var areaStaffFn = props.areaStaffFn, areaSkillRdFn = props.areaSkillRdFn, areaCertRdFn = props.areaCertRdFn;

  var isDark = T.bg.charAt(1) === "0" || T.bg.charAt(1) === "1";
  var tint = isDark ? "#73A6FF" : "#4A7FBF";

  /* Resolve layout & variant */
  var layoutId = dept.layout || (dept.areas.length > 6 ? "lt2" : "lt1");
  var variants = PLANS_3D[layoutId] || PLANS_3D.lt1;
  var varIdx = dept.did ? dept.did.charCodeAt(1) % variants.length : 0;
  var baseVariant = variants[varIdx];
  var layoutLabel = layoutId === "lt2" ? "POWERHOUSE XL" : "POWER Standard";

  /* ── Edit mode state ── */
  var _em = useState(false); var editMode = _em[0]; var setEditMode = _em[1];
  var _cz = useState(null); var customZones = _cz[0]; var setCustomZones = _cz[1];
  var _dsa = useState(null); var dragSrcAid = _dsa[0]; var setDragSrcAid = _dsa[1];
  var _dta = useState(null); var dropTargetAid = _dta[0]; var setDropTargetAid = _dta[1];
  var controlsRef = useRef(null);
  var dragRef = useRef(null); /* for resize drags */
  var dragState = useRef(null); /* for reorder drags */

  /* Reset custom layout when dept changes */
  useEffect(function () {
    setCustomZones(null);
    setEditMode(false);
    setDragSrcAid(null);
    setDropTargetAid(null);
  }, [dept.did]);

  /* Working plan: custom overrides or base variant */
  var plan = customZones || baseVariant;

  /* Build area lookup */
  var areaMap = useMemo(function () {
    var m = {};
    dept.areas.forEach(function (a) { m[a.aid] = a; });
    return m;
  }, [dept]);

  var templateMap = useMemo(function () {
    var m = {};
    var LAYOUT_TEMPLATES = require("@/lib/data").LAYOUT_TEMPLATES;
    LAYOUT_TEMPLATES.forEach(function (lt) {
      if (lt.id === layoutId) {
        lt.areas.forEach(function (a) { m[a.aid] = a; });
      }
    });
    return m;
  }, [layoutId]);

  /* ── Zone click: select in normal mode, no-op in edit mode (drag handles it) ── */
  function handleZoneClick(aid) {
    if (!editMode) {
      onSelectArea(aid);
    }
  }

  /* ── Drag-and-drop reorder: init, target tracking, and drop ── */
  function handleDragInit(aid, nativeEvt) {
    if (!editMode) return;
    var sx = nativeEvt ? nativeEvt.clientX : 0;
    var sy = nativeEvt ? nativeEvt.clientY : 0;
    dragState.current = { aid: aid, mode: "reorder-pending", dragging: false, pointer: null, startX: sx, startY: sy };
    setDragSrcAid(aid);
    if (controlsRef.current) controlsRef.current.enabled = false;
  }

  function handleDropTarget(aid) {
    setDropTargetAid(aid);
  }

  function handleDragEnd() {
    setDragSrcAid(null);
    setDropTargetAid(null);
  }

  function handleDrop(srcAid, tgtAid) {
    var curZones = plan.zones;
    var srcIdx = -1, dstIdx = -1;
    curZones.forEach(function (z, i) {
      if (z.aid === srcAid) srcIdx = i;
      if (z.aid === tgtAid) dstIdx = i;
    });
    if (srcIdx >= 0 && dstIdx >= 0) {
      var newZones = curZones.map(function (z) {
        return { aid: z.aid, x: z.x, z: z.z, w: z.w, d: z.d };
      });
      /* Swap positions */
      var srcPos = { x: newZones[srcIdx].x, z: newZones[srcIdx].z, w: newZones[srcIdx].w, d: newZones[srcIdx].d };
      var dstPos = { x: newZones[dstIdx].x, z: newZones[dstIdx].z, w: newZones[dstIdx].w, d: newZones[dstIdx].d };
      newZones[srcIdx] = { aid: newZones[srcIdx].aid, x: dstPos.x, z: dstPos.z, w: dstPos.w, d: dstPos.d };
      newZones[dstIdx] = { aid: newZones[dstIdx].aid, x: srcPos.x, z: srcPos.z, w: srcPos.w, d: srcPos.d };
      setCustomZones({ zones: newZones, parts: plan.parts });
    }
    setDragSrcAid(null);
    setDropTargetAid(null);
  }

  /* ── Resize start handler — store ALL zones' initial state ── */
  function handleResizeStart(aid, edge, event) {
    event.stopPropagation();
    if (controlsRef.current) controlsRef.current.enabled = false;
    var allZones = plan.zones.map(function (z) { return { aid: z.aid, x: z.x, z: z.z, w: z.w, d: z.d }; });
    dragRef.current = { aid: aid, edge: edge, allInitial: allZones };
  }

  /* ── Resize handler — move shared edge, neighbors auto-fill/shrink ── */
  var handleResize = useCallback(function (aid, edge, cursorX, cursorZ, _unused) {
    /* Use allInitial from dragRef for stable reference */
    if (!dragRef.current || !dragRef.current.allInitial) return;
    var allInitial = dragRef.current.allInitial;
    var HW = FLOOR_W / 2, HD = FLOOR_D / 2;
    var MIN = 1.0;
    var tol = 0.15;

    var src = null;
    allInitial.forEach(function (z) { if (z.aid === aid) src = z; });
    if (!src) return;

    /* Compute where the dragged edge wants to move to (snapped) */
    var edgePos;
    if (edge === "right") {
      edgePos = Math.min(HW, Math.max(cursorX, src.x + MIN));
    } else if (edge === "left") {
      edgePos = Math.max(-HW, Math.min(cursorX, src.x + src.w - MIN));
    } else if (edge === "front") {
      edgePos = Math.min(HD, Math.max(cursorZ, src.z + MIN));
    } else { /* back */
      edgePos = Math.max(-HD, Math.min(cursorZ, src.z + src.d - MIN));
    }

    /* Build new zones: dragged zone resizes, neighbors that share this edge adjust */
    var newZones = allInitial.map(function (z) {
      var n = { aid: z.aid, x: z.x, z: z.z, w: z.w, d: z.d };

      if (z.aid === aid) {
        /* This is the dragged zone */
        if (edge === "right") { n.w = edgePos - z.x; }
        else if (edge === "left") { n.x = edgePos; n.w = z.x + z.w - edgePos; }
        else if (edge === "front") { n.d = edgePos - z.z; }
        else { n.z = edgePos; n.d = z.z + z.d - edgePos; }
      } else {
        /* Check if this neighbor shares the dragged edge */
        var srcRight = src.x + src.w, srcBottom = src.z + src.d;
        var zRight = z.x + z.w, zBottom = z.z + z.d;

        if (edge === "right" || edge === "left") {
          /* Vertical edge being moved — check z-overlap for adjacency */
          var overlapZ = Math.min(srcBottom, zBottom) - Math.max(src.z, z.z);
          if (overlapZ > tol) {
            if (edge === "right" && Math.abs(z.x - srcRight) < tol) {
              /* Neighbor's left edge touches src's right edge */
              var newLeft = edgePos;
              if (zRight - newLeft >= MIN) { n.x = newLeft; n.w = zRight - newLeft; }
            } else if (edge === "left" && Math.abs(zRight - src.x) < tol) {
              /* Neighbor's right edge touches src's left edge */
              var newRight = edgePos;
              if (newRight - z.x >= MIN) { n.w = newRight - z.x; }
            }
          }
        } else {
          /* Horizontal edge being moved — check x-overlap for adjacency */
          var overlapX = Math.min(srcRight, zRight) - Math.max(src.x, z.x);
          if (overlapX > tol) {
            if (edge === "front" && Math.abs(z.z - srcBottom) < tol) {
              /* Neighbor's back edge touches src's front edge */
              var newBack = edgePos;
              if (zBottom - newBack >= MIN) { n.z = newBack; n.d = zBottom - newBack; }
            } else if (edge === "back" && Math.abs(zBottom - src.z) < tol) {
              /* Neighbor's front edge touches src's back edge */
              var newFront = edgePos;
              if (newFront - z.z >= MIN) { n.d = newFront - z.z; }
            }
          }
        }
      }

      /* Enforce minimum size */
      if (n.w < MIN) n.w = MIN;
      if (n.d < MIN) n.d = MIN;
      return n;
    });

    var newParts = computePartitions(newZones);
    setCustomZones({ zones: newZones, parts: newParts });
  }, []);

  /* Hover data for tooltip */
  var hovData = !editMode && hovArea && areaMap[hovArea] ? (function () {
    var a = areaMap[hovArea];
    var ar2 = areaRdFn(a);
    var ast = areaStaffFn(a);
    var ask = areaSkillRdFn(a);
    var act = areaCertRdFn(a);
    var rq = 0, fl = 0;
    (a.roles || []).forEach(function (r) { rq += r.rq; fl += r.ql; });
    var gp = rq - fl;
    var sk = a.skillReqs || [];
    var ct = a.certReqs || [];
    var mets = [{ l: "Staff", v: ast }];
    if (sk.length > 0) mets.push({ l: "Skills", v: ask });
    if (ct.length > 0) mets.push({ l: "Certs", v: act });
    return { area: a, rd: ar2, st: ast, rq: rq, fl: fl, gp: gp, mets: mets, stClr: statusClrFn(ar2) };
  })() : null;

  /* Camera */
  var camDist = 10;
  var isoAngle = Math.PI / 5.5;
  var isoRot = Math.PI / 4;
  var camX = camDist * Math.cos(isoAngle) * Math.sin(isoRot);
  var camY = camDist * Math.sin(isoAngle);
  var camZ = camDist * Math.cos(isoAngle) * Math.cos(isoRot);

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid " + T.bd }}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", background: T.sa, borderBottom: "1px solid " + T.bd }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: T.td }}>FLOOR PLAN</span>
          <span style={{ fontSize: 9, fontFamily: "monospace", color: tint, fontWeight: 600 }}>{layoutLabel}</span>
          {editMode && (
            <span style={{ fontSize: 8, fontFamily: "monospace", color: isDark ? "#73A6FF" : "#73A6FF", fontWeight: 600, letterSpacing: 1 }}>EDITING</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {editMode ? (
            <span style={{ fontSize: 8, fontFamily: "monospace", color: T.td }}>Drag areas to reorder {String.fromCharCode(183)} Drag edges to resize</span>
          ) : (
            <span style={{ fontSize: 8, fontFamily: "monospace", color: T.td }}>Drag to rotate {String.fromCharCode(183)} Scroll to zoom</span>
          )}
          {editMode && customZones && (
            <button
              onClick={function () { setCustomZones(null); setDragSrcAid(null); setDropTargetAid(null); }}
              style={{
                fontSize: 8, fontFamily: "monospace", letterSpacing: 1, color: T.td,
                background: "transparent", border: "1px solid " + T.bd, borderRadius: 4,
                padding: "2px 8px", cursor: "pointer"
              }}
            >RESET</button>
          )}
          <button
            onClick={function () { setEditMode(function (p) { return !p; }); setDragSrcAid(null); setDropTargetAid(null); dragState.current = null; }}
            style={{
              fontSize: 8, fontFamily: "monospace", letterSpacing: 1,
              color: editMode ? T.bg : tint,
              background: editMode ? tint : "transparent",
              border: "1px solid " + (editMode ? tint : T.bd),
              borderRadius: 4, padding: "2px 10px", cursor: "pointer", fontWeight: 600
            }}
          >{editMode ? "DONE" : "EDIT LAYOUT"}</button>
        </div>
      </div>

      {/* Three.js Canvas */}
      <div style={{ height: 460, background: T.bg }}>
        <Canvas
          camera={{ position: [camX, camY, camZ], fov: 32, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <SceneBg bg={T.bg} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={0.15} />

          <FloorModel
            plan={plan}
            T={T}
            tint={tint}
            isDark={isDark}
            areaMap={areaMap}
            templateMap={templateMap}
            activeArea={activeArea}
            hovArea={hovArea}
            onSelect={handleZoneClick}
            onHover={onHoverArea}
            areaRdFn={areaRdFn}
            editMode={editMode}
            dragSrcAid={dragSrcAid}
            dropTargetAid={dropTargetAid}
            onResizeStart={handleResizeStart}
            onDragInit={handleDragInit}
          />

          {/* Drag ghost — floating outline following cursor during reorder */}
          {editMode && <DragGhost tint={tint} om={isDark ? 1 : 1.6} dragState={dragState} />}

          {/* Drag-and-drop reorder logic */}
          {editMode && (
            <DragDropHelper
              controlsRef={controlsRef}
              dragState={dragState}
              zones={plan.zones}
              onDrop={handleDrop}
              onDropTarget={handleDropTarget}
              onDragEnd={handleDragEnd}
            />
          )}

          {/* Resize drag logic */}
          {editMode && (
            <ResizeDragger
              controlsRef={controlsRef}
              dragRef={dragRef}
              onResize={handleResize}
            />
          )}

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 8}
            maxDistance={18}
            minDistance={5}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      </div>

      {/* Hover tooltip — only in normal mode */}
      {hovData && (
        <div style={{
          position: "absolute", left: "50%", bottom: 16,
          transform: "translateX(-50%)",
          background: T.bg + "E8", border: "1px solid " + tint + "25",
          borderRadius: 10, padding: "12px 16px",
          boxShadow: "0 4px 24px " + T.sh,
          pointerEvents: "none", zIndex: 10, minWidth: 190, maxWidth: 260,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: tint, opacity: 0.6 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.tx, flex: 1 }}>{hovData.area.anm}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: hovData.stClr, fontFamily: "monospace" }}>{hovData.rd}%</span>
          </div>
          {hovData.mets.map(function (m) {
            var mClr = statusClrFn(m.v);
            return (
              <div key={m.l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 8, fontFamily: "monospace", color: T.tm, width: 32, flexShrink: 0, textTransform: "uppercase" }}>{m.l}</span>
                <div style={{ flex: 1, height: 3, borderRadius: 1.5, background: tint + "15", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: m.v + "%", borderRadius: 1.5, background: tint + "60" }} />
                </div>
                <span style={{ fontSize: 8, fontFamily: "monospace", color: mClr, fontWeight: 600, minWidth: 24, textAlign: "right" }}>{m.v}%</span>
              </div>
            );
          })}
          <div style={{ fontSize: 9, color: T.tm, fontFamily: "monospace", marginTop: 6, display: "flex", gap: 8 }}>
            <span>{hovData.fl}/{hovData.rq} staff</span>
            {hovData.gp > 0 && <span style={{ color: T.rd, fontWeight: 600 }}>{String.fromCharCode(8722)}{hovData.gp} gap{hovData.gp !== 1 ? "s" : ""}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
