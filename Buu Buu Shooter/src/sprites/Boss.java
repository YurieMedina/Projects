package sprites;

import javafx.scene.image.Image;

public class Boss extends Sprite {
    private int health = 1000; 
    private int maxHealth = 1000;

    public Boss(int x, int y) {
        super(x, y);
        try {
            // Updated to look for the image in your src/images folder
            this.loadImage(new Image(
                getClass().getResourceAsStream("/images/gael.png"), 
                250, 250, true, true
            ));
        } catch (Exception e) {
            System.out.println("❌ Boss image not found! Ensure it is named gael.png in src/images");
        }
        this.setVisible(true);
    }

    public void track(double targetX, double targetY) {
        double speed = 0.8; 
        if (this.x < targetX) this.x += speed;
        else if (this.x > targetX) this.x -= speed;
        if (this.y < targetY) this.y += speed;
        else if (this.y > targetY) this.y -= speed;
    }

    public void takeDamage(int amount) {
        health -= amount;
        if (health <= 0) this.setVisible(false);
    }

    public int getHealth() { return health; }
    public int getMaxHealth() { return maxHealth; }
}