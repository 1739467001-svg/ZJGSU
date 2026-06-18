import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        intensity={0.85}
        luminanceThreshold={0.32}
        luminanceSmoothing={0.22}
      />
      <Vignette offset={0.22} darkness={0.82} eskil={false} />
    </EffectComposer>
  )
}
