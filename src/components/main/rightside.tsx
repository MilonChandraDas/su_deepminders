import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";



const rightside = () => {
  return (
    <div className="fixed right-0 top-0 h-screen w-80 p-6 bg-white border-l">
      {/* User Profile Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-500">@johndoe</p>
          </div>
        </div>
      </div>

      {/* Heat Map Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Activity</h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            <Image
              src="/bd.webp"
              alt="Picture of the author"
              width={500}
              height={500}
              quality={100}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Division
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="cumilla">Cumilla</SelectItem>
                <SelectItem value="chittagong">Chittagong</SelectItem>
                <SelectItem value="sylhet">Sylhet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto pt-4 border-t">
        <p className="text-sm text-gray-500 text-center">
          © 2025 SU_DeepMinders
        </p>
      </div>
    </div>
  );
};

export default rightside;
