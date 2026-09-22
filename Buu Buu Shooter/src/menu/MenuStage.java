package menu;

import application.GameStage;
import javafx.geometry.Pos;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class MenuStage {
    private StackPane root;
    private Scene scene;
    private Stage stage;

    public MenuStage(Stage stage) {
        this.stage = stage;
        this.root = new StackPane();
        this.scene = new Scene(root, 800, 500);

        // --- FIXED: BACK-END IMAGE SCALING ---
        try {
            // Load the image and force it to be exactly 800x500 (smooth scaling)
            Image img = new Image(getClass().getResourceAsStream("/images/HomepageWb.jpg"), 800, 500, false, true);
            BackgroundImage bImg = new BackgroundImage(img,
                BackgroundRepeat.NO_REPEAT, 
                BackgroundRepeat.NO_REPEAT, 
                BackgroundPosition.CENTER,
                BackgroundSize.DEFAULT);
            root.setBackground(new Background(bImg));
        } catch (Exception e) {
            System.out.println("❌ ERROR: HomepageWb.jpg not found in /src/images/");
            root.setStyle("-fx-background-color: black;"); // Fallback
        }

        // --- BUTTON CONTAINER (Centered) ---
        VBox menuBox = new VBox(15);
        menuBox.setAlignment(Pos.CENTER);
        menuBox.setPadding(new Insets(100, 0, 0, 0)); // Lowers buttons slightly

        // --- CREATE BUTTONS ---
        Button startBtn = new Button("Start Game");
        Button aboutBtn = new Button("About");
        Button instrBtn = new Button("Instructions");
        Button exitBtn = new Button("Exit");

        // --- target styling (Pill shape and colors) ---
        String style = "-fx-background-radius: 50; -fx-text-fill: white; -fx-font-size: 16px; -fx-font-weight: bold; -fx-min-width: 200px; -fx-cursor: hand;";
        
        startBtn.setStyle(style + "-fx-background-color: linear-gradient(to right, #6A49C9, #5B3FAF);"); // Purple
        aboutBtn.setStyle(style + "-fx-background-color: linear-gradient(to right, #B06BE3, #8A4FD1);"); // Medium Purple
        instrBtn.setStyle(style + "-fx-background-color: linear-gradient(to right, #C8A9E3, #AF93C9);"); // Light Purple
        exitBtn.setStyle(style + "-fx-background-color: linear-gradient(to right, #F2A7C9, #D88FB6);"); // Pink

        // --- ACTIONS ---
        startBtn.setOnAction(e -> new GameStage(stage));
        aboutBtn.setOnAction(e -> new AboutStage(stage));
        instrBtn.setOnAction(e -> new InstructionStage(stage));
        exitBtn.setOnAction(e -> System.exit(0));

        menuBox.getChildren().addAll(startBtn, aboutBtn, instrBtn, exitBtn);
        this.root.getChildren().add(menuBox);

        this.setStage();
    }

    private void setStage() {
        stage.setTitle("Buu Buu Shots The Bad Guys | MENU");
        stage.setScene(this.scene);
        stage.setResizable(false);
        stage.show();
    }
}