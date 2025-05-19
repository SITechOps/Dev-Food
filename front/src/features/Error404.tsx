import React from "react";

const Error404: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-brown-normal animate-bounce text-5xl font-bold">
        404
      </h1>
      <p>Ops! Esta página não existe.</p>
      <a href="/" className="text-blue hover:underline">
        Voltar à Home
      </a>
    </div>
  );
};

export default Error404;
