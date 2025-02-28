export default function Home() {
	const nome = localStorage.getItem("nomeUsuario");
	const email = localStorage.getItem("nomeEmail");

	return (
		<div>
			<h1 className="text-3xl text-center text-stone-800 font-bold p-6">
				Cadastro realizado!
			</h1>
			<div className="p-6">
				<p className="text-2xl text-center text-stone-800 font-bold">
					Nome: {nome}
				</p>
				<p className="text-2xl text-center text-stone-800 font-bold">
					E-mail: {email}
				</p>
			</div>
		</div>
	);
}


