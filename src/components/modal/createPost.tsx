import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

interface CreatePostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreatePostModal({ open, setOpen }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select value={location} onValueChange={setLocation}>
          <SelectContent>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Los Angeles">Los Angeles</SelectItem>
            <SelectItem value="Chicago">Chicago</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full" onClick={() => setOpen(false)}>
          Post
        </Button>
      </DialogContent>
    </Dialog>
  );
}
