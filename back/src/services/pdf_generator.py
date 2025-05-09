from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from io import BytesIO
from datetime import datetime

class PdfGenerator:
    def __init__(self):
        self.styles = self._setup_styles()
        self.vermelho = HexColor("#F28B82")

    def _setup_styles(self):
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Titulo', parent=styles['Title'], fontSize=14, alignment=TA_CENTER, spaceAfter=6))
        styles.add(ParagraphStyle(name='Subtitulo', parent=styles['Heading2'], fontSize=12, alignment=TA_CENTER, spaceAfter=6))
        styles.add(ParagraphStyle(name='Normal_Center', parent=styles['Normal'], alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='Normal_Right', parent=styles['Normal'], alignment=TA_RIGHT))
        styles.add(ParagraphStyle(name='Info', parent=styles['Normal'], fontSize=8))
        styles.add(ParagraphStyle(name='Footer', parent=styles['Normal'], fontSize=8, alignment=TA_CENTER))
        return styles

    def gerar_nota_fiscal(self, pedido_formatado: dict) -> BytesIO:
        buffer = BytesIO()
        pdf = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=1.5*cm,
            leftMargin=1.5*cm,
            topMargin=1.5*cm,
            bottomMargin=1.5*cm
        )

        self.largura_tela = pdf.width * 0.9
        self.altura_tela = pdf.height
        elementos = self._montar_elementos(pedido_formatado)
        pdf.build(elementos)
        buffer.seek(0)
        return buffer

    def _montar_elementos(self, pedido_formatado):
        elementos = []

        # Cabeçalho
        elementos.append(self._gerar_cabecalho(pedido_formatado))
        elementos.append(Spacer(1, 8*mm))

        # Informações do cliente
        elementos.append(self._gerar_dados_cliente(pedido_formatado))
        elementos.append(Spacer(1, 8*mm))

        # Informações do pedido
        elementos.append(self._gerar_dados_pedido(pedido_formatado))
        elementos.append(Spacer(1, 8*mm))

        # Itens do pedido
        elementos.append(self._gerar_tabela_itens(pedido_formatado))
        elementos.append(Spacer(1, 12*mm))

        # Resumo de valores
        elementos.append(self._gerar_resumo_valores(pedido_formatado))

        # Ajusta o espaço restante e adiciona o rodapé
        altura_atual = sum(elemento.wrap(self.largura_tela, self.altura_tela)[1] for elemento in elementos if hasattr(elemento, 'wrap'))
        espaco_restante = self.altura_tela - altura_atual - 20*mm  # 20mm para o rodapé
        if espaco_restante > 0:
            elementos.append(Spacer(1, espaco_restante))

        rodape_elementos = self._gerar_rodape(pedido_formatado)
        for elemento in rodape_elementos:
            elementos.append(elemento)
        
        return elementos

    def _gerar_cabecalho(self, pedido_formatado):
        endereco_restaurante = pedido_formatado['restaurante']['endereco']
        cabecalho_data = [
            [Paragraph(f"<b>{pedido_formatado['restaurante']['nome']}</b>", self.styles['Titulo']), 
             Paragraph("<b>NOTA FISCAL</b>", self.styles['Titulo'])],
            [Paragraph(f"CNPJ: {pedido_formatado['restaurante'].get('cnpj', 'N/A')}", self.styles['Normal_Center']), 
             Paragraph(f"Nº {pedido_formatado['Id']}", self.styles['Subtitulo'])],
            [Paragraph(
                f"""<b>Endereço:</b> {endereco_restaurante.logradouro}, {endereco_restaurante.numero}
                {f"- {endereco_restaurante.complemento}" if endereco_restaurante.complemento else ""} <br />
                {endereco_restaurante.bairro} • {endereco_restaurante.cidade} • {endereco_restaurante.estado}""",
                self.styles['Normal_Center']
            ),
             Paragraph(f"Série: 001", self.styles['Normal_Center'])],
            [Paragraph(f"<b>Telefone: </b>{pedido_formatado['restaurante'].get('telefone', 'N/A')}", self.styles['Normal_Center']), 
             Paragraph(f"Data de Emissão: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", self.styles['Normal_Center'])]
        ]

        cabecalho = Table(cabecalho_data, colWidths=[self.largura_tela/2, self.largura_tela/2])
        cabecalho.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), self.vermelho),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.black),
            ('LINEAFTER', (0, 0), (0, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        return cabecalho

    def _gerar_dados_cliente(self, pedido_formatado):
        cliente_data = [
            [Paragraph("<b>DADOS DO CLIENTE</b>", self.styles['Normal_Center'])],
            [Paragraph(f"<b>Nome:</b> {pedido_formatado['cliente']}", self.styles['Normal'])],
            [Paragraph(f"<b>Email:</b> {pedido_formatado['email']}", self.styles['Normal'])],
            [Paragraph(f"<b>Telefone:</b> {pedido_formatado['telefone']}", self.styles['Normal'])],
            [Paragraph(f"<b>Endereço:</b> {pedido_formatado['endereco']['logradouro']}, {pedido_formatado['endereco']['numero']} - {pedido_formatado['endereco'].get('complemento', 'N/A')}", self.styles['Normal'])],
            [Paragraph(f"<b>Bairro:</b> {pedido_formatado['endereco']['bairro']} - <b>Cidade:</b> {pedido_formatado['endereco']['cidade']} - <b>Estado:</b> {pedido_formatado['endereco']['estado']}", self.styles['Normal'])]
        ]

        cliente = Table(cliente_data, colWidths=[self.largura_tela])
        cliente.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), self.vermelho),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        return cliente

    def _gerar_dados_pedido(self, pedido_formatado):
        pedido_data = [
            [Paragraph("<b>DADOS DO PEDIDO</b>", self.styles['Normal_Center'])],
            [Paragraph(f"<b>Data do Pedido:</b> {pedido_formatado['data_pedido']}", self.styles['Normal']), 
             Paragraph(f"<b>Forma de Pagamento:</b> {pedido_formatado['forma_pagamento']}", self.styles['Normal'])],
            [Paragraph(f"<b>Status:</b> {pedido_formatado['status']}", self.styles['Normal']), 
             Paragraph(f"<b>Tipo de Entrega:</b> {pedido_formatado['tipo_entrega']}", self.styles['Normal'])]
        ]

        pedido = Table(pedido_data, colWidths=[self.largura_tela/2, self.largura_tela/2])
        pedido.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), self.vermelho),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
            ('SPAN', (0, 0), (1, 0)),  # Mescla as células da primeira linha para centralizar o título
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),  
        ]))
        return pedido

    def _gerar_tabela_itens(self, pedido_formatado):
        tabela_dados = [["Cód.", "Produto", "Qtd.", "Valor Unit. (R$)", "Valor Total (R$)"]]
        for i, item in enumerate(pedido_formatado["itens"]):
            valor_unitario = item.get('valor_unitario', item['valor_calculado'] / item['qtd_itens'])
            tabela_dados.append([
                str(i+1),
                item["produto"],
                str(item["qtd_itens"]),
                f"{valor_unitario:.2f}".replace('.', ','),
                f"{item['valor_calculado']:.2f}".replace('.', ',')
            ])

        tabela = Table(tabela_dados, colWidths=[
            self.largura_tela * 0.08,  # Código
            self.largura_tela * 0.40,  # Produto
            self.largura_tela * 0.12,  # Quantidade
            self.largura_tela * 0.20,  # Valor Unitário
            self.largura_tela * 0.20   # Valor Total
        ])
        tabela.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.vermelho),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('ALIGN', (0, 1), (0, -1), 'CENTER'),
            ('ALIGN', (2, 1), (2, -1), 'CENTER'),
            ('ALIGN', (3, 1), (4, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('GRID', (0, 0), (-1, -1), 0.75, colors.black)
        ]))
        return tabela

    def _gerar_resumo_valores(self, pedido_formatado):
        resumo_valores_data = [
            ["", "", Paragraph("<b>Subtotal:</b>", self.styles['Normal_Right']), 
             Paragraph(f"R$ {pedido_formatado['sub_total']:.2f}".replace('.', ','), self.styles['Normal_Right'])],
            ["", "", Paragraph("<b>Taxa de Entrega:</b>", self.styles['Normal_Right']), 
             Paragraph(f"R$ {pedido_formatado['taxa_entrega']:.2f}".replace('.', ','), self.styles['Normal_Right'])],
            ["", "", Paragraph("<b>TOTAL:</b>", self.styles['Normal_Right']), 
             Paragraph(f"<b>R$ {pedido_formatado['valor_total']:.2f}</b>".replace('.', ','), self.styles['Normal_Right'])]
        ]

        resumo_valores = Table(resumo_valores_data, colWidths=[self.largura_tela * 0.16, self.largura_tela * 0.40, self.largura_tela * 0.26, self.largura_tela * 0.16])
        resumo_valores.setStyle(TableStyle([
            ('ALIGN', (2, 0), (3, -1), 'RIGHT'),
            ('FONTNAME', (2, 2), (3, 2), 'Helvetica-Bold'),
            ('LINEBELOW', (2, 0), (3, 0), 1, colors.black),
            ('LINEBELOW', (2, 1), (3, 1), 0.5, colors.grey),
            ('LINEABOVE', (2, 2), (3, 2), 1, colors.black),
            ('LINEBELOW', (2, 2), (3, 2), 1, colors.black),
            ('BACKGROUND', (2, 2), (3, 2), self.vermelho),  # Destaca a linha do total
        ]))
        return resumo_valores

    def _gerar_rodape(self, pedido_formatado):
        rodape = [
            Paragraph(f"Pedido #{pedido_formatado['Id']} - {pedido_formatado['restaurante']['nome']}", self.styles['Footer']),
            Paragraph(f"Emitido em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}", self.styles['Footer'])
        ]
        return rodape