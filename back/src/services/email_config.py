def configure_mail(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'devfoodsender@gmail.com'
    app.config['MAIL_PASSWORD'] = 'hmmw mwim ofij jvnd'
    return app