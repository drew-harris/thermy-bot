import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        defaultProps={{
          imageUrl:
            "https://cdn.discordapp.com/attachments/1120455140416172115/1186194938816376942/Screenshot_2023-12-18_at_12.35.09_AM.png",
        }}
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
