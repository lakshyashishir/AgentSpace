export default function AllAgentsSection() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white text-black max-w-screen mx-auto p-4 px-0">
      <div className="flex-1 md:hidden mb-8">
        <p className="text-3xl text-center">Don't reinvent the wheel</p>
        <p className="text-xl text-center mt-4">Use the best prebuilt agents.</p>
      </div>

      <div className="flex-1 hidden md:block md:ml-8">
        <p className="text-5xl"> Don't reinvent the wheel </p>
        <p className="text-3xl mt-4">Use the best prebuilt agents.</p>
        <p className="text-3xl">Save time and money.</p>
      </div>
      <div className="flex-1 w-full max-w-xl mx-auto md:max-w-none">
        <img src={"agentsLanding.png"} alt="Agents" />
      </div>
    </div>
  );
}
