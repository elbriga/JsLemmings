import pygame
from assets import Assets

# TODO : Unir Entity e Object
class Object:
    def __init__(self, game, objDef):
        name = objDef["type"]
        x = objDef["x"]
        y = objDef["y"]
        self.game = game
        self.frames = Assets.animations[f"object_{name}"]
        width, height = self.frames[0].get_size()
        self.rect = pygame.Rect(x - width // 2, y - height, width, height)
        self.frame = 0
        self.animTimer = 0
    
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

    def draw(self, screen):
        self.animTimer += 1
        if self.animTimer > 3:
            self.animTimer = 0
            self.frame = (self.frame + 1) % len(self.frames)
        frame = self.frames[self.frame % len(self.frames)]
        screen.blit(frame, self.rect)
        if self.game.debug:
            triggerArea = pygame.Rect(self.x - 6, self.y - 6, 12, 12)
            pygame.draw.rect(screen, (255,0,0), triggerArea, 1)