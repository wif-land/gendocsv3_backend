#!/bin/sh

# Inicia la aplicación en segundo plano
npm run start:prod &

# Espera a que la aplicación esté lista
while ! nc -z localhost 3001; do
  sleep 1
done

# Ejecuta las migraciones una vez la aplicación esté lista
npm run migration:run

# Espera a que el proceso de la aplicación termine
wait
