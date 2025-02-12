"use client";

import { useState } from "react";
import Image from "next/image";
import { CrimeCaptionOutput } from "@/types/generate";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string>("");
  const [description, setDescription] = useState<CrimeCaptionOutput | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageId(data.id);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleGenerate = async () => {
    if (!imageId) return;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      const description = await res.json();
      setDescription(description);
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFileSelect} className="block w-full" />
          {preview && (
            <div className="relative w-full h-64">
              <Image src={preview} alt="Preview" fill className="object-contain" />
            </div>
          )}
          <button onClick={handleUpload} disabled={!selectedFile} className="px-4 py-2 bg-foreground text-background rounded disabled:opacity-50">
            Upload Image
          </button>
        </div>

        {imageId && (
          <div className="space-y-4">
            <p>Image ID: {imageId}</p>
            <button onClick={handleGenerate} className="px-4 py-2 bg-foreground text-background rounded">
              Generate Description
            </button>
          </div>
        )}

        {description && (
          <div className="p-4 rounded">
            <h3 className="font-bold mb-2">Generated Description:</h3>
            <p>Title: {description.title}</p>
            <p>Description: {description.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
