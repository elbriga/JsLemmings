class LemmingState:
    def __init__(self, lemming):
        self.lem = lemming
    def update(self, isRecursion=False):
        pass
    def on_cycle_anim(self):
        pass
    def on_change_anim(self):
        pass

class Blocker(LemmingState):
    pass

class Walker(LemmingState):
    def update(self, isRecursion=False):
        lem = self.lem

        if lem.falling > lem.game.minHeightToDie:
            lem.die("splat")
            return
        lem.falling = 0

        if not lem.is_on_floor():
            lem.set_state("Faller")
            if not isRecursion:
                lem.update(True)
            return

        height = lem.floor_height_in_front()
        if height > lem.climbHeight:
            lem.direction *= -1
            return
        
        # Andar
        lem.rect.x += lem.direction
        # Subir o terreno se preciso
        lem.rect.y -= height

        lem.stateTimer += 1
        if lem.stateTimer == 10:
            lem.set_animation("walk")

class Faller(LemmingState):
    def update(self, isRecursion=False):
        lem = self.lem
        if lem.is_on_floor():
            lem.set_state("Walker")
            if not isRecursion:
                lem.update(True)
            return

        if lem.falling > 100:
            delta = 4
        elif lem.falling > 50:
            delta = 3
        else:
            delta = 2
        lem.rect.y += delta
        lem.falling += delta

        if lem.falling > 100:
            if lem.hasUmbrella:
                lem.set_state("Floater")
        elif lem.falling > 20 and lem.falling < 26:
            lem.set_animation("fall")

class Floater(LemmingState):
    def update(self, isRecursion=False):
        lem = self.lem
        if lem.is_on_floor():
            lem.set_state("Walker")
            return

        lem.rect.y += 1

class Digger(LemmingState):
    def update(self, isRecursion=False):
        lem = self.lem
        lem.stateTimer += 1
        if lem.stateTimer > 20:
            lem.stateTimer = 0
            # Dig
            lem.game.level.dig((lem.rect.x - 2, lem.rect.bottom - 10))
            lem.rect.y += 3
            if not lem.is_on_floor():
                lem.game.level.dig((lem.rect.x - 2, lem.rect.bottom - 10))
                lem.set_state("Faller")

class Exploder(LemmingState):
    def on_change_anim(self):
        lem = self.lem
        lem.game.level.dig_hole(lem.pos)
        lem.rect.x -= 12 # HACK feio! Explosao é maior

class Builder(LemmingState):
    def on_cycle_anim(self):
        lem = self.lem
        if lem.stateTimer >= lem.stepCount:
            lem.set_state("Walker")
            return
        elif lem.stateTimer >= lem.stepCount - 1:
            lem.set_animation("done")
        # Novo degrau
        lem.game.level.add_step(lem.pos, lem.direction)
        lem.rect.x += (4 * lem.direction)
        lem.rect.y -= 4
        lem.stateTimer += 1 # Contar os degraus

class Dying(LemmingState):
    pass
        
# TODO relacionar com o nome da animacao e usar no set_state
LemmingState.states = {
    "Blocker":  (Blocker,  "stop",  ""),
    "Walker":   (Walker,   "",      "") ,
    "Faller":   (Faller,   "",      ""),  # Faller nao seta anim automatico
    "Floater":  (Floater,  "open",  "float"),
    "Digger":   (Digger,   "dig",   ""),
    "Exploder": (Exploder, "boom",  "explosion"),
    "Builder":  (Builder,  "build", ""),
    "Dying":    (Dying,    "",      ""),  # Usado no lemming.die()
}
