package com.example.quizzlet.controller;

import com.example.quizzlet.dto.user.UserProfileResponse;
import com.example.quizzlet.dto.user.UserProfileUpdateRequest;
import com.example.quizzlet.dto.user.UserSearchResponse;
import com.example.quizzlet.repository.UserRepository;
import com.example.quizzlet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.search(query));
    }

    @GetMapping("/me")
    public UserProfileResponse getMyProfile() {
        return userService.getMyProfile();
    }

    @PutMapping("/me")
    public UserProfileResponse updateMyProfile(@RequestBody UserProfileUpdateRequest request){
        return userService.updateMyProfile(request);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

}
