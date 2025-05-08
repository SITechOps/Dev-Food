from .usuario_route import usuario_route_bp
from .email_route import email_route_bp
from .endereco_route import endereco_route_bp
from .restaurante_route import restaurante_route_bp
from .produto_route import produto_route_bp
from .pedido_route import pedido_route_bp
from .pagamento_route import pagamento_route_bp
from .sms_route import sms_route_bp
from .nota_fiscal_route import nota_fiscal_bp

__all__ = [
    "usuario_route_bp",
    "email_route_bp",
    "endereco_route_bp",
    "restaurante_route_bp",
    "produto_route_bp",
    "pedido_route_bp",
    "pagamento_route_bp",
    "sms_route_bp",
    "nota_fiscal_bp"
]