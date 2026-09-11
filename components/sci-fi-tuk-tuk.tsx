'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type ColorTheme = {
  name: string
  body: number
  accent: number
  neon: number
  seatMain: number
  seatTrim: number
}

const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Bangkok Royal Blue',
    body: 0x114b99,
    accent: 0xf3bf53,
    neon: 0x4df2e8,
    seatMain: 0x1a2e4c,
    seatTrim: 0xd99a26,
  },
  {
    name: 'Cyberpunk Neon Pink',
    body: 0x1b1c24,
    accent: 0xff2a75,
    neon: 0xff2a75,
    seatMain: 0x121318,
    seatTrim: 0xff3b8b,
  },
  {
    name: 'Siam Imperial Gold',
    body: 0xd49b28,
    accent: 0x961a22,
    neon: 0xffd269,
    seatMain: 0x471114,
    seatTrim: 0xf5cf6b,
  },
  {
    name: 'Emerald Jade',
    body: 0x0e5e54,
    accent: 0xe5c158,
    neon: 0x3af5be,
    seatMain: 0x092622,
    seatTrim: 0xe5c158,
  },
]


type Point = [number, number, number]
type ViewerState = { exploded: boolean; driving: boolean; headlightsOn: boolean }
type Section = [x: number, centerY: number, halfHeight: number, halfWidth: number]

function roundedBox(width: number, height: number, depth: number, radius = 0.08) {
  const r = Math.min(radius, width / 2, height / 2, depth / 2)
  const geometry = new THREE.BoxGeometry(width, height, depth, 6, 6, 6)
  const positions = geometry.attributes.position
  const inner = new THREE.Vector3(width / 2 - r, height / 2 - r, depth / 2 - r)
  const point = new THREE.Vector3()
  const clamped = new THREE.Vector3()
  for (let i = 0; i < positions.count; i++) {
    point.fromBufferAttribute(positions, i)
    clamped.copy(point).clamp(inner.clone().negate(), inner)
    point.sub(clamped).normalize().multiplyScalar(r).add(clamped)
    positions.setXYZ(i, point.x, point.y, point.z)
  }
  geometry.computeVertexNormals()
  return geometry
}

