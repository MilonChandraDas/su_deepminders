import { useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { crimeReportsApi } from "@/lib/api-client";
import { districts } from "@/lib/districts";

interface CreatePostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreatePostModal({ open, setOpen, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [districtId, setDistrictId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));

      try {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const { id: imageId } = await uploadRes.json();
        setFileId(imageId);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image. Please try again.");
        setSelectedFile(null);
        setPreview(null);
      }
    }
  };

  const handleGenerate = async () => {
    if (!fileId) return;
    setIsGenerating(true);

    try {
      // Generate the description using the already uploaded file
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: fileId }),
      });
      const { title: genTitle, description: genDescription } = await genRes.json();

      setTitle(genTitle);
      setDescription(genDescription);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !districtId) return;
    setIsLoading(true);

    try {
      if (!fileId) {
        alert("Please generate the title and description first");
        throw new Error("File not uploaded");
      }

      await crimeReportsApi.create({
        title,
        description,
        districtId: parseInt(districtId),
        fileId,
      });

      setTitle("");
      setDescription("");
      setDistrictId("");
      setSelectedFile(null);
      setPreview(null);
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select value={districtId} onValueChange={setDistrictId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="1">District 1</SelectItem> */}
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input type="file" accept="image/*" onChange={handleFileSelect} />
            {preview && (
              <>
                <div className="relative w-full h-48">
                  <Image src={preview} alt="Preview" fill className="object-contain rounded-md" />
                </div>
                <Button className="w-full" onClick={handleGenerate} disabled={isGenerating || !selectedFile} variant="secondary">
                  {isGenerating ? "Generating..." : "Generate Title & Description"}
                </Button>
              </>
            )}
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={isLoading || !title || !description || !districtId}>
            {isLoading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
