
"use client";

import { FileVideo, ArrowUpFromLine, Image as ImageDownIcon } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useState } from "react";

interface FileUploadProps {
  isImage: boolean;
  onChange: (info?: string | CloudinaryUploadWidgetInfo) => void;
  className?: string;
}

function FileUploader({ onChange, isImage, className = "" }: FileUploadProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <CldUploadWidget
        signatureEndpoint="/api/signcloudinary"
        onSuccess={(result) => {
          onChange(result?.info);
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
        onError={(error) => {
          console.log('error', error);
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            open();
          }
          return (
            <div 
              onClick={handleOnClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="w-full h-[250px] relative rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 hover:bg-sky-100 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center px-6"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-32 h-32 rounded-full bg-sky-200 animate-pulse"></div>
              </div>
              
              <div className={`transform transition-transform duration-300 ${isHovering ? 'scale-110' : 'scale-100'}`}>
                {isImage ? (
                  <div className="bg-sky-100 p-6 rounded-full">
                    <ImageDownIcon className="w-16 h-16 text-sky-600" />
                  </div>
                ) : (
                  <div className="bg-sky-100 p-6 rounded-full">
                    <FileVideo className="w-16 h-16 text-sky-600" />
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center flex flex-col items-center">
                <p className="text-lg font-medium text-sky-700 mb-2">
                  {isImage ? "Upload an Image" : "Upload a Video"}
                </p>
                <p className="text-sm text-sky-500 mb-4">
                  {isImage 
                    ? "Drag and drop an image or click to browse" 
                    : "Drag and drop a video or click to browse"}
                </p>
                
                <button className={`
                  flex items-center justify-center space-x-2
                  px-4 py-2 rounded-lg
                  bg-sky-600 hover:bg-sky-700 
                  text-white font-medium
                  shadow-md hover:shadow-lg
                  transition-all duration-300
                  ${isHovering ? 'transform -translate-y-1' : ''}
                `}>
                  <ArrowUpFromLine className="w-4 h-4" />
                  <span>{isImage ? "Select Image" : "Select Video"}</span>
                </button>
              </div>
              
              <p className="text-xs text-sky-400 mt-4">
                {isImage 
                  ? "Supported formats: JPG, PNG, GIF, WEBP" 
                  : "Supported formats: MP4, MOV, WEBM"}
              </p>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default FileUploader;