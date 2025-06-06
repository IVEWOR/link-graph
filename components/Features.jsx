// /components/Features.jsx
import { Code2, Zap, Youtube } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Code2 className="h-16 w-16 text-green-400" strokeWidth={3} />,
      title: "TECH_STACK.EXE",
      description:
        "Display your programming languages, frameworks, and dev tools with interactive skill meters.",
      color: "border-green-400",
    },
    {
      icon: <Zap className="h-16 w-16 text-cyan-400" strokeWidth={3} />,
      title: "CREATOR_KIT.BIN",
      description:
        "Show off your streaming setup, gaming rig, and content creation hardware arsenal.",
      color: "border-cyan-400",
    },
    {
      icon: <Youtube className="h-16 w-16 text-white" strokeWidth={3} />,
      title: "SOCIAL_HUB.SYS",
      description:
        "Connect all platforms, showcase content, and give your audience one unified link portal.",
      color: "border-white",
    },
  ];

  return (
    <section className="py-24 px-4 relative bg-black">
      {/* Floating pixels background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${
              i % 3 === 0
                ? "bg-green-400"
                : i % 3 === 1
                ? "bg-cyan-400"
                : "bg-white"
            } retro-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-green-400 mb-8 pixel-text retro-flicker">
            &gt; BUILT_FOR_
          </h2>
          <h2 className="text-5xl md:text-7xl font-black text-cyan-400 pixel-text">
            CREATORS_
          </h2>
          <div className="mt-8 p-4 border-2 border-green-400 bg-black max-w-4xl mx-auto">
            <p className="text-xl text-green-400 pixel-text">
              // Whether coding or streaming, showcase your complete digital
              identity
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-black border-4 ${feature.color} p-8 hover:bg-gray-900 transition-all duration-300 hover:scale-105 retro-pulse`}
            >
              <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 pixel-text group-hover:retro-flicker">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg pixel-text">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Terminal-style platform showcase */}
        <div className="border-4 border-green-400 bg-black p-12">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold text-green-400 pixel-text retro-flicker">
              &gt; CONNECT_PLATFORMS.BAT
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group cursor-pointer">
              <div className="border-4 border-green-400 bg-black p-6 group-hover:bg-gray-900 transition-colors duration-300 retro-pulse">
                <Youtube
                  className="h-12 w-12 text-green-400 mx-auto"
                  strokeWidth={3}
                />
              </div>
              <span className="text-green-400 pixel-text mt-2 block">
                YOUTUBE
              </span>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="border-4 border-cyan-400 bg-black p-6 group-hover:bg-gray-900 transition-colors duration-300 retro-pulse">
                <Zap
                  className="h-12 w-12 text-cyan-400 mx-auto"
                  strokeWidth={3}
                />
              </div>
              <span className="text-cyan-400 pixel-text mt-2 block">
                TWITCH
              </span>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="border-4 border-white bg-black p-6 group-hover:bg-gray-900 transition-colors duration-300 retro-pulse">
                <Code2
                  className="h-12 w-12 text-white mx-auto"
                  strokeWidth={3}
                />
              </div>
              <span className="text-white pixel-text mt-2 block">
                X/TWITTER
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
