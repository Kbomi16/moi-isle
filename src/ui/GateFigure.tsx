import { useEffect, useRef } from 'react'
import {
  AmbientLight,
  AnimationMixer,
  Box3,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

type GateFigureProps = {
  url: string
}

export function GateFigure({ url }: GateFigureProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) {
      return
    }

    const width = mount.clientWidth || 200
    const height = mount.clientHeight || 200
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0xdff3c8, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height, false)
    mount.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(32, width / height, 0.01, 100)
    scene.add(new AmbientLight(0xffffff, 0.9))
    const sun = new DirectionalLight(0xffffff, 1.3)
    sun.position.set(2.2, 3.4, 2)
    scene.add(sun)

    let mixer: AnimationMixer | null = null
    let alive = true
    const loader = new GLTFLoader()
    loader.load(url, (gltf) => {
      if (!alive) {
        return
      }
      const model = clone(gltf.scene)
      model.rotation.y = 0.55
      model.scale.setScalar(4)
      scene.add(model)

      model.updateMatrixWorld(true)
      const box = new Box3()
      model.traverse((node) => {
        if (!(node instanceof Mesh)) {
          return
        }
        node.geometry.computeBoundingBox()
        const bounds = node.geometry.boundingBox
        if (!bounds) {
          return
        }
        box.union(bounds.clone().applyMatrix4(node.matrixWorld))
      })
      const size = box.getSize(new Vector3())
      const center = box.getCenter(new Vector3())
      const maxDim = Math.max(size.y, 0.01)
      const frameMargin = 2.15
      const dist =
        (maxDim * frameMargin) / (2 * Math.tan((camera.fov * Math.PI) / 360))
      camera.position.set(center.x + dist * 0.25, center.y, center.z + dist)
      camera.near = Math.max(dist / 80, 0.01)
      camera.far = dist * 12
      camera.lookAt(center)
      camera.updateProjectionMatrix()

      const clip =
        gltf.animations.find((entry) => entry.name === 'idle') ??
        gltf.animations[0]
      if (clip) {
        mixer = new AnimationMixer(model)
        mixer.clipAction(clip).play()
      }
    })

    let frame = 0
    let then = performance.now()
    const loop = (now: number) => {
      mixer?.update((now - then) / 1000)
      then = now
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)

    return () => {
      alive = false
      window.cancelAnimationFrame(frame)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [url])

  return (
    <div
      aria-hidden="true"
      className="size-[12.5rem] overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_78%,#c6e7a4_0_34%,transparent_35%),#e7f6d4] shadow-[0_1.1rem_0_-0.55rem_#6a9a62] max-[720px]:size-[9.5rem] [&_canvas]:block [&_canvas]:size-full"
      ref={mountRef}
    />
  )
}
