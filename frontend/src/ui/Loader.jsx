import { Spinner } from "@nextui-org/react";

function Loader() {
    return ( 
        <div className="flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
        <Spinner />
        <p className="ml-2">Loading...</p>
      </div>
     );
}

export default Loader;