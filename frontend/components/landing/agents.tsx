import { OrbitingCirclesAgents } from "@/components/landing/circle";

export default function AgentsSection() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white text-black max-w-screen mx-auto p-4 px-0">
      <div className="flex-1 md:hidden mb-8">
        <p className="text-3xl text-center">Any Agent Framework</p>
        <p className="text-xl text-center mt-4">
          Easily integrate with various agent frameworks and run them seamlessly.
        </p>
      </div>
      <div className="flex-1 w-full max-w-xl mx-auto md:max-w-none">
        <OrbitingCirclesAgents />
      </div>
      <div className="flex-1 hidden md:block md:ml-20 md:pr-20">
        <p className="text-5xl">Any Agent Framework</p>
        <p className="text-3xl mt-4">
        Easily integrate with various agent
        </p>
        <p className="text-3xl">
        frameworks and run them seamlessly.
        </p>
      </div>
    </div>
  );
}