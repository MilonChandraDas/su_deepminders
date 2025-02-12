import Leftside from "@/components/main/leftside"
import Rightside from "@/components/main/rightside"
import Feed from "@/components/main/feed"

const pages = () => {
  return (
    <div className="flex w-full">
      <div className="w-1/4">
        <Leftside />
      </div>
      <div className="w-full">
        <Feed />
      </div>
      <div className="w-1/4">
        <Rightside />
      </div>
    </div>
  )
}

export default pages