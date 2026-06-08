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

const fragmentShader = `
  precision mediump float;
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

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl')
  if (!gl) return null

  const vert = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vert, vertexShader)
  gl.compileShader(vert)

  const frag = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(frag, fragmentShader)
  gl.compileShader(frag)

  const program = gl.createProgram()!
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
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

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const ctx = initGL(canvas)
    if (!ctx) return

    const { gl, uTime, uMouse } = ctx
    let rafId: number
    const start = performance.now()

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    const render = () => {
      const t = (performance.now() - start) / 1000

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

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none w-full h-full"
    />
  )
}
