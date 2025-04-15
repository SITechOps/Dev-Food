import Button from "../Button";
import { FaFacebook } from "react-icons/fa";

export default function AuthFacebook() {
  return (
    <Button className="bg-blue-dark hover:bg-blue flex items-center justify-center gap-2 p-2">
      <FaFacebook className="size-6" /> Facebook
    </Button>
  );
}
