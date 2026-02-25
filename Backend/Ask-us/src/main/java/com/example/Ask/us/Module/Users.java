package com.example.Ask.us.Module;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class Users {

    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;

    private String provider;
    private String Role;

}
