from django.test import SimpleTestCase
from django.urls import resolve


class AuthRouteTests(SimpleTestCase):
    def test_auth_endpoints_are_mounted(self):
        self.assertEqual(resolve('/api/auth/register/').view_name, 'register')
        self.assertEqual(resolve('/api/auth/login/').view_name, 'login')
        self.assertEqual(resolve('/api/auth/logout/').view_name, 'logout')
        self.assertEqual(resolve('/api/auth/profile/').view_name, 'profile')
