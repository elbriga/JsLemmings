#!/usr/bin/env python3
import pygame
from game import Game
from events import Events

# Tamanho da Janela
HEIGHT=800
WIDTH=800

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("PyLemmings")

game = Game(screen, 1)

clock = pygame.time.Clock()
while game.running:
    for event in pygame.event.get():
        Events.exec(game, event)
    
    if game.newLevel:
        game = Game(screen, game.newLevel)

    game.update()
    game.draw()

    pygame.display.flip()
    clock.tick(60) # game.speed

pygame.quit()

