package sprites;

import javafx.scene.image.Image;

public class BossBullet extends Sprite {
    private int speed = 7; 

    public BossBullet(double x, double y) {
        super(x, y);
        try {
            this.loadImage(new Image(
                getClass().getResourceAsStream("/images/red_bullet.png"), 
                40, 30, true, true
            ));
        } catch (Exception e) {
            System.out.println("❌ Boss projectile image not found in src/images/red_bullet.png");
        }
    }

    public void move() {
        this.x -= speed; // Moves toward the player
        if (this.x < -50) {
            this.visible = false;
        }
    }
}