
function Spinner() {


    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 z-50">
            <div className="w-8 h-8 border-4 border-white border-dashed rounded-full animate-spin"></div>
        </div>

    )
}

export default Spinner;