import { DotLoader } from "react-spinners";

export function Loading() {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-white">
      <DotLoader color="var(--color-brown-normal" />
    </div>
  );
}
