# export_urls.py
"""Generate a markdown table of all URL patterns in a Django project."""
import os
import django
from django.urls import URLResolver, URLPattern, get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shipperdV1.settings')
django.setup()

def list_urls(resolver, prefix=''):
    for pattern in resolver.url_patterns:
        if isinstance(pattern, URLPattern):
            # Direct view pattern
            view_name = f"{pattern.callback.__module__}.{pattern.callback.__name__}" if pattern.callback else ""
            print(f"| {prefix}{pattern.pattern} | {view_name} | {pattern.name or ''} |")
        elif isinstance(pattern, URLResolver):
            # Include() pattern – recurse
            list_urls(pattern, prefix + str(pattern.pattern))

resolver = get_resolver()
print("| URL Path | View | Name |")
print("|----------|------|------|")
list_urls(resolver)
