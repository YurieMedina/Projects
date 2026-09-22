package sprites;

import javafx.geometry.Rectangle2D;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;

public class Sprite {
    protected Image img;
    // Changed to double to allow slow/smooth movement
    protected double x, y, dx, dy; 
    protected boolean visible = true;
    protected double width, height;

    public Sprite(double x, double y) {
        this.x = x;
        this.y = y;
    }

    protected void loadImage(Image img) {
        this.img = img;
        this.width = img.getWidth();
        this.height = img.getHeight();
    }

    public void render(GraphicsContext gc) {
        if (visible && img != null) {
            gc.drawImage(this.img, this.x, this.y);
        }
    }

    public Rectangle2D getBounds() { 
        return new Rectangle2D(x, y, width, height); 
    }
    
    public boolean collidesWith(Sprite s) { 
        return getBounds().intersects(s.getBounds()); 
    }
    
    // Updated setters to accept double (fix for the compilation error)
    public void setDX(double dx) { this.dx = dx; }
    public void setDY(double dy) { this.dy = dy; }
    
    public double getX() { return x; }
    public double getY() { return y; }
    
    public boolean isVisible() { return visible; }
    public void setVisible(boolean v) { this.visible = v; }
}