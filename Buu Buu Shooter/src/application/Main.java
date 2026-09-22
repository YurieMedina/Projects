package application;

import javafx.application.Application;
import javafx.stage.Stage;
import menu.MenuStage;

public class Main extends Application {
    @Override
    public void start(Stage stage) {
        new MenuStage(stage); // Kick off the menu system
    }

    public static void main(String[] args) {
        launch(args);
    }
}