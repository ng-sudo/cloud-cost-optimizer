"""Authentication app intentionally does not define its own user model.

The project uses the custom user model from the users app via
AUTH_USER_MODEL = 'users.User'. Keeping a second User model here can
create confusion and duplicate auth tables in a real deployment.
"""