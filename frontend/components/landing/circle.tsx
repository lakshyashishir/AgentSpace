import OrbitingCircles from "@/components/magicui/orbiting-circles";
import autoGPT from "@/assets/icons/autoGPT.svg";
import langchain from "@/assets/icons/langchain.svg";
import crewAI from "@/assets/icons/crewAI.svg";
import autoGen from "@/assets/icons/autogen.svg";

export function OrbitingCirclesAgents() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <span className="absolute pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-black z-10">
        AgentSpace
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <img src={autoGPT} alt="AutoGPT" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <img src={langchain} alt="LangChain" />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[80px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <img src={autoGen} alt="AutoGen" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[80px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <img src={crewAI} alt="CrewAI" />
      </OrbitingCircles>
    </div>
  );
}