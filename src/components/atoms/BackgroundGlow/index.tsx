'use client'

import React, { useEffect, useRef } from 'react'

const vertexShader = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// highp is required: the fract(sin(...) * 43758.5) hash collapses into flat
// bands under mediump, which some drivers (notably Firefox on Linux/Mesa)
// honour literally as 16-bit float.
const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv * 1.2;
    vec2 movement = vec2(uTime * 0.05, uTime * 0.02);

    float distToMouse = distance(vUv, uMouse);
    float mouseEffect = smoothstep(0.2, 0.8, distToMouse) * 0.2;

    float n1 = fbm(uv + movement - mouseEffect);
    float n2 = fbm(uv * 1.4 - movement + n1);
    float intensity = fbm(uv + n2 * 3.5 + uTime * 0.1);

    vec3 colorVoid      = vec3(0.02, 0.02, 0.02);
    vec3 colorDeep      = vec3(0.03, 0.07, 0.07);
    vec3 colorPrimary   = vec3(0.04, 0.18, 0.17);
    vec3 colorHighlight = vec3(0.08, 0.28, 0.26);

    vec3 color = mix(colorVoid, colorDeep, smoothstep(0.0, 0.4, intensity));
    color = mix(color, colorPrimary, smoothstep(0.3, 0.7, intensity));
    color = mix(color, colorHighlight, smoothstep(0.6, 1.0, intensity));

    float vignette = 1.0 - length(vUv - 0.5) * 1.5;
    color *= clamp(vignette + 0.5, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

const contextAttributes: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  powerPreference: 'low-power',
  // Firefox refuses the context on some setups when this defaults to true
  failIfMajorPerformanceCaveat: false,
}

function getContext(canvas: HTMLCanvasElement) {
  return (canvas.getContext('webgl', contextAttributes) ||
    canvas.getContext('experimental-webgl', contextAttributes)) as WebGLRenderingContext | null
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[BackgroundGlow] shader compile failed:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = getContext(canvas)
  if (!gl) {
    console.warn('[BackgroundGlow] WebGL unavailable, falling back to static background')
    return null
  }

  const vert = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  if (!vert || !frag) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[BackgroundGlow] program link failed:', gl.getProgramInfoLog(program))
    return null
  }

  gl.useProgram(program)

  // Full-screen quad
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const posLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  const uTime = gl.getUniformLocation(program, 'uTime')
  const uMouse = gl.getUniformLocation(program, 'uMouse')

  return { gl, uTime, uMouse }
}

export const BackgroundGlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let rafId = 0
    let disposed = false

    const resize = () => {
      // Match the backing store to the device pixel ratio, otherwise the noise
      // reads as a blurry smear on HiDPI screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
    }

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }

    const start = () => {
      if (disposed) return

      resize()

      const ctx = initGL(canvas)
      if (!ctx) return

      const { gl, uTime, uMouse } = ctx
      const startedAt = performance.now()

      const render = () => {
        const t = (performance.now() - startedAt) / 1000

        // Lerp mouse
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05

        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform1f(uTime, t)
        gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        rafId = requestAnimationFrame(render)
      }
      render()
    }

    // Firefox drops the context more eagerly than Chromium (tab backgrounding,
    // GPU process restarts); without this the canvas stays frozen for good.
    const onContextLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(rafId)
    }
    const onContextRestored = () => start()

    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    start()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none block w-full h-full"
      style={{
        // Visible if WebGL never initialises, hidden behind the canvas otherwise.
        background: 'radial-gradient(circle at 50% 40%, #0a2422 0%, #050505 100%)',
      }}
    />
  )
}
