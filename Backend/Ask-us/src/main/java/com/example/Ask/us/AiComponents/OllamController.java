package com.example.Ask.us.AiComponents;


import org.springframework.ai.chat.client.ChatClient;
//import org.springframework.ai.huggingface.HuggingfaceChatModel;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ollama")
public class OllamController {

    private final ChatClient Chatclient;


    public OllamController(@Qualifier("ollamaChatModel")ChatModel chatModel) {
        this.Chatclient = ChatClient.create(chatModel);
    }

    @GetMapping("/{message}")
    public ResponseEntity<String> get(@PathVariable String message) {

        try{

            String message1 = Chatclient.prompt(message).call().content();

            return ResponseEntity.ok(message1);
        }catch(Exception e){
            String error = e.getMessage();
            return ResponseEntity.ok().body(error);
        }
    }
}
