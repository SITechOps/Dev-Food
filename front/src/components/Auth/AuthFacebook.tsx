import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthUserComponent } from "../../hooks/useAuthUser";
import Button from "../ui/Button";
import { FaFacebook } from "react-icons/fa";

interface AuthFacebookProps {
  setEtapa: React.Dispatch<React.SetStateAction<"telefone" | "email">>;
  setFormList: React.Dispatch<
    React.SetStateAction<{ email: string; telefone: string }>
  >;
}

function AuthFacebook({ setEtapa, setFormList }: AuthFacebookProps) {
  const navigate = useNavigate();
  const { loginUser } = useAuthUserComponent();
  const { setAuth } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1359659571817427",
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });

      window.FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    const { email } = user;
    (async () => {
      try {
        await loginUser(email);
      } catch {
        setFormList((prev) => ({ ...prev, email }));
        setEtapa("telefone");
      }
    })();
  }, [user, setAuth]);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1359659571817427",
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });

      window.FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []); // Executa apenas uma vez na montagem do componente

  function loginComFacebook() {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("Welcome! Fetching your information.... ");
          window.FB.api("/me", { fields: "email" }, (userInfo) => {
            console.log("Usuário logado:", userInfo);
            const { email } = userInfo;
            loginUser(email);
            setFormList((prev) => ({ ...prev, email }));
            setEtapa("telefone");
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "email" },
    );
  }

  return (
    <Button
      className="bg-blue-dark hover:bg-blue flex items-center justify-center gap-2 p-2"
      onClick={() => loginComFacebook()}
    >
      <FaFacebook className="size-6" /> Facebook
    </Button>
  );
}

export default AuthFacebook;
