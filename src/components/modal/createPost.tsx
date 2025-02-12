import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

export default function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Post</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <Textarea 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            <Select value={location} onValueChange={setLocation}>
              <SelectContent>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={() => setOpen(false)}>Post</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