// Cross-sections define the body silhouette instead of stacked primitive boxes.
function coachwork(sections: Section[], exponent = 0.65) {
  const centers = new THREE.CatmullRomCurve3(sections.map(s => new THREE.Vector3(s[0], s[1], s[2])))
  const widths = new THREE.CatmullRomCurve3(sections.map(s => new THREE.Vector3(s[0], s[3], 0)))
  sections = Array.from({ length: 57 }, (_, i) => {
    const center = centers.getPoint(i / 56)
    const width = widths.getPoint(i / 56)
    return [center.x, center.y, Math.max(0.006, center.z), Math.max(0.006, width.y)] as Section
  })
  const vertices: number[] = []
  const indices: number[] = []
  const segments = 48
  for (const [x, center, height, width] of sections) {
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2
      const sine = Math.sin(angle)
      const cosine = Math.cos(angle)
      vertices.push(x, center + Math.sign(sine) * Math.pow(Math.abs(sine), exponent) * height,
        Math.sign(cosine) * Math.pow(Math.abs(cosine), exponent) * width)
    }
  }
  for (let i = 0; i < sections.length - 1; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j
      const b = a + segments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  // Close both ends with opposite winding.
  for (const end of [0, sections.length - 1]) {
    const center = vertices.length / 3
    vertices.push(sections[end][0], sections[end][1], 0)
    for (let j = 0; j < segments; j++) {
      const a = end * (segments + 1) + j
      if (end === 0) indices.push(center, a, a + 1)
      else indices.push(center, a + 1, a)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function createTukTuk(theme: ColorTheme) {
  const vehicle = new THREE.Group()
  const shell = new THREE.Group()
  const cabin = new THREE.Group()
  const canopy = new THREE.Group()
  const chassis = new THREE.Group()
  const steering = new THREE.Group()
  const rear = new THREE.Group()
  vehicle.add(chassis, shell, cabin, canopy, steering, rear)

  const paint = new THREE.MeshPhysicalMaterial({
    color: theme.body, metalness: 0.48, roughness: 0.25,
    clearcoat: 1, clearcoatRoughness: 0.18,
  })
  const pearl = new THREE.MeshPhysicalMaterial({
    color: 0xe5e1d5, metalness: 0.25, roughness: 0.28, clearcoat: 0.9,
  })
  const gold = new THREE.MeshStandardMaterial({ color: theme.accent, metalness: 0.82, roughness: 0.29 })
  const chrome = new THREE.MeshStandardMaterial({ color: 0xa8bdc3, metalness: 0.92, roughness: 0.23 })
  const graphite = new THREE.MeshStandardMaterial({ color: 0x17292f, metalness: 0.5, roughness: 0.36 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x171c20, metalness: 0, roughness: 0.83 })
  const leather = new THREE.MeshStandardMaterial({ color: 0xbe8b59, roughness: 0.74 })
  const piping = new THREE.MeshStandardMaterial({ color: 0xefce98, roughness: 0.64 })
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x99cad3, metalness: 0, roughness: 0.08,
    transparent: true, opacity: 0.26, side: THREE.DoubleSide, depthWrite: false,
  })
  const led = new THREE.MeshStandardMaterial({
    color: 0xd7ffff, emissive: theme.neon, emissiveIntensity: 2, toneMapped: false,
  })
  const beamMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff7df, emissive: 0xffedc9, emissiveIntensity: 2.6, toneMapped: false,
  })
  const red = new THREE.MeshStandardMaterial({ color: 0xff634f, emissive: 0xd51d0a, emissiveIntensity: 1.5 })
  function mesh(group: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, at: Point) {
    const item = new THREE.Mesh(geometry, material)
    item.position.set(...at)
    item.castShadow = material !== glass && material !== led && material !== beamMaterial
    item.receiveShadow = material !== glass
    group.add(item)
    return item
  }
  function box(group: THREE.Group, size: Point, at: Point, material: THREE.Material, radius = 0.05) {
    return mesh(group, roundedBox(...size, radius), material, at)
  }
  function tube(group: THREE.Group, points: Point[], radius: number, material: THREE.Material) {
    return mesh(group, new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))),
      Math.max(16, points.length * 10), radius, 8, false,
    ), material, [0, 0, 0])
  }

  // Low, continuous passenger tub with a compact three-wheel stance.
  box(chassis, [3.35, 0.17, 1.45], [0.05, 0.48, 0], graphite, 0.075)
  box(chassis, [2.45, 0.08, 1.65], [0.48, 0.6, 0], graphite, 0.035)
  mesh(shell, coachwork([
    [0.7, 0.76, 0.11, 0.72], [1.1, 0.76, 0.15, 0.82],
    [1.48, 0.78, 0.15, 0.83], [1.72, 0.8, 0.13, 0.74],
    [1.81, 0.8, 0.08, 0.59],
  ]), paint, [0, 0, 0])
  box(shell, [0.14, 0.64, 1.48], [1.65, 1.18, 0], paint, 0.065)

  // One smoothly lofted apron. Front faces -X.
  mesh(shell, coachwork([
    [-2.02, 0.99, 0.18, 0.3], [-1.96, 1.03, 0.28, 0.46],
    [-1.8, 1.08, 0.37, 0.62], [-1.54, 1.12, 0.39, 0.68],
    [-1.28, 1.1, 0.34, 0.64], [-1.14, 1.04, 0.24, 0.57],
  ], 0.78), paint, [0, 0, 0])
  mesh(shell, coachwork([
    [-1.48, 0.83, 0.2, 0.53], [-1.27, 0.84, 0.26, 0.57],
    [-1.08, 0.82, 0.23, 0.53], [-0.98, 0.72, 0.11, 0.48],
  ]), paint, [0, 0, 0])

  // Signature horizontal apron trim and a large classic central headlamp.
  for (const side of [-1, 1]) {
    tube(shell, [[-2.04, 1.04, side * 0.19], [-1.96, 1.05, side * 0.49],
      [-1.68, 1.08, side * 0.695], [-1.25, 1.09, side * 0.665]], 0.017, gold)
    tube(shell, [[-1.99, 1.2, side * 0.25], [-1.92, 1.23, side * 0.45],
      [-1.72, 1.27, side * 0.63]], 0.013, led)
    tube(shell, [[-2.08, 0.71, side * 0.18], [-2.04, 0.68, side * 0.51],
      [-1.65, 0.67, side * 0.73]], 0.045, chrome)
  }
  const headHousing = mesh(shell, new THREE.CylinderGeometry(0.215, 0.185, 0.18, 48), graphite, [-2.035, 1.24, 0])
  headHousing.rotation.z = Math.PI / 2
  const headRing = mesh(shell, new THREE.TorusGeometry(0.185, 0.023, 12, 48), gold, [-2.132, 1.24, 0])
  headRing.rotation.y = Math.PI / 2
  const lens = mesh(shell, new THREE.CircleGeometry(0.161, 48), beamMaterial, [-2.139, 1.24, 0])
  lens.rotation.y = -Math.PI / 2
  const beam = new THREE.SpotLight(0xffefd6, 12, 12, 0.48, 0.7, 2)
  beam.position.set(-2.16, 1.24, 0)
  beam.target.position.set(-7, 0.15, 0)
  shell.add(beam, beam.target)
  for (const z of [-0.41, 0.41]) {
    const indicator = box(shell, [0.028, 0.05, 0.13], [-1.976, 0.94, z], gold, 0.014)
    indicator.rotation.y = z > 0 ? 0.5 : -0.5
  }

  // Open side entry, sweeping waist rail and integrated running boards.
  for (const side of [-1, 1]) {
    mesh(shell, coachwork([
      [-0.7, 0.69, 0.07, 0.04], [-0.48, 0.72, 0.1, 0.065],
      [0.45, 0.74, 0.12, 0.065], [1.2, 0.81, 0.18, 0.07],
    ]), paint, [0, 0, side * 0.8])
    box(chassis, [1.27, 0.08, 0.25], [0.05, 0.44, side * 0.9], chrome, 0.035)
    tube(chassis, [[-0.55, 0.47, side * 1.01], [0.54, 0.47, side * 1.01]], 0.014, led)
    tube(cabin, [[-0.46, 0.75, side * 0.8], [-0.48, 1.1, side * 0.83],
      [-0.26, 1.16, side * 0.85], [0.65, 1.16, side * 0.85],
      [1.4, 1.38, side * 0.81]], 0.027, chrome)
  }

  // Swept windscreen, hollow frame and uninterrupted view through the cabin.
  const glassShape = new THREE.Shape()
  glassShape.moveTo(-0.59, 0)
  glassShape.lineTo(0.59, 0)
  glassShape.quadraticCurveTo(0.67, 0.02, 0.64, 0.14)
  glassShape.lineTo(0.57, 0.83)
  glassShape.quadraticCurveTo(0.55, 0.91, 0.46, 0.92)
  glassShape.lineTo(-0.46, 0.92)
  glassShape.quadraticCurveTo(-0.55, 0.91, -0.57, 0.83)
  glassShape.lineTo(-0.64, 0.14)
  glassShape.quadraticCurveTo(-0.67, 0.02, -0.59, 0)
  const windshield = mesh(cabin, new THREE.ShapeGeometry(glassShape, 24), glass, [-1.26, 1.4, 0])
  windshield.rotation.y = -Math.PI / 2
  windshield.rotation.z = -0.2
  for (const side of [-1, 1]) {
    tube(cabin, [[-1.27, 1.37, side * 0.64], [-1.19, 1.86, side * 0.64],
      [-1.02, 2.31, side * 0.57]], 0.038, graphite)
    tube(cabin, [[1.57, 0.89, side * 0.76], [1.56, 1.69, side * 0.81],
      [1.46, 2.35, side * 0.79]], 0.04, chrome)
    tube(cabin, [[-1.02, 2.31, side * 0.57], [-0.1, 2.4, side * 0.77],
      [1.46, 2.35, side * 0.79]], 0.026, chrome)
  }
  tube(cabin, [[-1.27, 1.4, -0.64], [-1.29, 1.38, 0], [-1.27, 1.4, 0.64]], 0.036, graphite)
  tube(cabin, [[-1.02, 2.31, -0.57], [-1.04, 2.36, 0], [-1.02, 2.31, 0.57]], 0.03, chrome)

  // A thin aero canopy with curved leading/trailing edges and contrasting underside.
  const roofSections: Section[] = [
    [-1.4, 2.39, 0.025, 0.59], [-1.3, 2.44, 0.055, 0.8],
    [-0.98, 2.5, 0.075, 0.88], [-0.3, 2.54, 0.075, 0.91],
    [0.65, 2.53, 0.07, 0.94], [1.45, 2.46, 0.07, 0.93],
    [1.78, 2.36, 0.045, 0.85], [1.85, 2.31, 0.02, 0.7],
  ]
  mesh(canopy, coachwork(roofSections, 0.48), pearl, [0, 0, 0])
  for (const side of [-1, 1]) {
    tube(canopy, roofSections.slice(1, -1).map(([x,y,,w]) => [x, y - 0.025, side * w] as Point), 0.025, gold)
    tube(canopy, [[-0.92, 2.455, side * 0.82], [0.2, 2.48, side * 0.87],
      [1.48, 2.39, side * 0.87]], 0.012, led)
  }
  box(canopy, [0.25, 0.09, 0.57], [-0.86, 2.6, 0], graphite, 0.04)
  box(canopy, [0.013, 0.035, 0.39], [-0.993, 2.615, 0], led, 0.008)

  // Properly radiused upholstery changes the interior silhouette.
  box(cabin, [0.53, 0.17, 0.57], [-0.55, 0.98, 0], leather, 0.08)
  const driverBack = box(cabin, [0.15, 0.52, 0.56], [-0.29, 1.27, 0], leather, 0.07)
  driverBack.rotation.z = -0.12
  box(cabin, [0.68, 0.22, 1.42], [1.03, 1.02, 0], leather, 0.1)
  const back = box(cabin, [0.19, 0.66, 1.42], [1.45, 1.38, 0], leather, 0.09)
  back.rotation.z = -0.12
  for (let z = -0.58; z <= 0.6; z += 0.145) {
    tube(cabin, [[0.77, 1.135, z], [1.06, 1.14, z], [1.27, 1.12, z]], 0.006, piping)
    tube(cabin, [[1.341, 1.17, z], [1.351, 1.43, z], [1.367, 1.62, z]], 0.005, piping)
  }
  box(cabin, [0.24, 0.12, 0.85], [-1.05, 1.43, 0], graphite, 0.055)
  box(cabin, [0.17, 0.012, 0.24], [-1.03, 1.5, 0], led, 0.006)

  // Wheel assemblies use rounded tire cross-sections and open alloy rims.
  const wheelSpinners: THREE.Group[] = []
  function wheel(parent: THREE.Group, position: Point) {
    const assembly = new THREE.Group()
    assembly.position.set(...position)
    parent.add(assembly)
    const spinner = new THREE.Group()
    assembly.add(spinner)
    wheelSpinners.push(spinner)
    const tire = mesh(spinner, new THREE.TorusGeometry(0.343, 0.106, 16, 64), rubber, [0, 0, 0])
    tire.scale.z = 1.3
    for (const side of [-1, 1]) {
      const faceZ = side * 0.115
      mesh(spinner, new THREE.TorusGeometry(0.27, 0.021, 10, 48), chrome, [0, 0, faceZ])
      mesh(spinner, new THREE.TorusGeometry(0.315, 0.006, 6, 48), rubber, [0, 0, side * 0.135])
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4
        const spoke = box(spinner, [0.22, 0.032, 0.025],
          [Math.cos(a) * 0.15, Math.sin(a) * 0.15, faceZ], i % 2 ? chrome : gold, 0.01)
        spoke.rotation.z = a + 0.12
      }
      const hub = mesh(spinner, new THREE.CylinderGeometry(0.075, 0.075, 0.03, 24), graphite, [0,0,faceZ])
      hub.rotation.x = Math.PI / 2
    }
    return assembly
  }
  steering.position.set(-1.64, 0, 0)
  wheel(steering, [0, 0.45, 0])
  for (const z of [-0.17, 0.17]) {
    tube(steering, [[0, 0.45, z], [0.12, 0.83, z], [0.24, 1.18, z]], 0.032, chrome)
  }
  tube(steering, [[0.27, 1.44, -0.42], [0.31, 1.54, -0.26],
    [0.3, 1.54, 0.26], [0.27, 1.44, 0.42]], 0.025, chrome)
  for (const side of [-1,1]) {
    box(steering, [0.08, 0.055, 0.19], [0.27, 1.44, side * 0.41], rubber, 0.025)
    tube(cabin, [[-1.17,1.57,side * 0.62],[-1.2,1.78,side * 0.85]], 0.014, chrome)
    const mirror = mesh(cabin, new THREE.SphereGeometry(1,24,12), chrome, [-1.2,1.81,side * 0.89])
    mirror.scale.set(0.036, 0.084, 0.12)
  }
  const rearLeft = wheel(rear, [1.2, 0.45, -0.92])
  const rearRight = wheel(rear, [1.2, 0.45, 0.92])
  for (const [parent,x,z,width] of [
    [steering,0,0,0.19], [shell,1.2,-0.92,0.2], [shell,1.2,0.92,0.2],
  ] as [THREE.Group,number,number,number][]) {
    const fender = mesh(parent, new THREE.TorusGeometry(0.485, 0.063, 12, 48, Math.PI), paint, [x,0.45,z])
    fender.scale.z = width / 0.063
    const edge = mesh(parent, new THREE.TorusGeometry(0.492, 0.009, 6, 48, Math.PI), gold, [x,0.45,z + (z < 0 ? -width : width)])
    edge.castShadow = false
  }
  for (const side of [-1,1]) {
    box(shell,[0.025,0.26,0.055],[1.795,1.03,side * 0.53],red,0.018)
    tube(shell,[[1.83,0.66,side * 0.64],[1.92,0.67,side * 0.58],[1.94,0.69,0]],0.035,chrome)
  }
  const underlight = new THREE.PointLight(theme.neon, 1.7, 3, 2)
  underlight.position.set(0,0.3,0)
  chassis.add(underlight)
  return { vehicle, shell, cabin, canopy, chassis, steering, rear, rearLeft, rearRight, wheelSpinners, beam, beamMaterial }
}

