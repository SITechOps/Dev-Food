class HttpResponse:
    def __init__(self, body: dict, status_code: int):
        self.status_code = status_code
        self.body = body