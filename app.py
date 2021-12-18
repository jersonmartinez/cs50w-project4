import os
import json
from flask import Flask, render_template, request, session, redirect, flash
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL not found!")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

tags_and_subtags = {
    'Hogar': [
        'Construcción y Remodelación',
        'Artículos para el Hogar',
        'Mascotas',
        'Limpieza y Mantenimiento',
        'Muebles y Aparatos Eléctricos',
        'Renta y Compra',
        'Servicios Públicos',
        'Teléfono Celular',
        'Otros Hogar'
    ],
    'Alimentos': [
        'Despensa',
        'Restaurante',
        'Otros Alimentos'
    ],
    'Entretenimiento': [
        'Cine y Música',
        'Juguetes y Videojuegos',
        'Museos y Parques',
        'Suscripciones y Apps',
        'Bares y Restaurantes',
        'Alcohol y Tabaco',
        'Espectáculos y Eventos',
        'Otros Entretenimiento',
    ],
    'Salud y Belleza': [
        'Perfumes y Cosméticos',
        'Salón de belleza',
        'Dentista',
        'Ejercicio y Deportes',
        'Farmacia',
        'Médico',
        'Cuidado Personal',
        'Otros Salud y Belleza'
    ],
    'Auto y Transporte': [
        'Automóvil y Motocicleta',
        'Mantenimiento y Refacciones',
        'Autolavado',
        'Transporte Público',
        'Gasolina',
        'Taxi',
        'Casetas',
        'Estacionamiento',
        'Otros Auto y Transporte'
    ],
    'Educación y Trabajo': [
        'Correo',
        'Servicios Legales',
        'Servicios Contables',
        'Otros Educación y Trabajo',
        'Colegiatura',
        'Papelería',
        'Libros',
        'Software',
        'Otros Servicios Profesionales'
    ],
    'Regalos y Ayuda': [
        'Donaciones',
        'Apoyo a Familiares y Amigos',
        'Regalos',
        'Otros Regalos y Ayuda'
    ],
    'Viajes': [
        'Seguros y Fianzas',
        'Impuestos',
        'Servicios Financieros',
        'Créditos',
        'Ahorro e Inversiones',
        'Otros Finanzas e Impuestos'
    ],
    'Finanzas e Impuestos': [
        'Seguros y Fianzas',
        'Impuestos',
        'Servicios Financieros',
        'Créditos',
        'Ahorro e Inversiones',
        'Otros Finanzas e Impuestos'
    ],
    'Ropa y Calzado': [
        'Calzado',
        'Accesorios',
        'Lavandería y Tintorería',
        'Ropa',
        'Otra Ropa'
    ],
    'Transacciones bancarias': [
        'Pago Tarjeta de Crédito',
        'Cheques',
        'Cajero automático',
        'Transferencias',
        'Otros Transacciones Bancarias'
    ],
    'Ingresos': [
        'Préstamos',
        'Bonos',
        'Reembolsos y Devoluciones',
        'Sueldo',
        'Rentas',
        'Inversiones',
        'Otros Ingresos'
    ]
}

parameters_tags_and_subtags = {
    'Hogar': [
        'red',
        'fa fa-home'
    ],
    'Alimentos': [
        'primary',
        'fas fa-utensils'
    ],
    'Entretenimiento': [
        'dark',
        'fa fa-gamepad'
    ],
    'Salud y Belleza': [
        'info',
        'fa fa-medkit'
    ],
    'Auto y Transporte': [
        'danger',
        'fa fa-car'
    ],
    'Educación y Trabajo': [
        'default',
        'fa fa-university'
    ],
    'Regalos y Ayuda': [
        'warning',
        'fa fa-gift'
    ],
    'Viajes': [
        'info',
        'fa fa-plane'
    ],
    'Finanzas e Impuestos': [
        'success',
        'ni ni-money-coins'
    ],
    'Ropa y Calzado': [
        'warning',
        'fa fa-shopping-cart'
    ],
    'Transacciones bancarias': [
        'success',
        'fa fa-credit-card'
    ],
    'Ingresos': [
        'success',
        'ni ni-money-coins'
    ],
}

@app.route('/')
def index():
    return render_template("index.html", tags_and_subtags=tags_and_subtags, parameters_tags_and_subtags=parameters_tags_and_subtags)

@app.route('/registrarse')
def registrarse():
    return render_template("registrarse.html")

@app.route('/movimientos')
def movimientos():
    return render_template("movimientos.html", tags_and_subtags=tags_and_subtags, parameters_tags_and_subtags=parameters_tags_and_subtags)

@app.route('/categorias')
def categorias():
    return render_template("categorias.html", tags_and_subtags=tags_and_subtags, parameters_tags_and_subtags=parameters_tags_and_subtags)

@app.route('/preferencias')
def preferencias():
    return render_template("preferencias.html")

