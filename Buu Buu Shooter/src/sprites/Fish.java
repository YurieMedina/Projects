package sprites;

import javafx.scene.image.Image;

public class Fish extends Sprite {
    private static final int ENEMY_SIZE = 100; 

    public Fish(int x, int y) {
        super(x, y);
        this.loadImage();
    }

    private void loadImage() {
        try {
            Image img = new Image(getClass().getResourceAsStream("/images/fish.png"), 
                                 ENEMY_SIZE, ENEMY_SIZE, true, true);
            this.loadImage(img);
        } catch (Exception e) {
            System.out.println("Error: Could not find fish.png");
        }
    }

    public void move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    public void track(int targetX, int targetY) {
        // Lowered speed from 2 to 1 for slower tracking
        int speed = 1; 
        if (this.x < targetX) this.x += speed;
        else if (this.x > targetX) this.x -= speed;

        if (this.y < targetY) this.y += speed;
        else if (this.y > targetY) this.y -= speed;
    }
}