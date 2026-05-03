export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 页面内容 - 加上 padding-top 避免被导航栏遮挡 */}
      <div className="min-h-screen flex items-center justify-center pt-[64px]">
        <h1 className="text-4xl font-bold text-gray-800">
          欢迎来到我的博客
        </h1>
      </div>
    </div>
  );
}
