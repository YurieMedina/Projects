package sprites;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;

public class Potion extends Sprite {

    public Potion(double x, double y) {
        super(x, y);
        this.width = 50;
        this.height = 50;
        try {
            // Load image directly into the 'img' variable inherited from Sprite
            this.img = new Image(getClass().getResourceAsStream("/images/potion.png"), 30, 30, true, true);
        } catch (Exception e) {
            System.out.println("❌ Potion image missing!");
        }
    }

    @Override
    public void render(GraphicsContext gc) {
        if (this.visible && this.img != null) {
            gc.drawImage(this.img, this.x, this.y);
        }
    }

    public void move() {
        // Potions usually stay still, but we keep this to satisfy the Sprite class
    }
}