/** Shared renderer used by the React component and the standalone inspection preview. */
export function createTukTukViewer(canvas: HTMLCanvasElement, theme: ColorTheme, getState: () => ViewerState) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x152328)
  scene.fog = new THREE.Fog(0x152328, 18, 48)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 70)

  // Large reflected studio cards supply readable highlights across curved paint.
  const studio = new THREE.Scene()
  studio.background = new THREE.Color(0x60727a)
  const cards: THREE.Mesh[] = []
  for (const [position, size, color, strength] of [
    [[-5,6,3],[5,5],0xffeed9,4],
    [[3,4,-5],[4,5],0xc9e7ff,3],
    [[0,7,0],[6,4],0xffffff,3],
  ] as [Point,[number,number],number,number][]) {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide })
    const card = new THREE.Mesh(new THREE.PlaneGeometry(...size),material)
    card.position.set(...position)
    card.lookAt(0,1,0)
    studio.add(card)
    cards.push(card)
  }
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(studio, 0.06)
  scene.environment = environment.texture
  for (const card of cards) { card.geometry.dispose(); (card.material as THREE.Material).dispose() }
  pmrem.dispose()

  scene.add(new THREE.HemisphereLight(0xd9edf0, 0x354047, 1.25))
  const key = new THREE.DirectionalLight(0xffeddb, 3.6)
  key.position.set(-3,7,5)
  key.castShadow = true
  key.shadow.mapSize.set(2048,2048)
  Object.assign(key.shadow.camera, { left:-5, right:5, top:5, bottom:-5, near:0.1, far:20 })
  key.shadow.normalBias = 0.025
  key.shadow.bias = -0.00015
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x9dcced, 2)
  fill.position.set(4,3,-4)
  scene.add(fill)

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120,120),
    new THREE.MeshStandardMaterial({color:0x192b31,roughness:0.88,metalness:0.05}))
  ground.rotation.x = -Math.PI/2
  ground.position.y = -0.135
  ground.receiveShadow = true
  scene.add(ground)
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.25,3.3,0.12,96),
    new THREE.MeshStandardMaterial({color:0x33454b,metalness:0.3,roughness:0.58}))
  plinth.position.y = -0.066
  plinth.receiveShadow = true
  scene.add(plinth)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.25,0.009,6,128),
    new THREE.MeshBasicMaterial({color:0x859b9f}))
  rim.rotation.x = Math.PI/2
  rim.position.y = -0.013
  scene.add(rim)

  const parts = createTukTuk(theme)
  scene.add(parts.vehicle)
  const state = { yaw:-0.95, pitch:0.22, distance:7.6 }
  let dragging = false
  let lastX = 0
  let lastY = 0
  let explode = 0
  let drive = 0
  let elapsed = 0
  let previousTime = 0
  let frame = 0
  let alive = true
  let visible = true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    const width = Math.max(canvas.clientWidth,1)
    const height = Math.max(canvas.clientHeight,1)
    renderer.setSize(width,height,false)
    camera.aspect = width/height
    camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true })
  intersection.observe(canvas)

  const pointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    dragging = true
    lastX = event.clientX; lastY = event.clientY
    canvas.setPointerCapture(event.pointerId)
    canvas.style.cursor = 'grabbing'
  }
  const pointerMove = (event: PointerEvent) => {
    if (!dragging) return
    state.yaw -= (event.clientX-lastX)*0.008
    state.pitch = THREE.MathUtils.clamp(state.pitch+(event.clientY-lastY)*0.006,0.08,0.85)
    lastX = event.clientX; lastY = event.clientY
  }
  const pointerUp = (event: PointerEvent) => {
    dragging = false
    if(canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    canvas.style.cursor = 'grab'
  }
  const wheel = (event: WheelEvent) => {
    event.preventDefault()
    state.distance = THREE.MathUtils.clamp(state.distance+event.deltaY*0.006,6.1,13)
  }
  const keyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') state.yaw -= 0.12
    else if (event.key === 'ArrowRight') state.yaw += 0.12
    else if (event.key === 'ArrowUp') state.pitch = Math.min(state.pitch+0.07,0.85)
    else if (event.key === 'ArrowDown') state.pitch = Math.max(state.pitch-0.07,0.08)
    else if (event.key === '+' || event.key === '=') state.distance = Math.max(6.1,state.distance-0.5)
    else if (event.key === '-') state.distance = Math.min(13,state.distance+0.5)
    else if (event.key === 'Home') Object.assign(state,{yaw:-0.95,pitch:0.22,distance:7.6})
    else return
    event.preventDefault()
  }
  canvas.addEventListener('pointerdown',pointerDown)
  canvas.addEventListener('pointermove',pointerMove)
  canvas.addEventListener('pointerup',pointerUp)
  canvas.addEventListener('pointercancel',pointerUp)
  canvas.addEventListener('wheel',wheel,{passive:false})
  canvas.addEventListener('keydown',keyDown)
  canvas.style.cursor='grab'

  const animate = (time: number) => {
    if (!alive) return
    frame=requestAnimationFrame(animate)
    const dt=Math.min(Math.max((time-previousTime)/1000,0),0.05)
    previousTime=time
    if(!visible || document.hidden) return
    const {exploded,driving,headlightsOn}=getState()
    const damping=1-Math.exp(-dt*6)
    explode=THREE.MathUtils.lerp(explode,exploded?1:0,reducedMotion?1:damping)
    drive=THREE.MathUtils.lerp(drive,driving&&!exploded?1:0,damping)
    elapsed+=dt
    // All modules rise above the platform when separated.
    parts.vehicle.position.y=explode*0.55
    parts.canopy.position.y=explode*0.85
    parts.cabin.position.y=explode*0.3
    parts.shell.position.set(0.1*explode,0.08*explode,0)
    parts.steering.position.x=-1.64-explode*0.5
    parts.rearLeft.position.z=-0.92-explode*0.45
    parts.rearRight.position.z=0.92+explode*0.45
    parts.beam.intensity=headlightsOn?12:0
    parts.beamMaterial.emissiveIntensity=headlightsOn?2.6:0
    // Studio rolling-road animation keeps the full silhouette in frame.
    if(!reducedMotion) {
      for(const spinner of parts.wheelSpinners) spinner.rotation.z+=dt*5*drive
      parts.steering.rotation.y=Math.sin(elapsed*0.9)*0.055*drive
      parts.vehicle.position.y+=Math.sin(elapsed*11)*0.006*drive
    }
    const distance=state.distance/Math.min(1,Math.max(camera.aspect,0.45))* (1+explode*0.14)
    const targetY=1.22+explode*0.4
    camera.position.set(Math.sin(state.yaw)*Math.cos(state.pitch)*distance,
      targetY+Math.sin(state.pitch)*distance,Math.cos(state.yaw)*Math.cos(state.pitch)*distance)
    camera.lookAt(0,targetY,0)
    renderer.render(scene,camera)
  }
  resize()
  frame=requestAnimationFrame(animate)
  return {
    reset: () => Object.assign(state,{yaw:-0.95,pitch:0.22,distance:7.6}),
    dispose: () => {
      alive=false
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      canvas.removeEventListener('pointerdown',pointerDown)
      canvas.removeEventListener('pointermove',pointerMove)
      canvas.removeEventListener('pointerup',pointerUp)
      canvas.removeEventListener('pointercancel',pointerUp)
      canvas.removeEventListener('wheel',wheel)
      canvas.removeEventListener('keydown',keyDown)
      const geometries=new Set<THREE.BufferGeometry>()
      const materials=new Set<THREE.Material>()
      scene.traverse(object=>{
        if(object instanceof THREE.Mesh) {
          geometries.add(object.geometry)
          for(const material of Array.isArray(object.material)?object.material:[object.material]) materials.add(material)
        }
      })
      for(const geometry of geometries) geometry.dispose()
      for(const material of materials) material.dispose()
      key.shadow.dispose()
      environment.dispose()
      renderer.dispose()
    },
  }
}

