package com.example.Ask.us.AiComponents;

import org.springframework.ai.chat.model.ChatModel;
//import org.springframework.ai.ollama.HuggingfaceChatModel;
//import org.springframework.ai.ollama.HuggingfaceChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groq")
public class GroqController {

    private final ChatModel chatModel;

    public GroqController(@Qualifier("openAiChatModel")ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/{msg}")
    public ResponseEntity<String> chat(@PathVariable String msg) {
        try{

            String message1 = chatModel.call(msg);

            return ResponseEntity.ok(message1);
        }catch(Exception e){
            String error = e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ai error is"+error);
        }
    }
}
