import { Link } from 'react-router-dom';

const LandingPage = () => {

    const features = [
        {
            icon: "🚀",
            title: "Instant Code Execution",
            description: "Run your code instantly in the cloud. No setup, no installations – just write and execute."
        },
        {
            icon: "👥",
            title: "Real-Time Collaboration",
            description: "Code together with teammates. See live cursors, share ideas, and build faster together."
        },
        {
            icon: "💬",
            title: "Integrated Chat",
            description: "Communicate with collaborators directly in your coding room using built-in chat."
        },
        {
            icon: "🔒",
            title: "Secure & Isolated",
            description: "Your code runs in isolated containers. Safe, secure, and private execution every time."
        },
        {
            icon: "🎨",
            title: "Monaco Editor",
            description: "Powered by VS Code's editor with IntelliSense, syntax highlighting, and themes."
        },
        {
            icon: "⚡",
            title: "Lightning Fast",
            description: "Optimized for speed. Start coding in seconds with zero latency execution."
        }
    ];

    const languages = [
        { name: "Python", icon: "🐍", color: "from-yellow-500 to-blue-500" },
        { name: "JavaScript", icon: "📜", color: "from-yellow-400 to-yellow-600" },
        { name: "Java", icon: "☕", color: "from-red-500 to-orange-500" },
        { name: "C++", icon: "⚙️", color: "from-blue-400 to-blue-600" }
    ];

    const steps = [
        { step: "1", title: "Create a Room", description: "Start a solo or collaborative coding session" },
        { step: "2", title: "Write Your Code", description: "Use our powerful Monaco editor with IntelliSense" },
        { step: "3", title: "Execute & Share", description: "Run your code and collaborate in real-time" }
    ];

    return (
        <div className="bg-gray-900 text-white min-h-screen px-6 py-16 flex flex-col items-center w-full">
            {/* Headline Section */}
            <div className="max-w-3xl text-center mb-36">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Write, Run, and add code in real-time with our Online Code Editor
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                    An intuitive and fast online code editor supporting multiple languages. No installations needed. Collaborate in real-time, anywhere.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                    <Link
                        to="/dashboard"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Start Coding
                    </Link>
                    <a
                        href="#features"
                        className="border border-gray-300 hover:border-white text-gray-300 hover:text-white px-6 py-3 rounded-xl transition"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            {/* Centered Image Section */}
            <div className="flex flex-1 justify-center items-center w-full mt-36">
                <img
                    src="/codeditor.png"
                    alt="Landing"
                    className="max-w-[800px] w-full h-auto object-contain shadow-lg shadow-gray-500 rounded-lg"
                />
            </div>

            {/* Features Section */}
            <section id="features" className="w-full max-w-6xl mt-32 scroll-mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose <span className="text-blue-500">CodeSphere</span>?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need to write, run, and collaborate on code – all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300 group"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full max-w-6xl mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It <span className="text-blue-500">Works</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Get started in three simple steps
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    {steps.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center max-w-xs">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-blue-500/30">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute">
                                    <div className="w-24 h-0.5 bg-gray-700 mt-8 ml-32"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Supported Languages Section */}
            <section className="w-full max-w-6xl mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Supported <span className="text-blue-500">Languages</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Write code in your favorite programming language
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {languages.map((lang, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${lang.color} p-[2px] rounded-2xl hover:scale-105 transition-transform duration-300`}
                        >
                            <div className="bg-gray-900 rounded-2xl px-8 py-6 flex flex-col items-center min-w-[140px]">
                                <span className="text-4xl mb-3">{lang.icon}</span>
                                <span className="font-semibold text-lg">{lang.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full max-w-4xl mt-32 mb-16">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Start Coding?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of developers who code, collaborate, and create with CodeSphere.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-lg"
                    >
                        Get Started for Free →
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

