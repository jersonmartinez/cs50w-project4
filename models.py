import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class UserInfo(db.Model):
    __tablename__   = "users_info"
    username        = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    nickname        = db.Column(db.String(80), unique=True, nullable=False)
    email           = db.Column(db.String(80), unique=True, nullable=False)

    def __init__(self, nickname, email, user_id):
        self.nickname   = nickname
        self.email      = email
        self.user_id    = user_id

    def __repr__(self):
        return '<User %r>' % self.nickname

class Users(db.Model):
    __tablename__   = "users"
    id              = db.Column(db.Integer, primary_key=True)
    username        = db.Column(db.String(80), db.ForeignKey("users_info.username"), nullable=False)
    password        = db.Column(db.String(120), nullable=False)

    def __init__(self, username, email):
        self.username   = username
        self.password   = email

    def __repr__(self):
        return '<User %r>' % self.username

class Account(db.Model):
    __tablename__   = "account"
    id              = db.Column(db.Integer, primary_key=True)
    username        = db.Column(db.String, nullable=False)
    currency        = db.Column(db.String, nullable=False)
    name            = db.Column(db.String, nullable=False)
    amount          = db.Column(db.String, nullable=False)
    description     = db.Column(db.String, nullable=False)

    def __init__(self, username, currency, name, amount, description):
        self.username       = username
        self.currency       = currency
        self.name           = name
        self.amount         = amount
        self.description    = description

    def __repr__(self):
        return '<description %r>' % self.description
   
class Movements(db.Model):
    __tablename__   = "movements"
    id              = db.Column(db.Integer, primary_key=True)
    username        = db.Column(db.String, nullable=False)
    account         = db.Column(db.String, nullable=False)
    date            = db.Column(db.String, nullable=False)
    tag             = db.Column(db.String, nullable=False)
    type_charge     = db.Column(db.String, nullable=False)
    currency        = db.Column(db.String, nullable=False)
    amount          = db.Column(db.String, nullable=False)
    description     = db.Column(db.String, nullable=False)

    def __init__(self, username, account, date, tag, type_charge, currency, amount, description):
        self.username       = username
        self.account        = account
        self.date           = date
        self.tag            = tag
        self.type_charge    = type_charge
        self.currency       = currency
        self.amount         = amount
        self.description    = description

    def __repr__(self):
        return '<description %r>' % self.description

db.create_all()

def addUser(user, pwd, nickname):
    usr = Users(user, pwd)
    #db.session.add(usr)
    #db.session.add(UserInfo(nickname, usr.id))


addUser('admin', '1234', 'nick')
addUser('user', '4321', 'nick')

db.session.commit()
users = Users.query.all()
users_info = UserInfo.query.all()
print(users, users_info)

del db