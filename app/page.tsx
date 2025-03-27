import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";
export default function Home() {
  return (
    <div className="h-screen grid place-items-center">
      <div>
        <Text as="h1" className="text-center font-bold max-w-xl">
          AyoSnap - Photo Booth anywhere, anytime.
        </Text>
        <Text as="p" className="max-w-xl text-center mt-5">
          Welcome to AyoSnap. Free PhotoBooth for you available for free,
          anytime and anywhere. Create Fun memories with your friends and loved
          one!
        </Text>
        <div className="flex gap-2 items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="mt-3 cursor-pointer"
                size={"lg"}
                variant={"outline"}
              >
                Start Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ready for some memories?</DialogTitle>
                <DialogDescription>
                  Start taking your memories with AyoSnap now! AnyTime AnyWhere!
                  oh and please make sure we can access your camera, so we
                  can... you know.... take some photos...
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Link href={"snap"}>
                  <Button>Start Now</Button>
                </Link>
                <Link href={"tutorial"}>
                  <Button variant={"ghost"}>Read the Tutorial</Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            className="mt-3 cursor-pointer"
            size={"lg"}
            variant={"outline"}
            asChild
          >
            <Link href={"tutorial"}>How to Use?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
