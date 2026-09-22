package sprites;

import javafx.scene.image.Image;

public class Bullet extends Sprite {
    private int speed = 24; // High velocity bubble gum

    public Bullet(int x, int y) {
        super(x, y);
        this.loadBulletImage();
    }

    private void loadBulletImage() {
        try {
            // Using the specific bubble gum image file and making it large and visible
            Image bulletImg = new Image(getClass().getResourceAsStream("/images/pink_projectile.png"), 50, 50, true, true);
            this.loadImage(bulletImg);
        } catch (Exception e) {
            System.out.println("Could not find the pink_projectile.png image!");
        }
    }

    // This handles the automatic rightward movement
    public void move() {
        this.x += speed;

        // If it leaves the screen, mark it as invisible so the list cleans it up
        if (this.x > 800) {
            this.visible = false;
        }
    }
}