import { useEffect, useState } from "react";
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
  const { loginUser } = useAuthUserComponent();
  const { setAuth } = useAuth();
  const [user, setUser] = useState<any>(null); // Estado para armazenar os dados do usuário do Facebook

  useEffect(() => {
    if (!user) return; // Retorna se não houver usuário

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
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });

      (window as any).FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []); // Executa apenas uma vez na montagem do componente

  function loginComFacebook() {
    (window as any).FB.login(
      (response: { authResponse: any }) => {
        if (response.authResponse) {
          (window as any).FB.api(
            "/me",
            { fields: "email" },
            (userInfo: any) => {
              console.log("Usuário logado:", userInfo.email);
              setUser(userInfo); // Atualiza o estado 'user' com os dados do usuário
            },
          );
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
