"""Initialize Flask app."""
from flask import Flask, g, request
from flask_assets import Environment
from flask_babel import Babel
from .dashboards import DashboardManager


class App(Flask):
    def __init__(self):
        super().__init__(__name__, instance_relative_config=False)
        self.config.from_object("config.Config")

        self.babel = Babel(self, locale_selector=self.get_locale)
        assets = Environment()
        assets.init_app(self)

        with self.app_context():
            from . import routes
            from .compile import compile_static_assets
            compile_static_assets(assets)
            self.dashboard_manager = DashboardManager(self, "/dashapp/")

    def get_locale(self):
        return getattr(g, 'lang_code', None) or request.accept_languages.best_match(
            self.config['BABEL_SUPPORTED_LOCALES'])
