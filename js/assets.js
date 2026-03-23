class Assets {
    static animations = {}
    static final_width = 10  // x4
    static final_height = 20 // x4

    static slice_sprites(sheet, total, xi, yi, step, width, height) {
        var sprites = [];
        for (var i = 0; i < total; i++) {
            var x = xi + i * step;
            var sprite = new Surface(Assets.final_width, Assets.final_height);
            sprite.blit(sheet, [ 0, Assets.final_height - height ], [ x, yi, width, height ]);
            //sprite.set_colorkey((0, 0, 0));
            sprite = sprite.scale2x();
            sprite = sprite.scale2x();
            sprites.push(sprite);
        }
        return sprites
    }

    static load() {
        // https://www.spriters-resource.com/amiga_amiga_cd32/lemmings/asset/37732/
        var sheet = images.lemming_sheet;

        Assets.animations["lemming_null"]  = Assets.slice_sprites(sheet, 1, 0, 0, 16, 10, 10);
        Assets.animations["lemming_walk"]  = Assets.slice_sprites(sheet, 8, 18, 0, 16, 10, 10);
        Assets.animations["lemming_fall"]  = Assets.slice_sprites(sheet, 4, 14, 20, 16, 10, 10);
        Assets.animations["lemming_open"]  = Assets.slice_sprites(sheet, 4, 19, 96, 16, 10, 16);
        Assets.animations["lemming_float"] = Assets.slice_sprites(sheet, 4, 83, 96, 16, 10, 16);
        Assets.animations["lemming_splat"] = Assets.slice_sprites(sheet, 16, 19, 138, 16, 10, 10);
        Assets.animations["lemming_stop"]  = Assets.slice_sprites(sheet, 16, 20, 148, 16, 10, 10);
        Assets.animations["lemming_burn"]  = Assets.slice_sprites(sheet, 16, 19, 169, 16, 10, 12);
        Assets.animations["lemming_dig"]   = Assets.slice_sprites(sheet, 16, 20, 247, 16, 10, 14);
        Assets.animations["lemming_build"] = Assets.slice_sprites(sheet, 16, 19, 195, 16, 10, 13);
        Assets.animations["lemming_done"]  = Assets.slice_sprites(sheet, 8, 20, 224, 16, 10, 10);
        Assets.animations["lemming_boom"]  = Assets.slice_sprites(sheet, 16, 19, 128, 16, 10, 10);
        Assets.animations["lemming_gone"]  = Assets.slice_sprites(sheet, 8, 18, 182, 16, 10, 14);

        // https://opengameart.org/content/explosion
        sheet = images.explosion;
        Assets.animations["lemming_explosion"] = [];
        var explosionSize = 64;
        for (var y = 0; y < 4 * explosionSize; y += explosionSize) {
            for (var x = 0; x < 4 * explosionSize; x += explosionSize) {
                var sprite = new Surface(explosionSize, 100);
                sprite.blit(sheet, [ 0, 100 - explosionSize ], [ x, y, explosionSize, explosionSize ]);
                //sprite.set_colorkey((0, 0, 0));
                Assets.animations["lemming_explosion"].push(sprite);
            }
        }
        
        // Objects
        Assets.animations["object_exit"] = [ images.portal ];
        Assets.animations["object_tnt"]  = [ images.tnt ];

        //sheet = pygame.image.load("images/tocha.png").convert_alpha();
        //Assets.animations["object_tocha"]  = cls.slice_sprites(sheet, 4, 0, 0, 38, 38, 68);
    }
}