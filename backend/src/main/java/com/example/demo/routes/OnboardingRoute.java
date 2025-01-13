package com.example.demo.routes;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.springframework.stereotype.Component;

@Component
public class OnboardingRoute extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        onException(Exception.class)
            .log("Error occurred: ${exception.message}")
            .to("direct:failure-handler");

        from("kafka:new-employees?brokers=localhost:9092") // Listens for new employees
            .log("New employee added: ${body}")
            .to("direct:account-creation"); // Moves to account creation

        from("direct:account-creation")
            .log("Creating account for: ${body}")
            .process(new FailureSimulator("Account creation")) // Simulates failure
            .to("direct:onboarding-tasks"); // Moves to onboarding tasks

        from("direct:onboarding-tasks")
            .log("Issuing laptop, staff pass, and goody bag for: ${body}")
            .process(new FailureSimulator("Onboarding tasks")) // Simulates failure
            .to("log:done"); // Logs completion

        from("direct:failure-handler")
            .log("Failure handled: ${body}");
    }

    // A processor to simulate failures for demonstration purposes
    private static class FailureSimulator implements Processor {
        private final String taskName;

        public FailureSimulator(String taskName) {
            this.taskName = taskName;
        }

        @Override
        public void process(Exchange exchange) throws Exception {
            if (Math.random() < 0.2) { // 20% chance of failure
                throw new Exception(taskName + " failed.");
            }
        }
    }
}
