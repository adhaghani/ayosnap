import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from "lucide-react";
import { Text } from "./ui/text";
export interface PhotoStriprProps {
  numofphotos: number;
  photos?: string[];
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  title?: string;
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
  numofphotos,
  layout,
}: {
  data?: PhotoStriprProps;
  numofphotos: number;
  layout?: string;
}) => {
  if (numofphotos === 0) return null;

  // Helper to render images or placeholders
  const renderImages = (count: number, aspect: number, grid: string) => {
    if (data?.photos) {
      return (
        <div className={grid}>
          {data?.title && (
            <div className="col-span-full text-center py-2">
              <Text as="h4" className="font-bold">
                <span style={{ color: data?.textColor || "#000000" }}>
                  {data.title}
                </span>
              </Text>
            </div>
          )}
          {data.photos.map((photo, index) => (
            <AspectRatio
              key={index}
              ratio={aspect}
              className="w-full h-full grid place-items-center overflow-hidden"
            >
              <img
                src={photo}
                alt={`Captured Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          ))}
        </div>
      );
    } else {
      return (
        <div className={grid}>
          {Array.from({ length: count }).map((_, idx) => (
            <AspectRatio
              key={idx}
              ratio={aspect}
              className="w-full h-full bg-secondary border grid place-items-center"
            >
              <Image />
            </AspectRatio>
          ))}
        </div>
      );
    }
  };

  // Layouts
  if (layout === "2x2" || (numofphotos === 4 && layout === "grid")) {
    return (
      <div
        className="p-4 flex flex-col flex-1 shadow-lg cursor-pointer"
        style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}
      >
        {renderImages(4, 1, "grid grid-cols-2 gap-2")}
        <div className="h-20 p-4 grid place-items-center">
          <Text as="h3">
            <span style={{ color: data?.textColor || "#000000" }}>
              AyoSnap!
            </span>
          </Text>
        </div>
      </div>
    );
  }
  if (layout === "1x4") {
    return (
      <div
        className="p-4 flex flex-col flex-1 shadow-lg cursor-pointer"
        style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}
      >
        {renderImages(4, 5 / 3, "flex flex-col gap-2")}
        <div className="h-20 p-4 grid place-items-center">
          <Text as="h3">
            <span style={{ color: data?.textColor || "#000000" }}>
              AyoSnap!
            </span>
          </Text>
        </div>
      </div>
    );
  }
  if (layout === "1x3") {
    return (
      <div
        className="p-4 flex flex-col flex-1 shadow-lg cursor-pointer"
        style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}
      >
        {renderImages(3, 5 / 3, "flex flex-col gap-2")}
        <div className="h-20 p-4 grid place-items-center">
          <Text as="h3">
            <span style={{ color: data?.textColor || "#000000" }}>
              AyoSnap!
            </span>
          </Text>
        </div>
      </div>
    );
  }
  if (layout === "1x2") {
    return (
      <div
        className="p-4 flex flex-col flex-1 shadow-lg cursor-pointer"
        style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}
      >
        {renderImages(2, 5 / 3, "flex flex-col gap-2")}
        <div className="h-20 p-4 grid place-items-center">
          <Text as="h3">
            <span style={{ color: data?.textColor || "#000000" }}>
              AyoSnap!
            </span>
          </Text>
        </div>
      </div>
    );
  }
  if (layout === "2x4") {
    return (
      <div
        className="p-4 flex flex-col flex-1 shadow-lg cursor-pointer"
        style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}
      >
        {renderImages(8, 5 / 3, "grid grid-cols-2 gap-2")}
        <div className="h-20 p-4 grid place-items-center">
          <Text as="h3">
            <span style={{ color: data?.textColor || "#000000" }}>
              AyoSnap!
            </span>
          </Text>
        </div>
      </div>
    );
  }
  if (layout === "2x3" || (numofphotos === 6 && !layout)) {
    return (
      <div
        className="p-4 flex flex-col flex-1 shadow-lg cursor-pointer"
        style={{ backgroundColor: data?.backgroundColor || "#ffffff" }}
      >
        {renderImages(6, 4 / 3, "grid grid-cols-2 gap-2")}
        <div className="h-20 p-4 grid place-items-center">
          <Text as="h3">
            <span style={{ color: data?.textColor || "#000000" }}>
              AyoSnap!
            </span>
          </Text>
        </div>
      </div>
    );
  }
  // fallback
  return null;
};

export default PhotoStrip;
