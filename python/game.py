import pygame
from assets import Assets
from lemming import Lemming
from level import Level
from object import Object

class Game:
    def __init__(self, screen, numLevel):
        self.screen = screen
        self.width, self.height = screen.get_size()
        self.running = True  # Controla o loop principal
        self.quitting = False
        self.endScene = None
        self.lemmings = []
        self.entities = []
        self.level = Level(numLevel)
        self.newLevel = None # Controla o Spawn de um novo Level ou o mesmo (reset)
        self.points = 0
        self.totLemmings = 0
        self.selectedSkill = ""
        self.minHeightToDie = 200
        self.addTimer = 0
        self.paused = False
        self.showMask = False
        self.hovered = None
        self.debug = False
        self.scoreFont = pygame.font.SysFont(None, 40)
        self.skillsFont = pygame.font.SysFont(None, 30)
        Assets.load()
        self.load_objects()
    
    def quit(self):
        if len(self.lemmings) == 0:
            self.running = False
        else:
            self.armaggedon(True)

    def armaggedon(self, quit=False):
        if quit:
            self.quitting = True
        for l in self.lemmings:
            l.set_state("Exploder")
    
    def new(self):
        self.newLevel = self.level.config.number
        if self.points >= self.level.config.numLemmingsToSave:
            # Win!
            self.newLevel += 1
    
    def update(self):
        mx, my = pygame.mouse.get_pos()
        self.hovered = self.get_lemming_near((mx, my))

        if self.paused:
            return
        
        if self.totLemmings < self.level.config.numLemmings and not self.quitting:
            self.addTimer += 0.1
            # Add lemming se o intervalo passou
            if self.addTimer > self.level.config.releaseRate:
                self.addTimer = 0
                self.totLemmings += 1
                self.lemmings.append(Lemming(self))

        # Atualizar os Lemmings
        for lem in self.lemmings[:]:
            if not lem.dead:
                lem.update()
                # Checar pela saida
                if lem.is_near(self.level.config.endPosition, 6):
                    self.points += 1
                    lem.die("gone")
                # Checar se caiu para fora da tela
                elif lem.rect.y > self.height:
                    lem.die("null")

            # Animacao
            lem.animTimer += 1
            if lem.animTimer > 3:
                lem.animTimer = 0
                lem.frame = (lem.frame + 1) % len(lem.frames)
                if lem.frame == 0:
                    lem.on_cycle_anim()
                    if lem.animNext != "":
                        lem.on_change_anim()
                        lem.set_animation(lem.animNext)
                    elif lem.dead:
                        # Remover os lemmings mortos no final da animacao
                        self.lemmings.remove(lem)
                        # Verificar se terminou a fase
                        if len(self.lemmings) == 0:
                            if self.quitting:
                                self.running = False # Quebra o loop principal
                            else:
                                # Mostrar a tela de End Level
                                win = self.points >= self.level.config.numLemmingsToSave
                                self.endScene = pygame.image.load(f'images/end{"Win" if win else "Lose"}.png').convert()
                                self.paused = True

    def draw(self):
        self.screen.fill(self.level.config.backgroundColour)

        # Desenhar o level
        if not self.showMask:            
            self.screen.blit(self.level.terrain, (0, 0))
        else:
            mask_surface = self.level.terrainMask.to_surface(
                setcolor=(255, 255, 255, 255),
                unsetcolor=(0, 0, 0, 0)
            )
            self.screen.blit(mask_surface, (0, 0))
            mask_surface = self.level.blockerMask.to_surface(
                setcolor=(255, 0, 0, 255),
                unsetcolor=(0, 0, 0, 0)
            )
            self.screen.blit(mask_surface, (0, 0))
        # Desenhar os Objetos
        for o in self.entities:
            o.draw(self.screen)
        # Desenhar os Lemmings
        for lem in self.lemmings:
            lem.draw()
        # Desenhar o selecionado
        if self.hovered:
            pygame.draw.circle(self.screen, (0, 255, 0), (self.hovered.x, self.hovered.y - self.hovered.rect.height // 4), 25, 3)
        # Desenhar o score
        text = self.scoreFont.render(f"Lemmings: {len(self.lemmings)} - Pontos: {self.points} / {self.level.config.numLemmingsToSave}", True, (255, 255, 255))
        self.screen.blit(text, (10, 10))
        # Desenhar as Skills
        i = 0
        for key, val in self.level.config.skills.items():
            if val <= 0:
                continue
            colour = (0, 255, 255) if key == self.selectedSkill else (255, 255, 255)
            text = self.skillsFont.render(f"{key}: {val}", True, colour)
            self.screen.blit(text, (400, 10 + i * 20))
            i += 1
        
        if self.endScene:
            w, h = self.endScene.get_size()
            x = self.width // 2 - w // 2
            y = self.height // 2 - h // 2
            self.screen.blit(self.endScene, (x, y))
            b = 5
            pygame.draw.rect(self.screen, (255,255,255,255), (x-b,y-b,w+b,h+b), 10, 10)
    
    def get_lemming_near(self, pos, radius=80):
        best = None
        mx, my = pos
        best_dist = radius * radius
        for lem in self.lemmings:
            dx = lem.x - mx
            dy = lem.y - my
            dist = dx * dx + dy * dy
            if dist < best_dist:
                best = lem
                best_dist = dist
        return best

    def toggle_paused(self):
        self.paused = not self.paused

    def toggle_debug(self):
        self.debug = not self.debug

    def toggle_show_mask(self):
        self.showMask = not self.showMask
    
    def select_skill(self, skillName):
        if skillName in self.level.config.skills:
            self.selectedSkill = skillName
    
    def load_objects(self):
        for objDef in self.level.config.objects:
            # Verificar se existe nos Assets
            type = "object_" + objDef["type"]
            if type in Assets.animations:
                self.entities.append(Object(self, objDef))
            