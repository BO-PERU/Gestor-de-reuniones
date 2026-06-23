#!/bin/bash
cd "/Users/mariocamino/Documents/antigravity/friendly-maxwell"

# Matar cualquier proceso usando el puerto 8080 para evitar conflictos
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Iniciar servidor web local en segundo plano
python3 -m http.server 8080 &

# Esperar un segundo para que levante
sleep 1

# Abrir en el navegador predeterminado
open http://localhost:8080
