import Leftside from "@/components/main/leftside";
import Rightside from "@/components/main/rightside";
import Feed from "@/components/main/feed";

const Pages = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      {/* Left Sidebar */}
      <div className="hidden lg:block lg:w-1/4 xl:w-1/5 fixed left-0">
        <Leftside />
      </div>

      {/* Main Feed */}
      <div className="w-full lg:w-1/2 xl:w-3/5 lg:ml-[25%] xl:ml-[20%] lg:mr-[25%] xl:mr-[20%]">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block lg:w-1/4 xl:w-1/5 fixed right-0">
        <Rightside />
      </div>
    </div>
  );
};

export default Pages;
