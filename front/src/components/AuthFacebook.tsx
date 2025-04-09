import Button from "./Button";
import { FaFacebook } from "react-icons/fa";


export default function AuthFacebook() {

  return (
    <Button
      className="flex items-center justify-center gap-2 bg-blue-escuro hover:bg-blue p-2"
    >
      <FaFacebook className="size-6"/> Facebook
    </Button>
  );
}
