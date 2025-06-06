#!/bin/bash

set -o errexit

# Instala as dependências
pip install -r requirements.txt

echo "Criando tabelas com db.create_all()..."
flask shell <<< "from app.database import db; db.create_all()"

echo "Atualizando a versão da migração com db stamp head..."
flask db stamp head