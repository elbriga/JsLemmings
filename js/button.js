class Button {
  constructor(img, text, x, y, color) {
    this.img = img;
    this.text = text;
    this.color = color;
    this.rect = new Rect(x, y, 50, 100);
  }

  draw(screen) {
    screen.draw.filled_rect(this.rect, this.color);
    screen.blit(this.img, [this.rect.x + 5, this.rect.y + 5]);
  }
}
