// pages/teste/criar-pedidos.tsx
import { api } from "@/connection/axios";
import { useEffect } from "react";

export default function CriarPedidos() {
  useEffect(() => {
    async function criarPedidos() {
      const id_usuario = "1000";

      const pedidos = [
        {
          id_usuario,
          valor_total: 32.9,
          forma_pagamento: "Cartão",
          restaurante: {
            nome: "McDonald's - Botafogo (sbo)",
            logo: "https://cdn.mcdonalds.com/logo.png",
          },
          endereco: {
            logradouro: "Rua A",
            numero: "100",
            complemento: "Apto 101",
            bairro: "Centro",
            cidade: "Botafogo",
            estado: "RJ",
          },
          itens: [
            {
              produto: "McOferta Média Clássica",
              qtd_itens: 1,
              valor_calculado: 19.9,
            },
            {
              produto: "McFlurry Kitkat Chocolate com Coco",
              qtd_itens: 1,
              valor_calculado: 13.0,
            },
          ],
        },
        {
          id_usuario,
          valor_total: 59.9,
          forma_pagamento: "PIX",
          restaurante: {
            nome: "Hant's Pizzaria e Esfiharia",
            logo: "https://cdn.pizzariahants.com/logo.png",
          },
          endereco: {
            logradouro: "Rua B",
            numero: "200",
            complemento: "Casa",
            bairro: "Jardim",
            cidade: "São Paulo",
            estado: "SP",
          },
          itens: [
            {
              produto: "PIZZA GRANDE 2 SABORES (8 PEDAÇOS)",
              qtd_itens: 1,
              valor_calculado: 45.0,
            },
            {
              produto: "Refrigerante de 2 litros",
              qtd_itens: 1,
              valor_calculado: 14.9,
            },
          ],
        },
        {
          id_usuario,
          valor_total: 25.0,
          forma_pagamento: "Dinheiro",
          restaurante: {
            nome: "Pastelaria do Zé",
            logo: "https://cdn.pastelariaze.com/logo.png",
          },
          endereco: {
            logradouro: "Rua C",
            numero: "300",
            complemento: "",
            bairro: "Bairro Novo",
            cidade: "Campinas",
            estado: "SP",
          },
          itens: [
            { produto: "Pastel de Carne", qtd_itens: 2, valor_calculado: 10.0 },
            { produto: "Caldo de Cana", qtd_itens: 1, valor_calculado: 5.0 },
          ],
        },
      ];

      try {
        for (const pedido of pedidos) {
          await api.post("/pedido", pedido); // ROTA CORRIGIDA
        }
        alert("Pedidos criados com sucesso!");
      } catch (error) {
        console.error("Erro ao criar pedidos:", error);
      }
    }

    criarPedidos();
  }, []);

  return <div>Enviando pedidos...</div>;
}
