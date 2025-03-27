"use client";

import React from "react";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
// Snap Page
const page = () => {
  return (
    <div className="grid place-items-center h-screen pb-20">
      <div className="w-full ">
        <Alert variant="destructive" className="mb-20 w-1/2 mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            It appear we couldn{"'"}t access your camera. Please ensure the
            browser has permission to access your camera.
          </AlertDescription>
        </Alert>
        <Text as="h1" className="text-center mb-8 font-bold">
          Lets Snap!
        </Text>
        <div className="flex flex-col md:flex-row md:justify-between gap-5 border">
          <div className="aspect-video md:w-1/2 border">Camera Container</div>
          <div className="md:w-1/2">test</div>
        </div>
      </div>
    </div>
  );
};

export default page;
