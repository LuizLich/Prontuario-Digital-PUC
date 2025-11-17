from functools import wraps
from flask import session, redirect, url_for, flash

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # usuário não estiver logado, session["user_id"] não existe
        if "user_id" not in session:
            flash("Você precisa fazer login primeiro.", "warning")
            return redirect(url_for("main.login"))
        return f(*args, **kwargs)
    return decorated_function