"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  ArrowUpFromLine,
  CloudUploadIcon,
  File,
  Loader2,
  PlusCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { useEdgeStore } from "@/lib/edgestore";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

interface AttachmentFormState {
  url: string;
  name: string;
}

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const [file, setFile] = React.useState<File| null>();
  const { edgestore } = useEdgeStore();
  const [name, setname] = useState<string>("");
  const [progress, setprogress] = useState(0);
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    console.log("the file  is ", file);
  }, [file]);

  const onSubmit = async (values: AttachmentFormState) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course attachment updated successfully!");
      setIsEditing(false);
      setFile(null);
      setprogress(0);
      router.refresh();
    } catch (error) {
      console.error("Error updating Course Image:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setisloading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Course attachment is deleted successfully!");

      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-4/5 min-w-[320px]  p-3 md:p-4  bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Course Attachment</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isloading}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div>
          {initialData.attachments.length === 0 && (
            <p className="text-sm text-slate-500 italic">No Attachments</p>
          )}

          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="w-full flex items-center p-2 mb-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md "
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0" />
              <a
                href={attachment.url}
                target="_blank"
                download={attachment.name}
                className="text-sm line-clamp-1 mr-2 cursor-pointer hover:underline text-sky-700"
              >
                {attachment.name}
              </a>
              {deletingId === attachment.id && (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {deletingId !== attachment.id && (
                <button
                  className="ml-auto hover:opacity-75 transition"
                  onClick={() => {
                    onDelete(attachment.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="w-full  ">
          <div
            className="w-full h-[220px] relative rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 hover:bg-sky-100 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center px-6 gap-y-2"
          >


              <div className="bg-sky-200 p-4 rounded-full">
                <CloudUploadIcon className="w-16 h-16 text-sky-600 " />
              </div>
           

            <input
              className="flex items-center bg-white text-sky-800 justify-between"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files?.[0]);
                  setname(e.target.files?.[0].name);
                }
              }}
            />
            <div className="h-[6px] w-44 border rounded overflow-hidden">
              <div
                className="h-full bg-sky-900"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
            <Button
              variant="teacher"
              size="teacher"
              onClick={async () => {
                if (file) {
                  setisloading(true);
                  const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                      setprogress(progress);
                    },
                  });
                  onSubmit({ url: res.url, name: name });
                  console.log("the response is ", res);
                }
              }}
              disabled={isloading||(file=== null)}
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Upload
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mt-3">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentForm;
