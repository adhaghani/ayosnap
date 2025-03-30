"use client";
import Webcam from "react-webcam";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text } from "@/components/ui/text";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { PhotoStriprProps } from "@/components/photo-strip";
import PhotoStrip from "@/components/photo-strip";
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
  const videoConstraints = {
    width: {
      min: 320,
      ideal: 1280,
      max: 2560
    },
    height: {
      min: 240,
      ideal: 720,
      max: 1440
    },
    facingMode: "user",
    aspectRatio: { PhotoAspectRatio },
    frameRate: { min: 15, ideal: 30, max: 60 }
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

  const handleChoose63 = () => {
    setPhotoToCapture(4);
    setPhotoAspectRatio(Number(6 / 3) as number);
  };

  const handleChoose34 = () => {
    setPhotoToCapture(6);
    setPhotoAspectRatio(Number(3 / 4) as number);
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
        photos: ImageData
      });
      sethasCaptureImage(true);
    }
  }, [ImageData, PhotoToCapture]);

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

  if (PhotoToCapture === 0) {
    return (
      <div className="grid place-items-center min-h-screen mt-5 pb-32">
        <div className="max-w-2xl w-full">
          <Text as="h2" className=" text-center">
            Choose Your PhotoStrip Styles
          </Text>
          <Text as="p" styleVariant="muted" className="mb-5 mt-1 text-center">
            Don{"'"}t worry, you can always change and customized the final
            product later.
          </Text>
          <motion.div className="flex flex-wrap gap-5">
            <div className="flex-1" onClick={() => handleChoose63()}>
              <PhotoStrip numofphotos={4} />
            </div>
            <div className="flex-1" onClick={() => handleChoose34()}>
              <PhotoStrip numofphotos={6} />
            </div>
          </motion.div>
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
        <Text as="h1" className="text-center mb-8 font-bold">
          Lets Snap!
        </Text>
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
                aspectRatio: PhotoAspectRatio
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
                        ease: "linear"
                      }
                    }
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
        <div className="flex flex-col justify-center items-center gap-2 mt-2">
          {!isCapturing && (
            <div className="max-w-xl w-full">
              {/* Delay timer */}
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
                <Button size={"lg"} onClick={handleSnap} disabled={isCapturing}>
                  {isCapturing ? "Capturing..." : "Snap!"}
                </Button>
              </div>
            </div>
          )}

          {hasCaptureImage && (
            <div className="max-w-xl w-full">
              <PhotoStrip data={PhotoStripData} numofphotos={4} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
