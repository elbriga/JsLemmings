import pygame
from entity import Entity
from lemmingState import LemmingState

class Lemming(Entity):
    def __init__(self, game, **kwargs):
        Entity.__init__(self, game, 40, 80)
        self.state = None
        self.stateName = ""
        self.stateTimer = 0 # Timer auxiliar para os estados
        self.direction = 1
        self.climbHeight = 5
        self.stepCount = 20 # Quantos degraus tem na bolsa!
        self.falling = 0
        self.hasUmbrella = False
        self.set_state("Faller")  # Faller nao seta a animation!
        self.set_animation("fall")

    def draw(self):
        screen = self.game.screen
        frame = self.frames[self.frame % len(self.frames)]
        if self.direction == -1:
            frame = pygame.transform.flip(frame, True, False)
        screen.blit(frame, self.rect)
        if self.hasUmbrella and self.stateName == "Walker":
            pygame.draw.circle(screen, (255, 255, 0), self.pos, 5)
        if self.game.debug:
            pygame.draw.circle(screen, (255, 0, 0), (self.rect.right, self.rect.bottom + 1), 5)
            pygame.draw.circle(screen, (255, 255, 0), (self.rect.left, self.rect.bottom + 1), 5)
            if self.stateName == "Blocker":
                blockArea = pygame.Rect(self.rect.x, self.rect.centery, 40, 44)
                pygame.draw.rect(screen, (255,0,0), blockArea, 1)

    def update(self, isRecursion=False):
        self.state.update(isRecursion)

    # Repassar os eventos para o estado
    def on_cycle_anim(self):
        self.state.on_cycle_anim()
    def on_change_anim(self):
        self.state.on_change_anim()
    
    def give_skill(self):
        game = self.game
        skill = game.selectedSkill
        if skill != "" and game.level.config.skills[skill] > 0:
            game.level.config.skills[skill] -= 1
            if skill == "Umbrella":
                self.hasUmbrella = True
            else:
                self.set_state(skill)

    def is_near(self, pos, distance):
        myRect = pygame.Rect(self.x - distance, self.y - distance, distance * 2, distance * 2)
        target = pygame.Rect(pos[0] - distance, pos[1] - distance, distance * 2, distance * 2)
        return myRect.colliderect(target)
    
    def is_on_floor(self):
        return (
            self.game.level.is_solid(self.rect.left, self.rect.bottom + 1) or
            self.game.level.is_solid(self.x, self.rect.bottom + 1) or
            self.game.level.is_solid(self.rect.right, self.rect.bottom + 1)
        )

    def floor_height_in_front(self):
        height = 0
        # Achar a altura do chao na frente do lemming, ate a altura que ele consegue subir
        while height <= self.climbHeight:
            # O pixel 'na frente' do lemming depende da direcao dele
            positionInFront = self.rect.right if self.direction == 1 else self.rect.left
            if not self.game.level.is_solid(positionInFront, self.rect.bottom - height):
                break

            height += 1

        return height

    def set_state(self, stateName):
        die = stateName == "Exploder" or stateName == "Dying"
        block = stateName == "Blocker" or self.stateName == "Blocker"

        self.stateName = stateName
        self.stateTimer = 0

        stateClass = LemmingState.states[stateName][0]
        self.state = stateClass(self)
        
        stateAnim = LemmingState.states[stateName][1]
        if stateAnim != "":
            stateAnimN = LemmingState.states[stateName][2]
            self.set_animation(stateAnim, stateAnimN)
        if block or die:
            # Atualizar mascara de block
            self.game.level.build_blocker_mask(self.game.lemmings)
            if die:
                self.dead = True

    def die(self, anim, nextAnim=""):
        self.set_state("Dying")
        self.set_animation(anim, nextAnim)

    def dig(self):
        # Se abaixar!
        self.rect.y += 10
        self.set_state("Digger")
    
    def build(self):
        self.set_state("Builder")

    def burn(self):
        self.die("burn")

    def explode(self):
        self.set_state("Exploder")