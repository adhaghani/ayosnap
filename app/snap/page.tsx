"use client";
import Webcam from "react-webcam";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text } from "@/components/ui/text";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Minus,
  Plus,
  Download,
  RotateCcw,
  Palette,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { PhotoStriprProps } from "@/components/photo-strip";
import PhotoStrip from "@/components/photo-strip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Snap Page
const page = () => {
  const [SnapDelay, setSnapDelay] = useState<number>(3);
  const [Countdown, setCountdown] = useState<number>(3);
  const [PhotoToCapture, setPhotoToCapture] = useState<number>(0);
  const [PhotoAspectRatio, setPhotoAspectRatio] = useState<number>(1.3333);
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [hasCaptureImage, sethasCaptureImage] = useState<boolean>(false);
  const [ImageData, setImageData] = useState<string[]>([]);
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true);
  const [PhotoStripData, setPhotoStripData] = useState<
    PhotoStriprProps | undefined
  >(undefined);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [stripBackgroundColor, setStripBackgroundColor] =
    useState<string>("#ffffff");
  const [stripTextColor, setStripTextColor] = useState<string>("#000000");
  const [stripTitle, setStripTitle] = useState<string>("");
  const [selectedLayout, setSelectedLayout] = useState<LayoutKey | "">("");

  // Layout configs with labels and descriptions
  const layoutConfigs = {
    "1x4": { num: 4, aspect: 5 / 3, label: "Layout A", desc: "4 Poses" },
    "1x3": { num: 3, aspect: 5 / 3, label: "Layout B", desc: "3 Poses" },
    "2x2": { num: 4, aspect: 1, label: "Layout C", desc: "2x2 Grid" },
    "2x4": { num: 8, aspect: 5 / 3, label: "Layout D", desc: "8 Poses" },
    "2x3": { num: 6, aspect: 4 / 3, label: "Layout E", desc: "6 Poses" },
    "1x2": { num: 2, aspect: 5 / 3, label: "Layout F", desc: "2 Poses" },
  } as const;
  type LayoutKey = keyof typeof layoutConfigs;

  const videoConstraints = {
    width: {
      min: 320,
      ideal: 1280,
      max: 2560,
    },
    height: {
      min: 240,
      ideal: 720,
      max: 1440,
    },
    facingMode: "user",
    aspectRatio: { PhotoAspectRatio },
    frameRate: { min: 15, ideal: 30, max: 60 },
  };

  const CheckCameraAvailability = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setIsCameraAvailable(true);
      })
      .catch(() => {
        setIsCameraAvailable(false);
      });
  }, []);

  useEffect(() => {
    CheckCameraAvailability();
  }, [CheckCameraAvailability]);

  const handleIncreaseSnapDelay = () => {
    if (SnapDelay < 10) {
      setSnapDelay(SnapDelay + 1);
    } else {
      toast.info("Snap delay cannot be more than 10 seconds");
    }
  };

  const handleReduceSnapDelay = () => {
    if (SnapDelay > 1) {
      setSnapDelay(SnapDelay - 1);
    } else {
      toast.info("Snap delay must be atleast 1 second");
    }
  };

  const capture = useCallback(() => {
    return new Promise<void>((resolve) => {
      let currentCountdown = SnapDelay;
      setCountdown(currentCountdown);

      const countdownInterval = setInterval(() => {
        currentCountdown -= 1;
        setCountdown(currentCountdown);

        if (currentCountdown <= 0) {
          clearInterval(countdownInterval);
          const imageSrc = webcamRef.current?.getScreenshot();
          if (imageSrc) {
            setImageData((prev) => [...prev, imageSrc]);
          }
          resolve();
        }
      }, 1000);
    });
  }, [webcamRef, SnapDelay]);

  useEffect(() => {
    if (ImageData.length === PhotoToCapture && PhotoToCapture > 0) {
      setPhotoStripData({
        numofphotos: PhotoToCapture,
        photos: ImageData,
        backgroundColor: stripBackgroundColor,
        textColor: stripTextColor,
        title: stripTitle,
      });
      sethasCaptureImage(true);
      toast.success(`Photo strip with ${PhotoToCapture} photos is ready!`);
    }
  }, [
    ImageData,
    PhotoToCapture,
    stripBackgroundColor,
    stripTextColor,
    stripTitle,
  ]);

  const handleSnap = async () => {
    setIsCapturing(true);
    setImageData([]);
    sethasCaptureImage(false);

    try {
      for (let i = 0; i < PhotoToCapture; i++) {
        await capture();
        if (i < PhotoToCapture - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } finally {
      setIsCapturing(false);
      setCountdown(SnapDelay);
    }
  };

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  const handleRetake = () => {
    setImageData([]);
    sethasCaptureImage(false);
    setIsCustomizing(false);
    setPhotoStripData(undefined);
  };

  const handleDownload = async () => {
    if (!PhotoStripData?.photos) {
      toast.error("No photos to download!");
      return;
    }

    try {
      // Create a canvas element to render the photo strip
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Set canvas dimensions based on photo strip layout
      const stripWidth = 400;
      const stripHeight = PhotoToCapture === 4 ? 1000 : 800;
      canvas.width = stripWidth;
      canvas.height = stripHeight;

      // Fill background
      ctx.fillStyle = stripBackgroundColor;
      ctx.fillRect(0, 0, stripWidth, stripHeight);

      // Calculate dimensions for photos and text areas
      const padding = 16;
      const textAreaHeight = 80;
      const titleAreaHeight = stripTitle ? 60 : 0;
      const availableHeight =
        stripHeight - textAreaHeight - titleAreaHeight - padding * 3;

      let currentY = padding;

      // Draw title if exists
      if (stripTitle) {
        ctx.fillStyle = stripTextColor;
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(stripTitle, stripWidth / 2, currentY + 35);
        currentY += titleAreaHeight;
      }

      // Load and draw photos
      const photoPromises = PhotoStripData.photos.map((photoSrc, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (PhotoToCapture === 4) {
              // Vertical layout for 4 photos
              const photoHeight = availableHeight / 4 - padding / 4;
              const photoWidth = stripWidth - padding * 2;
              const y = currentY + index * (photoHeight + padding / 4);

              ctx.drawImage(img, padding, y, photoWidth, photoHeight);
            } else {
              // Grid layout for 6 photos (2x3)
              const photoWidth = (stripWidth - padding * 3) / 2;
              const photoHeight = availableHeight / 3 - padding / 3;
              const col = index % 2;
              const row = Math.floor(index / 2);
              const x = padding + col * (photoWidth + padding);
              const y = currentY + row * (photoHeight + padding / 3);

              ctx.drawImage(img, x, y, photoWidth, photoHeight);
            }
            resolve();
          };
          img.src = photoSrc;
        });
      });

      // Wait for all photos to load and draw
      await Promise.all(photoPromises);

      // Draw footer text
      const footerY = stripHeight - textAreaHeight / 2;
      ctx.fillStyle = stripTextColor;
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("AyoSnap!", stripWidth / 2, footerY);

      // Create download link
      const link = document.createElement("a");
      link.download = `ayosnap-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success("Photo strip downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photo strip. Please try again.");
    }
  };

  const updateCustomization = (updates: Partial<PhotoStriprProps>) => {
    if (PhotoStripData) {
      const updatedData = { ...PhotoStripData, ...updates };
      setPhotoStripData(updatedData);
    }
  };

  if (PhotoToCapture === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 mb-32">
        <div className="max-w-4xl w-full mx-auto">
          <Text as="h2" className="text-center mb-2 font-bold text-2xl">
            Choose Your PhotoStrip Format
          </Text>
          <Text as="p" styleVariant="muted" className="mb-8 text-center">
            Select a layout, then click Continue. You can customize the final
            product later.
          </Text>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center px-4">
            {Object.entries(layoutConfigs).map(([key, cfg]) => (
              <div
                key={key}
                className={`rounded-2xl shadow-md border-2 flex flex-col items-center p-4 transition-all duration-200 cursor-pointer min-w-[180px] max-w-[300px] md:max-w-none h-full md:h-fit w-full mx-auto
                ${selectedLayout === key ? "border-primary " : "border-0"}`}
                onClick={() => setSelectedLayout(key as LayoutKey)}
              >
                <div className="w-full flex justify-center">
                  <PhotoStrip numofphotos={cfg.num} layout={key} />
                </div>
                <div className="mt-4 text-center">
                  <Text as="h3" className="font-bold text-lg mb-1">
                    {cfg.label}
                  </Text>
                  <Text as="p" styleVariant="muted" className="text-sm">
                    {cfg.desc}
                  </Text>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              disabled={!selectedLayout}
              onClick={() => {
                if (!selectedLayout) return;
                const cfg = layoutConfigs[selectedLayout as LayoutKey];
                setPhotoToCapture(cfg.num);
                setPhotoAspectRatio(cfg.aspect);
              }}
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid place-items-center min-h-screen mt-5 pb-20">
      <div className="w-full ">
        {!isCameraAvailable && (
          <Alert
            variant="destructive"
            className="mb-14 max-w-2xl w-full mx-auto"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              It appear we couldn{"'"}t access your camera. Please ensure the
              camera is connected and give permission to the browser.
            </AlertDescription>
          </Alert>
        )}
        {!hasCaptureImage && isCameraAvailable && (
          <Text as="h1" className="text-center mb-8 font-bold">
            Lets Snap!
          </Text>
        )}
        {!hasCaptureImage && isCameraAvailable && (
          <motion.div
            className={`${
              isCapturing
                ? "fixed z-40 grid place-items-center w-screen h-screen inset-0 bg-black/50"
                : "max-w-xl mx-auto "
            }`}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={isCapturing ? { scale: 1.3 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  ...videoConstraints,
                  aspectRatio: PhotoAspectRatio,
                }}
                mirrored={true}
                onUserMediaError={(err) => {
                  setIsCameraAvailable(false);
                  console.error("Webcam Error:", err);
                }}
                className={`${
                  isCapturing
                    ? "w-full max-w-2xl h-auto rounded-lg z-50"
                    : "w-full max-w-xl h-auto rounded-lg"
                }`}
              />
              <AnimatePresence>
                {isCapturing && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: 1,
                      opacity: Countdown === 0 ? 0 : [0.4, 0.2, 0.4],
                      transition: {
                        opacity: {
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      },
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10 flex justify-center items-center bg-black rounded-lg"
                  >
                    <Text as="h1" className="text-white shadow-lg">
                      {Countdown === 0 ? "Snap!" : Countdown}
                    </Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
        <div className="flex flex-col justify-center items-center gap-2 mt-2">
          {!isCapturing && !hasCaptureImage && (
            <div className="max-w-xl w-full">
              {/* Show captured photos if any */}
              {ImageData.length > 0 && ImageData.length < PhotoToCapture && (
                <div className="mb-4">
                  <Text as="p" className="font-semibold mb-2">
                    Captured Photos ({ImageData.length}/{PhotoToCapture})
                  </Text>
                  <div className="flex gap-2 overflow-x-auto">
                    {ImageData.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Captured ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-primary"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Delay timer */}
              {isCameraAvailable && (
                <>
                  <Text as="p" className="font-semibold">
                    Delay between Snaps
                  </Text>
                  <div className="flex justify-between items-center gap-4 my-2">
                    <div className="flex items-center gap-2 p-1 w-fit  rounded-lg ">
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={handleReduceSnapDelay}
                        disabled={isCapturing}
                      >
                        <Minus />
                      </Button>
                      <div className="flex gap-2 items-center">
                        <NumberFlow
                          value={SnapDelay}
                          className="w-fit text-center font-bold text-2xl"
                        />
                        <Text as="p">Seconds</Text>
                      </div>
                      <Button
                        onClick={handleIncreaseSnapDelay}
                        size={"icon"}
                        variant={"ghost"}
                        disabled={isCapturing}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <Button
                      size={"lg"}
                      onClick={handleSnap}
                      disabled={isCapturing}
                    >
                      {isCapturing
                        ? `Capturing... (${ImageData.length}/${PhotoToCapture})`
                        : "Snap!"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {hasCaptureImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Photo Strip Preview */}
              <div className="order-2 lg:order-1">
                <div className="mb-4">
                  <Text as="h3" className="font-semibold mb-2">
                    Your Photo Strip
                  </Text>
                  <Text as="p" styleVariant="muted" className="text-sm">
                    Preview of your photo strip. Click customize to personalize
                    it!
                  </Text>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 my-4">
                  <Button
                    variant="outline"
                    onClick={handleRetake}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    variant={isCustomizing ? "default" : "outline"}
                    onClick={handleCustomize}
                    className="flex-1"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {isCustomizing ? "Customizing" : "Customize"}
                  </Button>
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex mt-4 justify-center">
                  <PhotoStrip
                    data={PhotoStripData}
                    numofphotos={PhotoToCapture}
                    layout={selectedLayout}
                  />
                </div>
              </div>

              {/* Customization Panel */}
              {isCustomizing && (
                <div className="order-1 lg:order-2 mt-20">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Customize Your Photo Strip
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Background Color */}
                      <div className="space-y-2">
                        <Label htmlFor="bg-color">Background Color</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="bg-color"
                            type="color"
                            value={stripBackgroundColor}
                            onChange={(e) => {
                              setStripBackgroundColor(e.target.value);
                              updateCustomization({
                                backgroundColor: e.target.value,
                              });
                            }}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={stripBackgroundColor}
                            onChange={(e) => {
                              setStripBackgroundColor(e.target.value);
                              updateCustomization({
                                backgroundColor: e.target.value,
                              });
                            }}
                            className="flex-1"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-2">
                        <Label htmlFor="text-color">Text Color</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="text-color"
                            type="color"
                            value={stripTextColor}
                            onChange={(e) => {
                              setStripTextColor(e.target.value);
                              updateCustomization({
                                textColor: e.target.value,
                              });
                            }}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={stripTextColor}
                            onChange={(e) => {
                              setStripTextColor(e.target.value);
                              updateCustomization({
                                textColor: e.target.value,
                              });
                            }}
                            className="flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      {/* Title Text */}
                      <div className="space-y-2">
                        <Label htmlFor="strip-title">
                          Title Text (Optional)
                        </Label>
                        <Input
                          id="strip-title"
                          type="text"
                          value={stripTitle}
                          onChange={(e) => {
                            setStripTitle(e.target.value);
                            updateCustomization({ title: e.target.value });
                          }}
                          placeholder="Add a title..."
                        />
                      </div>

                      {/* Color Presets */}
                      <div className="space-y-2">
                        <Label>Color Presets</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStripBackgroundColor("#ffffff");
                              setStripTextColor("#000000");
                              updateCustomization({
                                backgroundColor: "#ffffff",
                                textColor: "#000000",
                              });
                            }}
                            className="h-8"
                          >
                            Classic
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStripBackgroundColor("#000000");
                              setStripTextColor("#ffffff");
                              updateCustomization({
                                backgroundColor: "#000000",
                                textColor: "#ffffff",
                              });
                            }}
                            className="h-8"
                          >
                            Dark
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStripBackgroundColor("#f0f9ff");
                              setStripTextColor("#1e40af");
                              updateCustomization({
                                backgroundColor: "#f0f9ff",
                                textColor: "#1e40af",
                              });
                            }}
                            className="h-8"
                          >
                            Blue
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStripBackgroundColor("#fef7f0");
                              setStripTextColor("#c2410c");
                              updateCustomization({
                                backgroundColor: "#fef7f0",
                                textColor: "#c2410c",
                              });
                            }}
                            className="h-8"
                          >
                            Orange
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStripBackgroundColor("#f0fdf4");
                              setStripTextColor("#166534");
                              updateCustomization({
                                backgroundColor: "#f0fdf4",
                                textColor: "#166534",
                              });
                            }}
                            className="h-8"
                          >
                            Green
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStripBackgroundColor("#fef2f2");
                              setStripTextColor("#dc2626");
                              updateCustomization({
                                backgroundColor: "#fef2f2",
                                textColor: "#dc2626",
                              });
                            }}
                            className="h-8"
                          >
                            Red
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
