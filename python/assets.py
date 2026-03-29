import pygame

class Assets:
    animations = {}
    final_width = 10  # x4
    final_height = 20 # x4

    @staticmethod
    def slice_sprites(sheet, total, xi, yi, step, width, height):
        sprites = []
        for i in range(0, total):
            x = xi + i * step
            sprite = pygame.Surface((Assets.final_width, Assets.final_height), pygame.SRCALPHA)
            sprite.blit(sheet, (0, Assets.final_height - height), (x, yi, width, height))
            sprite.set_colorkey((0, 0, 0))
            sprite = pygame.transform.scale2x(sprite)
            sprite = pygame.transform.scale2x(sprite)
            sprites.append(sprite.convert_alpha())
        return sprites

    @classmethod
    def load(cls):
        # https://www.spriters-resource.com/amiga_amiga_cd32/lemmings/asset/37732/
        sheet = pygame.image.load("../images/lemming_sheet.png").convert_alpha()

        cls.animations["lemming_null"]  = cls.slice_sprites(sheet, 1, 0, 0, 16, 10, 10)
        cls.animations["lemming_walk"]  = cls.slice_sprites(sheet, 8, 18, 0, 16, 10, 10)
        cls.animations["lemming_fall"]  = cls.slice_sprites(sheet, 4, 14, 20, 16, 10, 10)
        cls.animations["lemming_open"]  = cls.slice_sprites(sheet, 4, 19, 96, 16, 10, 16)
        cls.animations["lemming_float"] = cls.slice_sprites(sheet, 4, 83, 96, 16, 10, 16)
        cls.animations["lemming_splat"] = cls.slice_sprites(sheet, 16, 19, 138, 16, 10, 10)
        cls.animations["lemming_stop"]  = cls.slice_sprites(sheet, 16, 20, 148, 16, 10, 10)
        cls.animations["lemming_burn"]  = cls.slice_sprites(sheet, 16, 19, 169, 16, 10, 12)
        cls.animations["lemming_dig"]   = cls.slice_sprites(sheet, 16, 20, 247, 16, 10, 14)
        cls.animations["lemming_build"] = cls.slice_sprites(sheet, 16, 19, 195, 16, 10, 13)
        cls.animations["lemming_done"]  = cls.slice_sprites(sheet, 8, 20, 224, 16, 10, 10)
        cls.animations["lemming_boom"]  = cls.slice_sprites(sheet, 16, 19, 128, 16, 10, 10)
        cls.animations["lemming_gone"]  = cls.slice_sprites(sheet, 8, 18, 182, 16, 10, 14)

        # https://opengameart.org/content/explosion
        sheet = pygame.image.load("../images/explosion.png").convert_alpha()
        cls.animations["lemming_explosion"] = []
        explosionSize = 64
        for y in range(0, 4 * explosionSize, explosionSize):
            for x in range(0, 4 * explosionSize, explosionSize):
                sprite = pygame.Surface((explosionSize, 100), pygame.SRCALPHA)
                sprite.blit(sheet, (0, 100 - explosionSize), (x, y, explosionSize, explosionSize))
                #sprite.set_colorkey((0, 0, 0))
                cls.animations["lemming_explosion"].append(sprite.convert_alpha())
        
        # Objects
        cls.animations["object_exit"] = [ pygame.image.load("../images/portal.png").convert_alpha() ]
        cls.animations["object_tnt"]  = [ pygame.image.load("../images/tnt.png").convert_alpha() ]

        sheet = pygame.image.load("../images/tocha.png").convert_alpha()
        cls.animations["object_tocha"]  = cls.slice_sprites(sheet, 4, 0, 0, 38, 38, 68)
