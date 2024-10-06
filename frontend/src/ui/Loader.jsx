import { Spinner } from "@nextui-org/react";

function Loader() {
  return (
    <div className="flex justify-center items-center fixed inset-0 z-50">
      <Spinner />
      <p className="ml-2">Loading...</p>
    </div>
  );
}

export default Loader;
