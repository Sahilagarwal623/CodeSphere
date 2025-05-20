import React from "react";


function Toggle({ darkTheme, setDarkTheme }) {

    function changeTheme() {
        setDarkTheme(!darkTheme);
    }

    return (

        <label className="inline-flex items-center cursor-pointer">
            <input onChange={changeTheme} type="checkbox" value="" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none
                  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute 
                  after:top-[2px] after:left-[2px] after:bg-white 
                   after:rounded-full after:h-5 after:w-5 after:transition-all 
                   peer-checked:bg-blue-600 relative"></div>
        </label>
    );
}

export default Toggle;