package application;

import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Button;
import javafx.stage.Stage;
import menu.MenuStage;

public class GameStage {
    public static final int WINDOW_HEIGHT = 500;
    public static final int WINDOW_WIDTH = 800;

    private Scene scene;
    private Group root;
    private Canvas canvas;
    private GraphicsContext gc;

    public GameStage(Stage stage) {
        this.root = new Group();
        this.canvas = new Canvas(WINDOW_WIDTH, WINDOW_HEIGHT);
        this.gc = canvas.getGraphicsContext2D();
        
        // --- THE BACK BUTTON ---
        Button backBtn = new Button("BACK TO MENU");
        backBtn.setStyle("-fx-background-radius: 20; -fx-background-color: #4B2A84; -fx-text-fill: white; -fx-font-weight: bold;");
        backBtn.setLayoutX(10);
        backBtn.setLayoutY(WINDOW_HEIGHT - 40); // Bottom left
        backBtn.setFocusTraversable(false); // Prevents button from "stealing" keyboard focus from the game
        
        backBtn.setOnAction(e -> {
            new MenuStage(stage);
        });

        this.root.getChildren().addAll(canvas, backBtn);
        this.scene = new Scene(root, WINDOW_WIDTH, WINDOW_HEIGHT);
        
        GameTimer timer = new GameTimer(gc, scene, stage);
        timer.start();

        stage.setScene(scene);
        stage.centerOnScreen();
    }
}