@app.route("/login", methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    result = db.execute("SELECT * FROM users WHERE username=:username", {"username": username}).fetchone()

    if not result:
        return 'incorrect_username'
    else:
        if check_password_hash(result[2], password):
            result_info = db.execute("SELECT * FROM users_info WHERE username=:username", {"username": username}).fetchone()
            session["username"] = result[1]
            session["nickname"] = result_info[1]

            return 'Ok'
        else:
            return 'incorrect_password'

@app.route("/signin", methods=['POST'])
def signin():
    nickname = request.form.get('nickname')
    username = request.form.get('username')
    password = request.form.get('password')
    email    = request.form.get('email')

    validate_username = db.execute("SELECT * FROM users WHERE username=:username", {"username": username}).rowcount
    
    if validate_username != 0:
        return 'user_exists'
    else:
        validate_email = db.execute("SELECT * FROM users_info WHERE email=:email", {"email": email}).rowcount
        if validate_email != 0:
            return 'email_exists'
        else:
            hashed_password = generate_password_hash(password)
            db.execute("INSERT INTO users_info (username, nickname, email) VALUES (:username, :nickname, :email)", {"username": username, "nickname": nickname, "email": email})
            db.execute("INSERT INTO users (username, password) VALUES (:username, :password)", {"username": username, "password": hashed_password})
            db.commit()
            session["username"] = username
            session["nickname"] = nickname
            return 'Ok'

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/get_accounts", methods=["POST", "GET"])
def get_accounts():
    accounts = db.execute("SELECT * FROM account WHERE username=:username ORDER BY id DESC;", {"username": session['username']}).fetchall()

    if not accounts:
        return json.dumps('there_is_not_records')
    else:
        row = []

        for item in accounts:
            row.append(
                {
                    'id': item['id'], 
                    'currency': item['currency'], 
                    'name': item['name'], 
                    'amount': item['amount'], 
                    'description': item['description']
                }
            )

        return json.dumps(row)

@app.route("/get_movements", methods=["POST", "GET"])
def get_movements():
    movements = db.execute("SELECT * FROM movements WHERE username=:username ORDER BY id DESC;", {"username": session['username']}).fetchall()

    if not movements:
        return json.dumps('there_is_not_records')
    else:
        row = []

        for item in movements:
            row.append(
                {
                    'id': item['id'],
                    'account': item['account'],
                    'date': item['date'],
                    'tag': item['tag'],
                    'type_charge': item['type_charge'],
                    'currency': item['currency'],
                    'amount': item['amount'],
                    'description': item['description']
                }
            )

        return json.dumps(row)

def get_recent_books():
    books = db.execute("SELECT * FROM books ORDER BY year DESC LIMIT 9").fetchall()
    if not books:
        return 'there_is_not_records'
    else:
        return books

def get_old_books():
    books = db.execute("SELECT * FROM books ORDER BY year ASC LIMIT 9").fetchall()
    if not books:
        return 'there_is_not_records'
    else:
        return books

@app.route("/update_account", methods=['POST'])
def update_account():
    id = request.form.get('id')
    name = request.form.get('name')
    amount = request.form.get('amount')
    description = request.form.get('description')
    currency = request.form.get('currency')

    result = db.execute("UPDATE account SET name=:name, amount=:amount, description=:description, currency=:currency WHERE id=:id", {"id": id, "name": name, "amount": amount, "description": description,'currency':currency})

    db.commit()
    if not result:
        return 'not_updated'
    else:
        return 'Ok'

@app.route("/update_movement", methods=['POST'])
def update_movement():
    id = request.form.get('id')
    account = request.form.get('account')
    date = request.form.get('date')
    tag = request.form.get('tag')
    type_charge = request.form.get('type_charge')
    currency = request.form.get('currency')
    amount = request.form.get('amount')
    description = request.form.get('description')

    result = db.execute("UPDATE movements SET account=:account, date=:date, tag=:tag, type_charge=:type_charge, currency=:currency, amount=:amount, description=:description WHERE id=:id", {"id": id, "account": account, "date": date, "tag": tag, "type_charge": type_charge, "currency": currency, "amount": amount, "description": description})

    db.commit()
    if not result:
        return 'not_updated'
    else:
        return 'Ok'

@app.route("/delete_movement", methods=['POST'])
def delete_movement():
    id = request.form.get('id')

    result = db.execute("DELETE FROM movements WHERE id=:id", {"id": id})
    db.commit()
    
    if not result:
        return 'not_deleted'
    else:
        return 'Ok'

@app.route("/delete_account", methods=['POST'])
def delete_account():
    id = request.form.get('id')

    result = db.execute("DELETE FROM account WHERE id=:id", {"id": id})
    db.commit()
    
    if not result:
        return 'not_deleted'
    else:
        return 'Ok'

@app.route("/create_account", methods=['POST'])
def create_account():
    name            = request.form.get('name')
    amount          = request.form.get('amount')
    description     = request.form.get('description')
    currency        = request.form.get('currency')

    result = db.execute("INSERT INTO account (username, currency, name, amount, description) VALUES (:username, :currency, :name, :amount, :description)", {"username": session["username"], "currency": currency, "name": name, "amount": amount, "description": description})
    db.commit()

    if not result:
        return 'not_added'
    else:
        return 'Ok'

@app.route("/create_movement", methods=['POST'])
def create_movement():
    type_charge     = request.form.get('type_charge')
    account         = request.form.get('account')
    tag             = request.form.get('tag')
    date            = request.form.get('date')
    amount          = request.form.get('amount')
    description     = request.form.get('description')
    currency        = request.form.get('currency')

    result = db.execute("INSERT INTO movements (username, type_charge, account, tag, date, amount, description, currency) VALUES (:username, :type_charge, :account, :tag, :date, :amount, :description, :currency)", {"username": session["username"], "type_charge": type_charge, "account": account, "tag": tag, "date": date, "amount": amount, "description": description, "currency": currency})
    db.commit()

    if not result:
        return 'not_added'
    else:
        return 'Ok'

if __name__ == '__main__':
    app.run(debug=True)