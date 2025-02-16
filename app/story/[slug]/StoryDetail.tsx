import { Story } from "@/utils/model";

const StoryDetail = ({blog} : {blog: Story}) => {
  return (
    <div className="container mx-auto mt-28 mb-24 px-4 max-w-[1170px]">
      <div className="w-full mt-10">
        {/* Nội dung bài viết */}
        <div 
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="prose max-w-none [&_figcaption]:text-center"
        />
      </div>
    </div>
  );
};

export default StoryDetail;
