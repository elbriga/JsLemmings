import pygame

class Events:
    @staticmethod
    def exec(game, event):
        #print(event)
        if game.quitting:
            # Nao tratar eventos na animacao de Quit
            return
        
        if event.type == pygame.QUIT:
            game.quit()

        if game.endScene:
            # Tratar os eventos de End Scene
            if event.type == pygame.KEYDOWN or event.type == pygame.MOUSEBUTTONDOWN:
                game.new()
            return
        
        elif event.type == pygame.KEYDOWN:
            match event.key:
                case pygame.K_q:
                    game.quit()
            
                case pygame.K_p:
                    game.toggle_paused()
                case pygame.K_m:
                    game.toggle_show_mask()
                case pygame.K_F10:
                    game.toggle_debug()

                case pygame.K_b:
                    game.select_skill("Blocker")
                case pygame.K_x:
                    game.select_skill("Exploder")
                case pygame.K_d:
                    game.select_skill("Digger")
                case pygame.K_c:
                    game.select_skill("Builder")
                case pygame.K_g:
                    game.select_skill("Umbrella")
            
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if game.hovered:
                lem = game.hovered
                match event.button:
                    case 1:  # botao esquerdo
                        lem.give_skill()

                    case 2:  # botao meio
                        lem.burn()

                    case 3:  # botao direito
                        lem.jump()