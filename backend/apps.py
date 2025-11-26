"""backend.apps

Application configuration for the `backend` Django app. Defines AppConfig
and performs app initialization tasks such as importing signal handlers
so they are registered when Django starts.
"""

from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        # Import signals to ensure they are registered
        import backend.models.signals