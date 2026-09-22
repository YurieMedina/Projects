package menu;

import javafx.geometry.Pos;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class InstructionStage {
    public InstructionStage(Stage stage) {
        StackPane root = new StackPane();
        Canvas canvas = new Canvas(800, 500);
        GraphicsContext gc = canvas.getGraphicsContext2D();

        try {
            Image bg = new Image(getClass().getResourceAsStream("/images/InstructionsWB.jpg"));
            gc.drawImage(bg, 0, 0, 800, 500);
        } catch (Exception e) {}

        Button backBtn = new Button("BACK");
        backBtn.setStyle("-fx-background-radius: 50; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 10 30; -fx-background-color: #4B2A84;");

        backBtn.setOnAction(e -> new MenuStage(stage));

        StackPane.setAlignment(backBtn, Pos.BOTTOM_LEFT);
        StackPane.setMargin(backBtn, new Insets(20));

        root.getChildren().addAll(canvas, backBtn);
        stage.setScene(new Scene(root, 800, 500));
        stage.setTitle("INSTRUCTIONS");
    }
}