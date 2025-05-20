import { Link } from 'react-router-dom';

const LandingPage = () => {

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
                    src="/assets/codeditor.png"
                    alt="Landing"
                    className="max-w-[800px] w-full h-auto object-contain shadow-lg shadow-gray-500 rounded-lg"
                />
            </div>
        </div>
    );
};

export default LandingPage;
