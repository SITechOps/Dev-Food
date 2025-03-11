import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full m-auto mt-5">
      <h1 className="text-3xl font-bold text-center m-2">
      Falta pouco para matar sua fome!
      </h1>
      {/* {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : ( */}
              <Cadastro />
            {/* )} */}
      <button>Sign in with Google 🚀 </button>
    </div>
  );
}
export default App;
