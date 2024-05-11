"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Trash, Upload, X } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Resizer from "react-image-file-resizer";
import {
  Document,
  PDFViewer,
  StyleSheet,
  Page,
  View,
  Image,
  Text,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },
  conatiner: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 200,
  },
  image: {
    width: "6.2cm",
    height: "6.2cm",
    marginBottom: 20,
  },
});

export default function CustomInputFile({
  label,
  className,
  labelClassName,
}: {
  size?: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  content?: string;
}) {
  const [isUploadOverlayHidden, setIsUploadOverlayHidden] = useState(true);
  const [img, setImg] = useState<String[] | File[] | Blob[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [orderId, setOrderId] = useState<string[]>([]);

  function splitImagesIntoGroups(
    imagesArray: String[] | File[] | Blob[],
    groupSize: number
  ) {
    const resultArray = [];
    const numGroups = imagesArray?.length / groupSize;

    for (let i = 0; i < numGroups; i++) {
      const startIndex = i * groupSize;
      const group = imagesArray?.slice(startIndex, startIndex + groupSize);
      resultArray.push(group);
    }

    return resultArray;
  }

  const images = splitImagesIntoGroups(img!, 6);

  // 6.2cm = 234.331 px
  // 5cm = 188.97637795 px

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        100000,
        100000,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  return (
    <div className={cn("mt-6 w-full", className)}>
      {label && <Label className={cn(labelClassName)}>{label}</Label>}
      <div className="flex items-start flex-col gap-3 mt-2">
        {!img && (
          <Label
            onClick={() => setIsUploadOverlayHidden(false)}
            className="border border-gray-400 p-10 rounded-md flex items-center justify-center w-fit select-none gap-x-3 mx-auto text-xl cursor-pointer"
          >
            <Upload className="text-desc" size={36} />
            Upload
          </Label>
        )}
        {img && img.length > 0 && (
          <div className="flex items-center mx-auto gap-x-4 mb-4">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="cursor-pointer">
                  <Trash
                    onClick={() => {
                      setImg(null);
                    }}
                    className="text-desc"
                    size={40}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Images</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        {/* <div className="grid grid-cols-3 gap-8">
          {img &&
            img?.map((i, idx) => (
              <NextImage
                key={idx}
                src={i as any}
                width={234.331}
                height={234.331}
                alt="uploaded image"
                className="rounded-md w-[234.331px] h-[234.331px]"
              />
            ))}
        </div> */}
      </div>
      {!isUploadOverlayHidden && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => {
              setIsUploadOverlayHidden(true);
              setImg(null);
            }}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white w-2/5 h-1/2 z-50 rounded-md"
          >
            <X
              onClick={() => setIsUploadOverlayHidden(true)}
              className="absolute top-2 right-2 text-desc cursor-pointer"
              size={18}
            />
            <div className="flex flex-col items-center justify-center gap-y-[10px] h-full">
              {img ? (
                <div className="w-full space-y-8">
                  {img?.map((i, idx) => (
                    <NextImage
                      key={idx}
                      className="rounded-lg mx-auto w-[234.331px] h-[234.331px]"
                      src={i as any}
                      height={234.331}
                      width={234.331}
                      alt="Uploaded Image"
                    />
                  ))}
                  <div className="flex items-center justify-around">
                    <Button
                      onClick={() => {
                        setIsUploadOverlayHidden(true);
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (img) {
                          setIsUploadOverlayHidden(true);
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-center text-4xl max-w-[200px] leading-10">
                    drag & drop any files
                  </h1>
                  <span className="text-desc">or</span>
                  <Label
                    htmlFor="organization-logo"
                    className="text-xl text-white bg-blue-600 py-3 px-6 rounded-md cursor-pointer hover:bg-blue-700"
                  >
                    Choose a local file
                  </Label>
                  <Input
                    className="hidden"
                    id="organization-logo"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const resizedImagesPromises = Array.from(
                        e.target.files!
                      ).map(async (img) => {
                        const file = await resizeFile(img);
                        return await file;
                      });
                      const resizedImages = await Promise.all(
                        resizedImagesPromises
                      );

                      setImg(resizedImages as any);
                      setIsUploadOverlayHidden(true);
                    }}
                    multiple
                  />
                </>
              )}
            </div>
          </div>
          {isDragging && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={async (e) => {
                e.preventDefault();

                const resizedImagesPromises = Array.from(
                  e.dataTransfer.files!
                ).map(async (img) => {
                  const file = await resizeFile(img);
                  return await file;
                });
                const resizedImages = await Promise.all(resizedImagesPromises);

                setImg(resizedImages as any);
                setIsUploadOverlayHidden(true);
                setIsDragging(false);
              }}
              className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white w-2/5 h-1/2 z-50 rounded-md p-6"
            >
              <div className="bg-gray-200 border-2 border-blue-600 border-dashed rounded-3xl h-full flex items-center justify-center">
                <h1 className="text-main text-center text-4xl">
                  Drop a file here
                </h1>
              </div>
            </div>
          )}
        </>
      )}

      {img && img.length > 0 && (
        <div className="flex gap-x-5">
          <div className="space-y-5">
            {images.map((_, idx) => (
              <Input
                key={idx}
                className="w-40"
                value={orderId![idx]}
                onChange={(e) =>
                  setOrderId(() => {
                    const newOrderId = [...orderId!];
                    newOrderId[idx] = e.target.value;
                    return newOrderId;
                  })
                }

                placeholder={`Enter Page ${idx + 1} ID`}
              />
            ))}
          </div>
          <PDFViewer style={{ width: "100%", height: "125vh" }}>
            <MyDocument images={images} orderId={orderId ?? []} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}

const MyDocument = ({
  images,
  orderId,
}: {
  images: (String[] | Blob[])[];
  orderId: string[] | null;
}) => {
  return (
    <Document>
      {images.map((group, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <Text
            style={{
              margin: "0 auto",
            }}
          >
            Order Id: {orderId!?.length > 0 && orderId![idx]}
          </Text>
          <View style={styles.conatiner}>
            {group?.map((i, idx: number) => (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image key={idx} src={i as any} style={styles.image} />
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};
