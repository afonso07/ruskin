"use client";

import React, { useCallback } from "react";

import Image from "next/image";
import { useState } from "react";
import { PaintBrushIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import ReactAudioPlayer from "react-audio-player";
const RUSKIN_API_ENDPOINT = "http://localhost:8080/ruskin";

export const Spinner = () => {
  return (
    <svg
      className="animate-spin  h-5 w-5 text-white block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const ImageComponent = ({
  src,
  alt,
  width,
  height,
  setIndex,
  currentIndex,
  elementIndex,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>;
  currentIndex: number | null;
  elementIndex: number;
}) => {
  return (
    <div
      className="rounded-xl"
      onClick={() =>
        setIndex((selectedIndex) =>
          selectedIndex === elementIndex ? null : elementIndex
        )
      }
    >
      <Image
        src={src}
        alt={alt}
        width={0}
        sizes="100vw"
        height={0}
        className={`rounded-xl transition ease-in-out  ${
          currentIndex === elementIndex
            ? "outline outline-blue-400 scale-105"
            : ""
        }`}
        style={{ width: width, height: "auto" }}
      />
    </div>
  );
};

export const imageGroup = [
  "/paula_rego_1.jpeg",
  "/paula_rego_2.jpeg",
  "/paula_rego_3.jpeg",
  "/manu_painting.jpg",
  "/manu_painting2.jpg",
  "/mona_lisa.jpeg",
  "/paula_rego_4.webp",
  "/paula_rego_5.jpg",
];

export const ImageGroupWrapper = ({
  setIndex,
  currentIndex,
}: {
  setIndex: React.Dispatch<React.SetStateAction<number | null>>;
  currentIndex: number | null;
}) => {
  const IMAGE_WIDTH = 150;
  const IMAGE_HEIGHT = 150;

  return imageGroup.map((imagePath, idx) => (
    <ImageComponent
      height={IMAGE_HEIGHT}
      width={IMAGE_WIDTH}
      src={imagePath}
      setIndex={setIndex}
      currentIndex={currentIndex}
      elementIndex={idx}
      alt="Painting"
      key={idx}
    />
  ));
};

export const Canvas = () => {
  const [currentIndex, setIndex] = useState<number | null>(null);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [selectedImageURI, setSelectedImageURI] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendImageDetails = useCallback(async () => {
    if (selectedImageURI === "") return;

    const response = await fetch(RUSKIN_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "X-Metadata",
      },

      body: JSON.stringify({ imageURI: selectedImageURI }),
    });
    const data = await response.blob();
    const url = URL.createObjectURL(data);
    const metadataBuffer = Buffer.from(
      response.headers.get("x-metadata") || "",
      "base64"
    ).toString("utf-8");
    setAudioURL(url);
    setAnalysisText(metadataBuffer);
    setLoading(false);
  }, [selectedImageURI]);

  return (
    <div className="flex w-full absolute top-0 p-4 max-h-screen h-screen overflow-scroll gap-6">
      <div className="grid grid-cols-2 gap-4 px-4 py-2 justify-center max-h-full overflow-y-scroll">
        <ImageGroupWrapper setIndex={setIndex} currentIndex={currentIndex} />
      </div>
      <div className="flex flex-1 flex gap-4 h-full">
        <div className="h-full w-3/5 xl:w-1/3">
          <div className="text-4xl text-[#629ac8] mb-2">ruskin.</div>
          {currentIndex !== null ? (
            <div className=" rounded-xl flex flex-col">
              <div className="relative items-start flex flex-col">
                <Image
                  src={imageGroup[currentIndex]}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  className="rounded-xl"
                  alt="Selected image"
                  priority={true}
                  onChange={() => console.log("changed")}
                  onLoad={(img) => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.currentTarget.naturalWidth;
                    canvas.height = img.currentTarget.naturalHeight;

                    var ctx = canvas.getContext("2d");
                    ctx?.drawImage(img.currentTarget, 0, 0);
                    var dataURL = canvas.toDataURL("image/png");

                    setSelectedImageURI(dataURL);
                  }}
                />

                <div className="flex absolute bottom-2 right-2">
                  <div
                    className="bg-[#629ac8] text-white drop-shadow opacity-98 rounded p-2 justify-center items-center flex mt-4 text-xl w-fit"
                    onClick={() => {
                      if (!loading) {
                        setLoading(true);
                        sendImageDetails();
                      }
                    }}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <PaintBrushIcon width={20} height={20} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-[#495563] h-1/2 opacity-1 gap-4">
              <ArrowLeftIcon width={60} height={60} />
              <div className="text-4xl ">Select a painting</div>
            </div>
          )}
        </div>
        {loading ? (
          <div className="w-2/5 xl:w-2/3 justify-center mt-20 flex opacity-50">
            <div
              role="status"
              className="max-w-2xl w-full h-fit animate-pulse bg-white p-4"
            >
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[720px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[660px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[600px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[720px]"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="w-full w-2/5 xl:w-2/3 items-center mt-20 flex text-base  flex-col gap-10">
            <div>{analysisText}</div>
            {audioURL && <ReactAudioPlayer src={audioURL} autoPlay controls />}
          </div>
        )}
      </div>
    </div>
  );
};
