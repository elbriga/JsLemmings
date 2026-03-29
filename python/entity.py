import pygame
from assets import Assets

class Entity:
    def __init__(self, game, width, height):
        self.game = game
        x, y = game.level.config.startPosition
        self.rect = pygame.Rect(x, y - height, width, height)
        self.frames = []
        self.frame = 0
        self.animTimer = 0
        self.animNext = ""
        self.dead = False
    
    @property
    def x(self):
        return self.rect.centerx

    @property
    def y(self):
        return self.rect.bottom

    @property
    def pos(self):
        return (self.x, self.y)

    def update(self):
        pass

    def draw(self):
        pass

    def set_animation(self, name, next=""):
        self.frames = Assets.animations[f"lemming_{name}"]
        self.animNext = next
        self.frame = 0
    
    # Invocado quando a animacao reseta
    def on_cycle_anim(self):
        pass
    
    # Invocado quando a animacao muda no mesmo estado (com animNext)
    def on_change_anim(self):
        pass