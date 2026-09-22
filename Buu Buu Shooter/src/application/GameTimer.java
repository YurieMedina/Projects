package application;

import sprites.*;
import java.util.ArrayList;
import java.util.Random;
import javafx.animation.AnimationTimer;
import javafx.scene.Scene;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;
import javafx.scene.input.KeyCode;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;

public class GameTimer extends AnimationTimer {

    private GraphicsContext gc;
    private Scene scene;
    private Ship myShip;
    private Boss theBoss = null;
    private Image gameBackground;

    private ArrayList<Fish> fishes = new ArrayList<>();
    private ArrayList<Potion> potions = new ArrayList<>();
    private ArrayList<BossBullet> bossBullets = new ArrayList<>(); // Track boss bullets

    private long startTime;
    private long lastSpawnTime = 0;
    private long lastBossShotTime = 0;

    private int score = 0;
    private Random random = new Random();

    private boolean isSpinning = false;
    private long spinStartTime = 0;
    private String currentPower = "";
    private String[] options = {"SPEED UP", "REGEN", "ATK SPEED"};

    private long powerUpActiveTime = 0;
    private boolean powerUpActive = false;

    public GameTimer(GraphicsContext gc, Scene scene, Stage stage) {
        this.gc = gc;
        this.scene = scene;
        this.myShip = new Ship(400, 250);
        this.startTime = System.currentTimeMillis();

        try {
            this.gameBackground = new Image(
                getClass().getResourceAsStream("/images/GameStageBG.jpg"),
                800, 500, false, true
            );
        } catch (Exception e) {
            System.out.println("❌ Background not found");
        }

        prepareHandlers();
    }

    private void prepareHandlers() {
        scene.setOnKeyPressed(e -> {
            double s = myShip.getSpeed();
            if (e.getCode() == KeyCode.W) myShip.setDY(-s);
            if (e.getCode() == KeyCode.S) myShip.setDY(s);
            if (e.getCode() == KeyCode.A) myShip.setDX(-s);
            if (e.getCode() == KeyCode.D) myShip.setDX(s);
            if (e.getCode() == KeyCode.SPACE) myShip.shoot();
        });

        scene.setOnKeyReleased(e -> {
            if (e.getCode() == KeyCode.W || e.getCode() == KeyCode.S) myShip.setDY(0);
            if (e.getCode() == KeyCode.A || e.getCode() == KeyCode.D) myShip.setDX(0);
        });
    }

    @Override
    public void handle(long now) {
        if (gameBackground != null)
            gc.drawImage(gameBackground, 0, 0);
        else {
            gc.setFill(Color.BLACK);
            gc.fillRect(0, 0, 800, 500);
        }

        long currentTime = System.currentTimeMillis();
        long timeLeft = 180 - (currentTime - startTime) / 1000;

        if (timeLeft <= 0 || myShip.getHealth() <= 0) {
            this.stop();
            drawGameOver();
            return;
        }

        if (currentTime - lastSpawnTime > 250) {
            spawnEnemyFromAllSides();
            lastSpawnTime = currentTime;
        }

        if (timeLeft <= 60 && theBoss == null) {
            theBoss = new Boss(600, 150);
        }

        updateLogic();
        renderHUD(timeLeft);
    }

    private void spawnEnemyFromAllSides() {
        int side = random.nextInt(4);
        double sx = 0, sy = 0;
        switch (side) {
            case 0 -> { sx = random.nextInt(800); sy = -50; }
            case 1 -> { sx = random.nextInt(800); sy = 550; }
            case 2 -> { sx = -50; sy = random.nextInt(500); }
            case 3 -> { sx = 850; sy = random.nextInt(500); }
        }
        Fish f = new Fish((int)sx, (int)sy);
        f.setDX((400 - sx) / 200.0);
        f.setDY((250 - sy) / 200.0);
        fishes.add(f);
    }

