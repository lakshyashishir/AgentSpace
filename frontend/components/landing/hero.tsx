import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Button } from "../ui/button";

const Model = () => {
  const { scene } = useGLTF("/robo.glb");
  const modelRef = useRef();

  useFrame((_state, delta) => {
    if (modelRef.current) {
    //   modelRef.current.rotation.y += delta * 0.2; 
    }
  });

  return <primitive ref={modelRef} object={scene} scale={[2, 2, 2]} />;
};

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-white text-black max-w-screen-xl mx-auto p-4">
      <div className="flex-1 -mb-28 md:mb-0 md:p-4">
        <p className="text-3xl text-center md:text-5xl md:text-left">Next Generation Agents Platform & Marketplace</p>
        <p className="text-xl text-center md:text-3xl mt-4 md:text-left">Run Agents on the Cloud!</p>
        <div className="flex gap-4 mt-4 w-full justify-center md:justify-start">
          <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
              <span>{"Get Started"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                ></path>
              </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </button>
          <Button className="rounded-full shadow-2xl shadow-zinc-900">Docs</Button>
        </div>
      </div>
      <div className="flex-1 h-64 md:h-full w-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>
    </div>
  );
};

export default HeroSection;
