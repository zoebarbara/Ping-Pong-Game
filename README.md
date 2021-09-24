# PONG
Tasks list

## Layout
- Header
- Main
  - Menu
  - Game
  - Score

## Estados
- General
  - status: playing | paused
  - scorePlayerA
  - scorePlayerB
- Game
  - playerAPosition
  - playerBPosition
  - ballPosition
  - ballDirection: tl | tr | br | bl

## Acciones
- Jugar
  - General -> status = playing
    - Bola se mueve
    - El ratón puede mover las barras
- Pause
  - General -> status = paused
    - Bola no se mueve
    - El ratón no puede mover las barras
- Nueva partida
  - Reset 
    - scorePlayerA
    - scorePlayerB

## Update
- Recursiva infinita
- Revisar estado: if (paused) return;
- Mover la bola
- Detectar colisión
  - Arriba/abajo -> rebota
  - Barras -> rebota
  - Laterales 
    - Actualiza contadores
    - Empieza nueva bola