    private void updateLogic() {
        myShip.move();

        if (powerUpActive) {
            long timePassed = System.currentTimeMillis() - powerUpActiveTime;
            if (timePassed > 10000) {
                myShip.resetStats();
                powerUpActive = false;
            }
        }

        // Boss Logic
        if (theBoss != null && theBoss.isVisible()) {
            theBoss.track(myShip.getX(), myShip.getY());
            
            // Boss Shooting logic
            long now = System.currentTimeMillis();
            if (now - lastBossShotTime > 1500) {
                bossBullets.add(new BossBullet(theBoss.getX(), theBoss.getY() + 100));
                lastBossShotTime = now;
            }

            if (theBoss.collidesWith(myShip)) {
                myShip.takeDamage(1);
            }
        }

        // Update Boss Bullets
        bossBullets.removeIf(bb -> {
            bb.move();
            if (bb.collidesWith(myShip)) {
                myShip.takeDamage(15);
                return true;
            }
            return !bb.isVisible();
        });

        // Player Bullets
        myShip.getBullets().removeIf(b -> {
            b.move();
            if (theBoss != null && theBoss.isVisible() && b.collidesWith(theBoss)) {
                theBoss.takeDamage(10);
                score += 5;
                return true;
            }
            for (Fish f : fishes) {
                if (b.collidesWith(f)) {
                    f.setVisible(false);
                    score += 20;
                    return true;
                }
            }
            return b.getX() > 800 || b.getX() < 0 || b.getY() > 500 || b.getY() < 0;
        });

        fishes.removeIf(f -> {
            f.move();
            if (f.collidesWith(myShip)) {
                myShip.takeDamage(5);
                return true;
            }
            return !f.isVisible();
        });

        if (potions.size() < 3 && random.nextInt(1000) < 3) {
            potions.add(new Potion(random.nextInt(700), random.nextInt(400)));
        }

        potions.removeIf(p -> {
            if (p.collidesWith(myShip)) {
                isSpinning = true;
                spinStartTime = System.currentTimeMillis();
                return true;
            }
            return false;
        });
    }

    private void renderHUD(long time) {
        myShip.render(gc);
        fishes.forEach(f -> f.render(gc));
        potions.forEach(p -> p.render(gc));
        myShip.getBullets().forEach(b -> b.render(gc));
        bossBullets.forEach(bb -> bb.render(gc));

        if (theBoss != null) theBoss.render(gc);

        // Player Health
        gc.setFill(Color.GRAY);
        gc.fillRect(300, 20, 200, 15);
        gc.setFill(Color.LIME);
        gc.fillRect(300, 20, (myShip.getHealth() / 1000.0) * 200, 15);

        // --- SLAVE KNIGHT GAEL HEALTH BAR ---
        if (theBoss != null && theBoss.isVisible()) {
            double width = 600;
            double height = 15;
            double x = (800 - width) / 2;
            double y = 460;

            gc.setFill(Color.WHITE);
            gc.setFont(Font.font("Times New Roman", FontWeight.BOLD, 18));
            gc.fillText("Slave Knight GAEL", x + 5, y - 8);

            gc.setFill(Color.rgb(20, 20, 20, 0.8));
            gc.fillRect(x - 2, y - 2, width + 4, height + 4);
            
            double healthPercent = (double)theBoss.getHealth() / theBoss.getMaxHealth();
            gc.setFill(Color.DARKRED);
            gc.fillRect(x, y, width, height);
            gc.setFill(Color.RED);
            gc.fillRect(x, y, width * healthPercent, height);
        }

        gc.setFill(Color.WHITE);
        gc.setFont(Font.font("Arial", FontWeight.BOLD, 18));
        gc.fillText("SCORE: " + score + "  TIME: " + time + "s", 20, 35);

        if (isSpinning) {
            long elapsed = System.currentTimeMillis() - spinStartTime;
            if (elapsed < 3000) {
                int index = (int)((elapsed / 100) % options.length);
                currentPower = options[index];
                gc.setFill(Color.YELLOW);
                gc.fillText("ROULETTE: " + currentPower, 320, 100);
            } else {
                currentPower = options[random.nextInt(options.length)];
                applyPowerUp(currentPower);
                isSpinning = false;
                powerUpActive = true;
                powerUpActiveTime = System.currentTimeMillis();
            }
        }

        if (powerUpActive) {
            long remaining = 10 - ((System.currentTimeMillis() - powerUpActiveTime) / 1000);
            gc.setFill(Color.CYAN);
            gc.fillText("BUFF: " + currentPower + " (" + Math.max(0, remaining) + "s)", 320, 60);
        }
    }

    private void applyPowerUp(String power) {
        switch(power) {
            case "SPEED UP" -> myShip.increaseSpeed(4);
            case "REGEN" -> myShip.addHealth(100);
            case "ATK SPEED" -> myShip.increaseAtkSpeed(10);
        }
    }

    private void drawGameOver() {
        gc.setFill(new Color(0, 0, 0, 0.8));
        gc.fillRect(0, 0, 800, 500);
        gc.setFill(Color.RED);
        gc.setFont(Font.font("Arial", FontWeight.BOLD, 50));
        gc.fillText("GAME OVER", 260, 250);
    }
}