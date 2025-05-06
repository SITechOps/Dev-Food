from src.controllers.pedidos_manager import PedidosManager
from src.http_types.http_request import HttpRequest
from src.main.handlers.custom_exceptions import NotFound
from src.main.utils.response_formatter import ResponseFormatter
from src.services.email_sender import EmailSender
from src.services.pdf_generator import PdfGenerator

class NotaFiscalManager:
    def __init__(self, pedidos_manager: PedidosManager, gerador_pdf: PdfGenerator, email_sender: EmailSender):
        self.pedidos_manager = pedidos_manager
        self.gerador_pdf = gerador_pdf
        self.email_sender = email_sender


    def processar_nota_fiscal(self, http_request: HttpRequest):
        try:
            id_pedido = http_request.body.get("id_pedido")
            pedido = self.pedidos_manager.pedidos_repo.find_by_id(id_pedido)
            if not pedido:
                raise NotFound("Pedido")

            pedido_formatado = self.pedidos_manager.format_response([pedido])["pedidos"][0]

            pdf_buffer = self.gerador_pdf.gerar_nota_fiscal(pedido_formatado)
            self.email_sender.send_pdf(pedido_formatado.get("email"), pdf_buffer, id_pedido)
            return ResponseFormatter.display_operation("Nota fiscal", "enviada")
        
        except Exception as e:
            raise e