export function SciFiTukTuk() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<ReturnType<typeof createTukTukViewer> | null>(null)
  const [exploded,setExploded] = useState(false)
  const [driving,setDriving] = useState(false)
  const [headlightsOn,setHeadlightsOn] = useState(true)
  const [themeIndex,setThemeIndex] = useState(0)
  const [error,setError] = useState(false)
  const values=useRef<ViewerState>({exploded,driving,headlightsOn})
  useEffect(()=> { values.current={exploded,driving,headlightsOn} },[exploded,driving,headlightsOn])
  useEffect(()=>{
    if(!canvasRef.current) return
    setError(false)
    try {
      viewerRef.current=createTukTukViewer(canvasRef.current,COLOR_THEMES[themeIndex],()=>values.current)
    } catch {
      setError(true)
      return
    }
    return ()=> { viewerRef.current?.dispose(); viewerRef.current=null }
  },[themeIndex])

  const buttonStyle={border:'1px solid rgba(226,232,240,.22)',borderRadius:10,padding:'10px 14px',fontSize:12}
  return (
    <section id="tuk-tuk" className="border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-9 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Bangkok / Reimagined</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold md:text-6xl">An icon. A new silhouette.</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Thailand&apos;s three-wheeler, reimagined with flowing bodywork, a floating canopy and an open,
            warm leather cabin. Turn it around and discover a different side of Bangkok.
          </p>
        </div>
        <div style={{overflow:'hidden',borderRadius:24,border:'1px solid #405158',background:'#152328',color:'#edf1ec'}}>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-7" style={{borderBottom:'1px solid #34454a'}}>
            <div>
              <p style={{fontSize:13,fontWeight:600,letterSpacing:'.12em'}}>TUK-TUK / STUDIO EDITION</p>
              <p style={{fontSize:11,color:'#9daeb2',marginTop:4}}>Three wheels. Open cabin. Bangkok soul.</p>
            </div>
            <div className="flex items-center gap-3" role="group" aria-label="Body finish">
              {COLOR_THEMES.map((theme,index)=>(
                <button key={theme.name} type="button" onClick={()=>setThemeIndex(index)} aria-label={theme.name}
                  title={theme.name} aria-pressed={themeIndex===index}
                  style={{width:26,height:26,borderRadius:'50%',background:'#'+theme.body.toString(16).padStart(6,'0'),
                    border:themeIndex===index?'2px solid #f3dcad':'2px solid #75848a',outlineOffset:4}} />
              ))}
            </div>
          </div>
          <div className="relative h-[420px] md:h-[610px]">
            <canvas ref={canvasRef} tabIndex={0} className="h-full w-full touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
              aria-label="3D tuk-tuk. Drag or use arrow keys to rotate. Scroll or press plus and minus to zoom. Home resets the camera." />
            {error && <p role="alert" className="absolute inset-0 grid place-content-center p-8 text-center">The 3D view could not start. Enable WebGL and reload this page.</p>}
            <div className="pointer-events-none absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.2em]" style={{color:'#acb8b8'}}>Drag to rotate · Scroll to explore</div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-7" style={{borderTop:'1px solid #34454a',background:'#111e23'}}>
            <div className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={exploded} onClick={()=>{setExploded(!exploded);setDriving(false)}}
                style={{...buttonStyle,background:exploded?'#e3c48e':'transparent',color:exploded?'#17272d':'#e3d4b8'}}>{exploded?'Assemble':'Exploded view'}</button>
              <button type="button" aria-pressed={driving} onClick={()=>{setDriving(!driving);setExploded(false)}}
                style={{...buttonStyle,background:driving?'#aecbd0':'transparent',color:driving?'#17272d':'#bdced1'}}>{driving?'Park':'Drive'}</button>
              <button type="button" aria-pressed={headlightsOn} onClick={()=>setHeadlightsOn(!headlightsOn)}
                style={{...buttonStyle,background:'transparent',color:'#bdced1'}}>Lights {headlightsOn?'on':'off'}</button>
              <button type="button" onClick={()=>viewerRef.current?.reset()} style={{...buttonStyle,background:'transparent',color:'#bdced1'}}>Reset view</button>
            </div>
            <span style={{fontSize:11,color:'#a4b5b8'}}>{COLOR_THEMES[themeIndex].name}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
