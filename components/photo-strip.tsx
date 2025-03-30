import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Divide, Image } from "lucide-react";
import { Text } from "./ui/text";
export interface PhotoStriprProps {
  numofphotos: number;
  photos?: string[];
  text?: string;
  sticker?: [
    {
      xpos: number;
      ypos: number;
      text: string;
      fontsize?: number;
      fontcolor?: string;
      fonttype?: string;
      fontweight?: string;
    }
  ];
}

const PhotoStrip = ({
  data,
  numofphotos
}: {
  data?: PhotoStriprProps;
  numofphotos: number;
}) => {
  if (numofphotos === 0) return null;
  if (numofphotos === 4)
    return (
      <div className=" p-4 flex justify-between flex-col  flex-1 dark:bg-white shadow-lg cursor-pointer">
        {data?.photos ? (
          <div className="flex flex-col gap-2">
            {data.photos.map((photo, index) => (
              <AspectRatio
                key={index}
                ratio={6 / 3}
                className=" w-full bg-secondary border grid place-items-center"
              >
                <img
                  className=""
                  src={photo}
                  alt={`Captured Image ${index + 1}`}
                />
              </AspectRatio>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {" "}
            <AspectRatio
              ratio={6 / 3}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={6 / 3}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={6 / 3}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={6 / 3}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
          </div>
        )}

        <div className=" h-20 p-4 text-black grid place-items-center">
          <Text as="h3">AyoSnap!</Text>
        </div>
      </div>
    );
  if (numofphotos === 6)
    return (
      <div className=" p-4 flex justify-between flex-col flex-1  dark:bg-white shadow-lg cursor-pointer">
        {data?.photos ? (
          <div className="grid grid-cols-2 gap-2">
            {data.photos.map((photo, index) => (
              <AspectRatio
                key={index}
                ratio={3 / 4}
                className=" w-full h-full  bg-secondary border grid place-items-center"
              >
                <img src={photo} alt={`Captured Image ${index + 1}`} />
              </AspectRatio>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <AspectRatio
              ratio={3 / 4}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={3 / 4}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={3 / 4}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={3 / 4}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={3 / 4}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
            <AspectRatio
              ratio={3 / 4}
              className=" w-full h-full  bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
          </div>
        )}

        <div className=" h-20 p-4 text-black grid place-items-center">
          <Text as="h3">AyoSnap!</Text>
        </div>
      </div>
    );
  return null;
};

export default PhotoStrip;
