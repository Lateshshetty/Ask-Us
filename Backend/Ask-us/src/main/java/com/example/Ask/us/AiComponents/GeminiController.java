package com.example.Ask.us.AiComponents;

import org.springframework.ai.chat.model.ChatModel;
//import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")

public class GeminiController {

    private final ChatModel chatmodel;

    public GeminiController(@Qualifier("googleGenAiChatModel")ChatModel chatmodel) {
        this.chatmodel = chatmodel;
    }
    @GetMapping("/{message}")
    public ResponseEntity<String> message(@PathVariable String message) {
try{

    String message1 = chatmodel.call(message);

    return ResponseEntity.ok(message1);
}catch(Exception e){
    String error = e.getMessage();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ai error is"+error);
}
    }


}
