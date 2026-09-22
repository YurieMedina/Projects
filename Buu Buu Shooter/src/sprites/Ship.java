		package sprites;
		
		import java.util.ArrayList;
		import javafx.scene.image.Image;
		
		public class Ship extends Sprite {
		    private ArrayList<Bullet> bullets;
		    private int health = 10000;
		    private double speed = 5; // Changed to double to match Sprite
		    private long lastShotTime = 0;
		    private int shootDelay = 500; 
		
		    public Ship(double x, double y) {
		        super(x, y);
		        this.bullets = new ArrayList<>();
		        try {
		            this.loadImage(new Image(getClass().getResourceAsStream("/images/ship.png"), 50, 50, true, true));
		        } catch (Exception e) {
		            System.out.println("Ship image not found!");
		        }
		    }
		
		    public void move() {
		        this.x += dx;
		        this.y += dy;
		        
		        // Keep ship on screen
		        if (this.x < 0) this.x = 0;
		        if (this.x > 750) this.x = 750;
		        if (this.y < 0) this.y = 0;
		        if (this.y > 450) this.y = 450;
		    }
		
		    public void shoot() {
		        long now = System.currentTimeMillis();
		        if (now - lastShotTime >= shootDelay) {
		            // We pass the ship's current x and y to the bullet
		            // Added casting to (int) if your Bullet constructor still requires ints
		            Bullet newBullet = new Bullet((int)(this.x + 45), (int)(this.y + 15));
		            this.bullets.add(newBullet);
		            lastShotTime = now;
		        }
		    }
		
		    public void addHealth(int amount) {
		        this.health = Math.min(100, this.health + amount);
		    }
		
		    public void increaseSpeed(double amount) {
		        this.speed += amount;
		    }
		
		    public void increaseAtkSpeed(int reduction) {
		        this.shootDelay = Math.max(100, this.shootDelay - reduction);
		    }
		
		    public void resetStats() {
		        this.speed = 5;
		        this.shootDelay = 500;
		    }
		
		    // Getters
		    public double getSpeed() { return speed; }
		    public int getHealth() { return health; }
		    public ArrayList<Bullet> getBullets() { return bullets; }
		    public void takeDamage(int d) { this.health = Math.max(0, this.health - d); }
		}