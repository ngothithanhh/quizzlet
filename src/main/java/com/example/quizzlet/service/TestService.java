package com.example.quizzlet.service;

import com.example.quizzlet.dto.learn.CreateTestRequest;
import com.example.quizzlet.dto.learn.TestCardResponse;
import com.example.quizzlet.dto.learn.TestResultResponse;
import com.example.quizzlet.dto.learn.TestSubmitRequest;

public interface TestService {
    TestCardResponse generate(CreateTestRequest request);
    TestResultResponse submit(TestSubmitRequest request);

}
