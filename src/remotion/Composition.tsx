import { useLoader } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TextureLoader } from "three";
import { z } from "zod";

export const myCompSchema = z.object({
  imageUrl: z.string(),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
  imageUrl,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Render https://cdn.discordapp.com/attachments/1120455140416172115/1186194938816376942/Screenshot_2023-12-18_at_12.35.09_AM.png
  const texture = useLoader(TextureLoader, imageUrl);

  return (
    <ThreeCanvas
      orthographic={false}
      width={width}
      height={height}
      style={{
        backgroundColor: "transparent",
      }}
      camera={{ fov: 75, position: [0, 0, 470] }}
    >
      <ambientLight intensity={0.15} />
      <mesh
        position={[0, 0, 350 - (frame - 60) * 0.36]}
        rotation={[(frame - 30) * -0.06 * 0.04, (frame - 30) * -0.06 * 0.04, 0]}
      >
        <boxGeometry args={[100, 100, 100]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
    </ThreeCanvas>
  );
};
