import { FormEvent, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { api } from "../connection/axios";
import Input from "../componentes/Input";
import Button from "../componentes/Button";
import Menu from "../componentes/Menu";
import ListagemEndereco from "../componentes/ListagemEndereco";
// import { useAuth } from "../connection/AuthProvider";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isGoogleLogin] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userLogado") || "null");
  const idUsuario = getUserId();

  function getUserId() {  
    if (user && user.id) {
      return user.id;
    }
  
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); 
        return payload.sub;
      } catch (error) {
        console.error("Erro ao acessar a conta:", error);
        return null;
      }
    }
    return null;
  }
  

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const response = await api.get(`/user/${idUsuario}`);
      const respUser = response.data?.data?.attributes || [];
      setNome(respUser.nome || "");
      setEmail(respUser.email || "");
      setSenha(respUser.senha || "");
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  // async function alterarDados(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const dados = new FormData(event.currentTarget);
  //   const nome = dados.get("nome")?.toString() || "";
  //   const senha = dados.get("senha")?.toString() || "";
  //   try {
  //     console.log('entrou ')
  //     await api.put(`/user/${idUsuario}`, { nome, senha });

  //     useEffect(() => {
  //       fetchUserData();
  //     }, []);

  //     alert("Usuário alterado com sucesso!");
  //     setIsEditing(false);
  //   } catch (error) {
  //     alert("Erro ao alterar usuário. Tente novamente.");
  //   }
  // }

  async function alterarDados(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const nome = dados.get("nome")?.toString() || "";
    const senha = dados.get("senha")?.toString() || "";
      
    if (!idUsuario) {
      alert("Erro: ID do usuário não encontrado.");
      return;
    }
  
    try {
      console.log("Enviando requisição para alterar dados...");
  
      await api.put(
        `/user/${idUsuario}`,
        { nome, senha },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "X-CSRF-Token": token, 
          },
        }
      );
  
      alert("Usuário alterado com sucesso!");
      setIsEditing(false);
      fetchUserData(); 
    } catch (error) {
      console.error("Erro ao alterar usuário:", error);
      alert("Erro ao alterar usuário. Tente novamente.");
    }
  }

  function handleEditUser() {
    setIsEditing(!isEditing);
  }

  async function deletarDados() {
    const idUsuario = localStorage.getItem("userId");
    try {
      await api.delete(`/user/${idUsuario}`);
      alert("Usuário removido com sucesso!");

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar usuário. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/Login");
  }

  return (
    <>
      <Menu><ListagemEndereco /></Menu>
      <section className="flex flex-col items-center justify-center !m-auto !mt-[3rem] bg-white rounded-md shadow w-[50%] !p-5">

        <div className="flex items-center justify-between w-full">
          <button onClick={() => navigate(-1)} className="self-start">
            <FaAngleLeft className="icon w-10 h-10" />
          </button>

          <h3 className="text-center font-bold">Minha Conta</h3>

          <div id="icones-de-acao" className="flex gap-4 justify-end">
            <div
              id="Editar"
              className="w-10 h-10 flex items-center justify-center bg-[#FDEDEE] rounded-full cursor-pointer hover:bg-[#FAC8CB]"
              onClick={handleEditUser}
            >
              <FiEdit2 className="icon" />
            </div>
            <div
              id="deletar"
              className="w-10 h-10 flex items-center justify-center bg-[#FDEDEE] rounded-full cursor-pointer hover:bg-[#FAC8CB]"
              onClick={deletarDados}
            >
              <AiOutlineDelete className="icon" />
            </div>
          </div>
        </div>

        <form onSubmit={alterarDados} className="text-center !mt-5">

          <p className="mt-3 text-lg flex gap-2 items-center justify-center p-0">
            Nome:
            {isEditing ? (
              <Input type="text" id="nome" value={nome} onChange={setNome} />
            ) : (
              <span className="font-semibold">{nome}</span>
            )}
          </p>

          <p className="mt-3 text-lg flex gap-2 items-center justify-center p-0">
            Email:
            <span className="font-semibold">{email}</span>
          </p>

          {isEditing ? (
            <div className="mt-3 text-lg flex gap-2 items-center justify-center p-0">
              Digite uma nova senha:
              <Input
                type="text"
                id="senha"
                value={senha}
                onChange={setSenha}
                disabled={isGoogleLogin}
              />
            </div>
          ) : null}

          {isEditing && (
            <Button type="submit" className="mt-[3rem]">
              Salvar
            </Button>
          )}

          <Button
            color="outlined"
            className="mt-5 p-2"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </form>
      </section>
    </>
  );
}
